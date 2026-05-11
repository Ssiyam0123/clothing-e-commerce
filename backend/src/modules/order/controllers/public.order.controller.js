import Order from "../order.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../../../middleware/asyncHandler.js";
import {
  calculateValidatedOrder,
  normalizeShippingAddress,
  finalizeOrderProcessing
} from "../order.utils.js";
import {
  initiateSSLCommerz,
  initiateBkash,
  handleCODGateway,
} from "../order.gateway.js";
import bkashService from '../../../services/bkash.service.js';
import PageSetting from "../../settings/settings.model.js";

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
  
  if (!settings) {
     console.error("❌ SETTINGS NOT INITIALIZED");
     throw new Error("Settings not initialized.");
  }

  const sslCreds = {
    storeId: process.env.SSL_STORE_ID,
    storePassword: process.env.SSL_STORE_PASSWORD
  };

  const bkashCreds = {
    appKey: process.env.BKASH_APP_KEY,
    appSecret: process.env.BKASH_APP_SECRET
  };

  try {
    const orderData = await calculateValidatedOrder(
      orderItems,
      couponCode,
      shippingPrice
    );

    const order = new Order({
      user: isRegisteredUser ? userId : undefined, 
      isGuest: !isRegisteredUser,
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
    });

    if (paymentMethod === "cod") {
      order.paymentResult.status = "COD";
      order.orderStatus = "Processing";
      await order.save();
      await finalizeOrderProcessing(order);
      res.json(await handleCODGateway(order));
    } else if (paymentMethod === "bkash") {
      await order.save();
      const bkashData = await initiateBkash(order, bkashCreds);
      order.paymentResult.bkashPaymentID = bkashData.paymentID;
      await order.save();
      res.json({ url: bkashData.url });
    } else {
      await order.save();
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
  const order = await Order.findOne({ "paymentResult.transactionId": tran_id });
  if (order && order.paymentResult.status === "Pending") {
    order.paymentResult.status = "Completed";
    order.paymentResult.val_id = val_id;
    order.orderStatus = "Processing";
    await order.save();
    await finalizeOrderProcessing(order);
  }
  res.redirect(`${frontendUrl}/payment/success?orderId=${order?._id}`);
});

export const bkashSuccess = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { paymentID, status } = req.query;
  const bkashCreds = {
    appKey: process.env.BKASH_APP_KEY,
    appSecret: process.env.BKASH_APP_SECRET
  };
  const order = await Order.findById(orderId);

  if (status === "success" && paymentID) {
    const executeResult = await bkashService.executePayment(
      paymentID,
      bkashCreds
    );
    if (executeResult.transactionStatus === "Completed") {
      order.paymentResult.status = "Completed";
      order.paymentResult.transactionId = executeResult.trxID;
      order.orderStatus = "Processing";
      await order.save();
      await finalizeOrderProcessing(order);
      return res.redirect(`${frontendUrl}/payment/success?orderId=${order._id}`);
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
  }
  res.status(200).send("OK");
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const userId = getUserIdFromReq(req); 
  if (!userId) return res.status(401).json({ message: "Identification required." });

  let query;
  if (mongoose.Types.ObjectId.isValid(userId)) {
    query = { user: userId };
  } else {
    query = { "shippingAddress.phone": req.user?.phone || "" }; 
    if (!req.user?.phone && !mongoose.Types.ObjectId.isValid(userId)) return res.json([]); 
  }

  const orders = await Order.find(query)
    .sort("-createdAt")
    .populate("orderItems.product", "name images slug")
    .populate("orderItems.size", "name");
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("🔍 FETCHING ORDER DETAILS", { orderId: id });

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid Order ID protocol." });

  const order = await Order.findById(id)
    .populate("user", "name email avatar")
    .populate("orderItems.product", "name images slug")
    .populate("orderItems.size", "name");

  if (!order) {
    console.warn("❌ ORDER NOT FOUND IN DB:", id);
    return res.status(404).json({ message: "Protocol not found." });
  }

  const currentUserId = getUserIdFromReq(req); 
  const orderUserId = order.user?.toString();
  
  console.log("👤 IDENTITY AUDIT", {
    requestUserId: currentUserId,
    orderOwnerId: orderUserId,
    isGuestOrder: order.isGuest,
    hasToken: !!req.headers.authorization
  });

  const isOwner = (order.user && orderUserId === currentUserId) || (order.isGuest && !order.user); 

  if (!isOwner && req.user?.role !== 'admin') {
    console.error("🚫 ACCESS DENIED: Identity mismatch", {
        expected: orderUserId,
        received: currentUserId
    });
    return res.status(401).json({ message: "Access Denied. Unauthorized Protocol." });
  }

  res.json(order);
});
