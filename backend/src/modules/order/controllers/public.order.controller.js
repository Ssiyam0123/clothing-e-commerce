import Order from "../order.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../../../middleware/asyncHandler.js";
import { clearCache } from "../../../middleware/cacheMiddleware.js";
import {
  calculateValidatedOrder,
  normalizeShippingAddress,
  finalizeOrderProcessing
} from "../order.utils.js";
import { createOrderWithTransaction } from "../order.service.js";
import {
  initiateSSLCommerz,
  initiateBkash,
  handleCODGateway,
} from "../order.gateway.js";
import bkashService from '../../../services/bkash.service.js';
import PageSetting from "../../settings/settings.model.js";
import ApiKey from "../../settings/apiKey.model.js";
import { decrypt } from "../../../utils/encryption.js";
import PDFDocument from "pdfkit";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

const getUserIdFromReq = (req) => {
  const id = req.user?._id || req.user?.id || req.headers["x-guest-id"];
  return id ? id.toString() : null;
};

export const initPayment = asyncHandler(async (req, res) => {
  console.log("🚀 ORDER INITIATION PROTOCOL STARTED", {
    userId: getUserIdFromReq(req),
    itemsCount: req.body.orderItems?.length,
    paymentMethod: req.body.paymentMethod
  });

  const {
    orderItems,
    shippingAddress,
    isDirectBuy,
    couponCode,
    shippingPrice,
    deliveryZone,
    paymentMethod = "ssl",
  } = req.body;
  
  const userId = getUserIdFromReq(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Identity required. Please provide a Guest Session or Login.",
    });
  }

  const isRegisteredUser = mongoose.Types.ObjectId.isValid(userId);
  const settings = await PageSetting.findOne();
  const apiKeys = await ApiKey.findOne();
  
  if (!settings) {
     console.error("❌ SETTINGS NOT INITIALIZED");
     throw new Error("Settings not initialized.");
  }

  const sslCreds = {
    storeId: apiKeys?.sslStoreId || process.env.SSL_STORE_ID,
    storePassword: apiKeys?.sslStorePassword ? decrypt(apiKeys.sslStorePassword) : process.env.SSL_STORE_PASSWORD
  };

  const bkashCreds = {
    appKey: apiKeys?.bkashAppKey || process.env.BKASH_APP_KEY,
    appSecret: apiKeys?.bkashAppSecret ? decrypt(apiKeys.bkashAppSecret) : process.env.BKASH_APP_SECRET
  };

  try {
    // FIX Issue 14: Pass already-fetched settings to avoid a second DB query inside calculateValidatedOrder
    const orderData = await calculateValidatedOrder(
      orderItems,
      couponCode,
      shippingPrice,
      deliveryZone,
      settings  // preloaded
    );

    const orderPayload = {
      user: isRegisteredUser ? userId : undefined, 
      isGuest: !isRegisteredUser,
      guestId: !isRegisteredUser ? userId : undefined,
      orderItems: orderData.validatedItems,
      shippingAddress: normalizeShippingAddress(shippingAddress),
      itemsPrice: orderData.itemsPrice,
      discountAmount: orderData.discountAmount,
      shippingPrice: orderData.shippingPrice,
      totalPrice: orderData.totalPrice,
      couponCode: orderData.couponCode,
      isDirectBuy: !!isDirectBuy,
      paymentMethod: paymentMethod === "cod" ? "COD" : paymentMethod === "bkash" ? "bKash" : "SSLCommerz",
      paymentResult: {
        transactionId: new mongoose.Types.ObjectId().toString(),
        status: "Pending",
      },
    };

    if (paymentMethod === "cod") {
      const order = await createOrderWithTransaction(orderPayload, true);
      clearCache('cache:/api/admin/dashboard*');
      
      const io = req.app.get('io');
      if (io) {
        io.emit('new_order', order);
      }
      
      res.json(await handleCODGateway(order));
    } else if (paymentMethod === "bkash") {
      const order = await createOrderWithTransaction(orderPayload, false);
      clearCache('cache:/api/admin/dashboard*');
      const bkashData = await initiateBkash(order, bkashCreds);
      order.paymentResult.bkashPaymentID = bkashData.paymentID;
      await order.save();
      res.json({ url: bkashData.url });
    } else {
      const order = await createOrderWithTransaction(orderPayload, false);
      clearCache('cache:/api/admin/dashboard*');
      const sslUrl = await initiateSSLCommerz(order, sslCreds);
      res.json({ url: sslUrl });
    }
  } catch (err) {
    console.error("❌ ORDER PROCESSING ERROR:", err);
    res.status(400).json({ 
        success: false, 
        message: err.message || "Order protocol failure." 
    });
  }
});

