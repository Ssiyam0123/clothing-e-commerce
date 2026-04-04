import Order from "./order.model.js";
import Product from "../product/product.model.js";
import Cart from "../cart/cart.model.js";
import Coupon from "../coupon/coupon.model.js";
import PageSetting from "../settings/settings.model.js";
import ApiKey from "../apiKeys/apiKey.model.js";
import User from "../user/user.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  calculateValidatedOrder,
  normalizeShippingAddress,
} from "./order.utils.js";
import {
  initiateSSLCommerz,
  initiateBkash,
  handleCODGateway,
} from "./order.gateway.js";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

const finalizeOrderProcessing = async (order) => {
  const bulkOps = order.orderItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product, "sizes.size": item.size },
      update: { $inc: { "sizes.$.stock": -item.quantity } },
    },
  }));
  if (bulkOps.length > 0) await Product.bulkWrite(bulkOps);
  if (order.couponCode)
    await Coupon.findOneAndUpdate(
      { code: order.couponCode },
      { $inc: { usedCount: 1 } }
    );
  if (!order.isDirectBuy)
    await Cart.findOneAndUpdate({ user: order.user }, { $set: { items: [] } });
};

// Helper to get user ID from request (authenticated or guest)
const getUserIdFromReq = (req) => {
  if (req.user && (req.user._id || req.user.id)) {
    return req.user._id || req.user.id;
  }
  return req.headers["x-guest-id"] || null;
};

export const initPayment = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    isDirectBuy,
    couponCode,
    paymentMethod = "ssl",
  } = req.body;
  const userId = getUserIdFromReq(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message:
        "Identity required. Please login or provide a Guest Session protocol.",
    });
  }

  const settings = await PageSetting.findOne();

  const keys = await ApiKey.findOne().select(
    "+sslCommerz.storeId +sslCommerz.storePassword " +
      "+bkash.appKey +bkash.appSecret +bkash.userName +bkash.password " +
      "+pathao.clientId +pathao.clientSecret +pathao.userName +pathao.password"
  );

  if (!settings) throw new Error("Central settings not initialized.");

  if (paymentMethod === "cod" && !settings.paymentOptions?.cod)
    return res.status(400).json({ message: "COD is disabled." });
  if (paymentMethod === "ssl" && !settings.paymentOptions?.online)
    return res.status(400).json({ message: "Online payment is disabled." });
  if (paymentMethod === "bkash" && !settings.paymentOptions?.bkash)
    return res.status(400).json({ message: "bKash is disabled." });

  const orderData = await calculateValidatedOrder(
    orderItems,
    couponCode,
    shippingAddress.pathao_city_id
  );

  const order = new Order({
    user: String(userId),
    orderItems: orderData.validatedItems,
    shippingAddress: normalizeShippingAddress(shippingAddress),
    itemsPrice: orderData.itemsPrice,
    discountAmount: orderData.discountAmount,
    shippingPrice: orderData.shippingPrice,
    totalPrice: orderData.totalPrice,
    couponCode: orderData.couponCode,
    isDirectBuy: !!isDirectBuy,
    paymentMethod:
      paymentMethod === "cod"
        ? "COD"
        : paymentMethod === "bkash"
        ? "bKash"
        : "SSLCommerz",
    paymentResult: {
      transactionId: new mongoose.Types.ObjectId().toString(),
      status: "Pending",
    },
  });

  let paymentResponse;

  if (paymentMethod === "cod") {
    order.paymentResult.status = "COD";
    order.orderStatus = "Processing";
    await order.save();
    await finalizeOrderProcessing(order);
    paymentResponse = await handleCODGateway(order);
  } else if (paymentMethod === "bkash") {
    if (!keys?.bkash?.isActive || !keys?.bkash?.appKey)
      return res
        .status(400)
        .json({ message: "bKash terminal is offline or not configured." });

    await order.save();
    const bkashData = await initiateBkash(order, keys.bkash);
    order.paymentResult.bkashPaymentID = bkashData.paymentID;
    await order.save();
    paymentResponse = { url: bkashData.url };
  } else {
    if (!keys?.sslCommerz?.isActive || !keys?.sslCommerz?.storeId)
      return res
        .status(400)
        .json({ message: "SSLCommerz terminal is offline or not configured." });

    await order.save();
    const sslUrl = await initiateSSLCommerz(order, keys.sslCommerz);
    paymentResponse = { url: sslUrl };
  }

  res.json(paymentResponse);
});