export const paymentSuccess = asyncHandler(async (req, res) => {
  const { tran_id } = req.params;
  const { val_id } = req.body;

  // FIX Bug 4: Guard against null order before processing or redirecting
  const order = await Order.findOne({ "paymentResult.transactionId": tran_id });
  if (!order) {
    console.error(`❌ paymentSuccess: Order not found for tran_id=${tran_id}`);
    return res.redirect(`${frontendUrl}/payment/failed?reason=Order not found`);
  }

  if (order.paymentResult.status === "Pending") {
    order.paymentResult.status = "Completed";
    order.paymentResult.val_id = val_id;
    order.orderStatus = "Processing";
    await order.save();
    await finalizeOrderProcessing(order);
    clearCache('cache:/api/admin/dashboard*');
    
    const io = req.app.get('io');
    if (io) {
      io.emit('new_order', order);
    }
  }
  res.redirect(`${frontendUrl}/payment/success?orderId=${order._id}`);
});

export const bkashSuccess = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { paymentID, status } = req.query;

  const apiKeys = await ApiKey.findOne();
  const bkashCreds = {
    appKey: apiKeys?.bkashAppKey || process.env.BKASH_APP_KEY,
    appSecret: apiKeys?.bkashAppSecret ? decrypt(apiKeys.bkashAppSecret) : process.env.BKASH_APP_SECRET
  };

  // FIX Bug 5: Guard against null order
  const order = await Order.findById(orderId);
  if (!order) {
    console.error(`❌ bkashSuccess: Order not found for orderId=${orderId}`);
    return res.redirect(`${frontendUrl}/payment/failed?reason=Order not found`);
  }

  if (status === "success" && paymentID) {
    try {
      const executeResult = await bkashService.executePayment(paymentID, bkashCreds);
      if (executeResult.transactionStatus === "Completed") {
        order.paymentResult.status = "Completed";
        order.paymentResult.transactionId = executeResult.trxID;
        order.orderStatus = "Processing";
        await order.save();
        await finalizeOrderProcessing(order);
        clearCache('cache:/api/admin/dashboard*');
        
        const io = req.app.get('io');
        if (io) {
          io.emit('new_order', order);
        }
        
        return res.redirect(`${frontendUrl}/payment/success?orderId=${order._id}`);
      }
    } catch (err) {
      console.error(`❌ bkashSuccess: bKash execute failed:`, err.message);
      return res.redirect(`${frontendUrl}/payment/failed?reason=bKash execution error`);
    }
  }
  res.redirect(`${frontendUrl}/payment/failed?reason=bKash verification failed`);
});

export const paymentFail = asyncHandler(async (req, res) => {
  const { tran_id } = req.params;
  await Order.findOneAndUpdate(
    { "paymentResult.transactionId": tran_id },
    { $set: { "paymentResult.status": "Failed", orderStatus: "Cancelled" } }
  );
  clearCache('cache:/api/admin/dashboard*');
  res.redirect(`${frontendUrl}/payment/failed?tran_id=${tran_id}&reason=Payment rejected by gateway`);
});

export const paymentCancel = asyncHandler(async (req, res) => {
  res.redirect(`${frontendUrl}/payment/failed?reason=User cancelled transaction`);
});

export const ipn = asyncHandler(async (req, res) => {
  const { val_id, tran_id } = req.body;
  const order = await Order.findOne({ "paymentResult.transactionId": tran_id });
  if (order && order.paymentResult.status === "Pending") {
    order.paymentResult.status = "Completed";
    order.paymentResult.val_id = val_id;
    await order.save();
    await finalizeOrderProcessing(order);
    clearCache('cache:/api/admin/dashboard*');
    
    const io = req.app.get('io');
    if (io) {
      io.emit('new_order', order);
    }
  }
  res.status(200).send("OK");
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const userId = getUserIdFromReq(req); 
  if (!userId) return res.status(401).json({ message: "Identification required." });

  let query;
  if (mongoose.Types.ObjectId.isValid(userId)) {
    query = { user: userId };
  } else if (userId) {
    query = { guestId: userId };
  } else {
    // Ultimate fallback for tracking
    const phone = req.query.phone || req.user?.phone;
    if (phone) {
      query = { "shippingAddress.phone": phone };
    } else {
      return res.json([]); 
    }
  }

  const orders = await Order.find(query)
    .sort("-createdAt")
    .populate("orderItems.product", "name images slug")
    .populate("orderItems.size", "name");
  res.json(orders);
});


export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { phone } = req.query;

  let order;

  if (mongoose.Types.ObjectId.isValid(id)) {
    order = await Order.findById(id)
      .populate({ path: "user", select: "name email avatar role", populate: { path: "role" } })
      .populate("orderItems.product", "name images slug")
      .populate("orderItems.size", "name");
  } else if (id.length >= 6 && phone) {
    // Support for short IDs (e.g. last 8 chars) when phone is provided
    const orders = await Order.find({ "shippingAddress.phone": phone })
      .populate({ path: "user", select: "name email avatar role", populate: { path: "role" } })
      .populate("orderItems.product", "name images slug")
      .populate("orderItems.size", "name");
    
    order = orders.find(o => o._id.toString().toLowerCase().endsWith(id.toLowerCase()));
  } else {
    return res.status(400).json({ message: "Invalid Order ID protocol." });
  }

  if (!order) return res.status(404).json({ message: "Protocol not found." });

  const currentUserId = getUserIdFromReq(req); 
  const orderUserId = order.user?._id ? order.user._id.toString() : order.user?.toString();
  const isAdmin = req.user?.role?.name === 'admin' || req.user?.role?.name === 'superadmin';
  const isRegisteredOwner = order.user && orderUserId === currentUserId;
  const isGuestOwner = order.isGuest && order.guestId === currentUserId;
  
  // Also allow if phone number matches (for tracking without guest session)
  const isPhoneMatch = phone && order.shippingAddress?.phone === phone;

  if (!isRegisteredOwner && !isGuestOwner && !isAdmin && !isPhoneMatch) {
    return res.status(401).json({ message: "Access Denied." });
  }

  res.json(order);
});

export const getOrderReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id)
    .populate("orderItems.product", "name")
    .populate("orderItems.size", "name");

  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }

  // Security Check
  const currentUserId = getUserIdFromReq(req); 
  const orderUserId = order.user?._id ? order.user._id.toString() : order.user?.toString();
  const isAdmin = req.user?.role?.name === 'admin' || req.user?.role?.name === 'superadmin';
  const isRegisteredOwner = order.user && orderUserId === currentUserId;
  const isGuestOwner = order.isGuest && order.guestId === currentUserId;
  const { phone } = req.query;
  const isPhoneMatch = phone && order.shippingAddress?.phone === phone;

  if (!isRegisteredOwner && !isGuestOwner && !isAdmin && !isPhoneMatch) {
    return res.status(401).json({ message: "Access Denied." });
  }

  const doc = new PDFDocument({ margin: 50 });
  let filename = `invoice-${order._id.toString().slice(-8).toUpperCase()}.pdf`;

  res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
  res.setHeader('Content-type', 'application/pdf');

  doc.pipe(res);

  // Brand Header
  const settings = await PageSetting.findOne();
  const siteName = settings?.branding?.siteName || "Vanguard";
  
  doc.fontSize(25).font('Helvetica-Bold').text(siteName.toUpperCase(), { align: 'right' });
  doc.fontSize(10).font('Helvetica').text("Official Order Receipt", { align: 'right' });
  doc.moveDown();

  // Horizontal line
  doc.moveTo(50, 115).lineTo(550, 115).stroke();
  doc.moveDown(2);

  // Order Details Header
  doc.fontSize(14).font('Helvetica-Bold').text(`Invoice: #${order._id.toString().slice(-8).toUpperCase()}`);
  doc.fontSize(10).font('Helvetica').text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
  doc.text(`Status: ${order.orderStatus.toUpperCase()}`);
  doc.moveDown();

  // Shipping Details
  doc.fontSize(12).font('Helvetica-Bold').text("Shipping Address:");
  doc.fontSize(10).font('Helvetica').text(order.shippingAddress.name);
  doc.text(order.shippingAddress.address);
  doc.text(`Phone: ${order.shippingAddress.phone}`);
  doc.moveDown(2);

  // Table Header
  const tableTop = 270;
  doc.fontSize(10).font('Helvetica-Bold');
  doc.text("Item Name", 50, tableTop);
  doc.text("Size", 250, tableTop);
  doc.text("Qty", 350, tableTop);
  doc.text("Price", 450, tableTop);
  doc.text("Total", 500, tableTop, { align: 'right' });

  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
  
  // Table Items
  let currentY = tableTop + 25;
  doc.font('Helvetica');
  
  order.orderItems.forEach(item => {
    doc.text(item.name, 50, currentY, { width: 190 });
    doc.text(item.size?.name || "Standard", 250, currentY);
    doc.text(item.quantity.toString(), 350, currentY);
    doc.text(`TK ${item.price.toLocaleString()}`, 450, currentY);
    doc.text(`TK ${(item.price * item.quantity).toLocaleString()}`, 500, currentY, { align: 'right' });
    currentY += 25;
  });

  doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
  currentY += 15;

  // Totals
  doc.text("Subtotal:", 400, currentY);
  doc.text(`TK ${order.itemsPrice.toLocaleString()}`, 500, currentY, { align: 'right' });
  currentY += 15;

  if (order.discountAmount > 0) {
    doc.fillColor('green').text("Discount:", 400, currentY);
    doc.text(`-TK ${order.discountAmount.toLocaleString()}`, 500, currentY, { align: 'right' });
    doc.fillColor('black');
    currentY += 15;
  }

  doc.text("Shipping:", 400, currentY);
  doc.text(`TK ${order.shippingPrice.toLocaleString()}`, 500, currentY, { align: 'right' });
  currentY += 20;

  doc.fontSize(14).font('Helvetica-Bold').text("Grand Total:", 350, currentY);
  doc.text(`TK ${order.totalPrice.toLocaleString()}`, 500, currentY, { align: 'right' });

  // Footer
  doc.fontSize(8).font('Helvetica-Oblique').text("Thank you for shopping with us.", 50, 700, { align: 'center', width: 500 });

  doc.end();
});