// --- Callbacks & Webhooks ---
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
  const keys = await ApiKey.findOne().select("+bkash");
  const order = await Order.findById(orderId);

  if (status === "success" && paymentID) {
    const executeResult = await bkashService.executePayment(
      paymentID,
      keys.bkash
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
  res.redirect(
    `${frontendUrl}/payment/failed?tran_id=${tran_id}&reason=Payment rejected by gateway`
  );
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

// --- Admin: Fetch All Orders (using User model, not raw db) ---
export const getOrders = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (status && status !== "all") {
    filter.orderStatus = status;
  }

  if (search && search.trim()) {
    const safeSearch = search.trim();
    if (mongoose.Types.ObjectId.isValid(safeSearch)) {
      filter._id = safeSearch;
    } else {
      filter.$or = [
        { "shippingAddress.phone": { $regex: safeSearch, $options: "i" } },
        { "shippingAddress.name": { $regex: safeSearch, $options: "i" } },
      ];
    }
  }

  const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
  const itemsLimit = Number(limit);

  const ordersRaw = await Order.find(filter)
    .sort("-createdAt")
    .skip(skip)
    .limit(itemsLimit)
    .lean();

  const total = await Order.countDocuments(filter);

  // Collect unique user IDs from orders
  const userIds = [...new Set(ordersRaw.map((o) => o.user).filter(Boolean))];

  // Fetch users using Mongoose User model
  const users = await User.find({
    $or: [
      { _id: { $in: userIds.filter((id) => mongoose.Types.ObjectId.isValid(id)) } },
      { id: { $in: userIds } },
    ],
  }).select("name email avatar role");

  const userMap = users.reduce((acc, u) => {
    acc[String(u._id)] = u;
    if (u.id) acc[String(u.id)] = u;
    return acc;
  }, {});

  const enrichedOrders = ordersRaw.map((order) => ({
    ...order,
    user: userMap[String(order.user)] || { name: "Guest Identity", email: "N/A" },
  }));

  res.json({
    success: true,
    orders: enrichedOrders,
    total,
    page: Number(page),
    pages: Math.ceil(total / itemsLimit) || 1,
  });
});

// --- User: Get My Orders (handles guest via guest ID header) ---
export const getMyOrders = asyncHandler(async (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) {
    return res.status(401).json({ message: "Authentication required." });
  }
  const orders = await Order.find({ user: String(userId) }).sort("-createdAt");
  res.json(orders);
});

// --- Get Single Order by ID (admin or owner) ---
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "orderItems.product",
    "name images slug"
  );
  if (!order) return res.status(404).json({ message: "Protocol not found." });

  // Allow access if user is admin or order owner
  const userId = getUserIdFromReq(req);
  if (req.user?.role !== "admin" && order.user !== String(userId)) {
    return res.status(403).json({ message: "Access denied." });
  }
  res.json(order);
});

// --- Sync Order to Pathao (with auto‑resolve fallback) ---
export const syncOrderToPathao = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found." });

  const keys = await ApiKey.findOne().select(
    "+pathao.clientId +pathao.clientSecret +pathao.userName +pathao.password +pathao.storeId"
  );
  const pKeys = keys?.pathao;

  if (!pKeys?.isActive) {
    return res
      .status(400)
      .json({ message: "Pathao service is currently inactive in settings." });
  }

  let cityId = order.shippingAddress.pathao_city_id;
  let zoneId = order.shippingAddress.pathao_zone_id;
  let areaId = order.shippingAddress.pathao_area_id;

  if (!cityId || !zoneId || !areaId) {
    const addressToSearch = `${order.shippingAddress.street}, ${order.shippingAddress.city}`;
    const resolved = await pathaoService.autoResolveAddress(addressToSearch, pKeys);

    if (resolved) {
      cityId = resolved.city_id;
      zoneId = resolved.zone_id;
      areaId = resolved.area_id;

      order.shippingAddress.pathao_city_id = String(cityId);
      order.shippingAddress.pathao_zone_id = String(zoneId);
      order.shippingAddress.pathao_area_id = String(areaId);
      await order.save();
    } else {
      return res.status(400).json({
        message:
          "Pathao couldn't auto-resolve this address. Please set City/Zone/Area IDs manually in the order details.",
      });
    }
  }

  const payload = {
    store_id: parseInt(pKeys.storeId),
    merchant_order_id: order._id.toString(),
    recipient_name: order.shippingAddress.name,
    recipient_phone: order.shippingAddress.phone,
    recipient_address: order.shippingAddress.street,
    recipient_city: parseInt(cityId),
    recipient_zone: parseInt(zoneId),
    recipient_area: parseInt(areaId),
    delivery_type: 48,
    item_type: 2,
    item_weight: "0.5",
    amount_to_collect:
      order.paymentResult.status === "Completed" ? 0 : Math.round(order.totalPrice),
    item_quantity: order.orderItems.length,
    item_description: order.orderItems.map((i) => i.name).join(", "),
  };

  try {
    const pRes = await pathaoService.createOrder(payload, pKeys);
    order.pathaoConsignmentId = pRes.consignment_id;
    order.pathaoStatus = "Synced";
    await order.save();

    res.json({
      success: true,
      message: "Pathao Synchronized successfully.",
      consignmentId: pRes.consignment_id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});