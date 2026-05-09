import Order from "./order.model.js";
import Product from "../product/product.model.js";
import Cart from "../cart/cart.model.js";
import Coupon from "../coupon/coupon.model.js";
import PageSetting from "../settings/settings.model.js";
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
import bkashService from '../../services/bkash.service.js'; import pathaoService from '../../services/pathao.service.js';
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

const finalizeOrderProcessing = async (order) => {
  const bulkOps = order.orderItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product, "sizes.size": item.size },
      update: { $inc: { "sizes.$.stock": -item.quantity } },
    },
  }));
  
  if (bulkOps.length > 0) await Product.bulkWrite(bulkOps);
  
  if (order.couponCode) {
    await Coupon.findOneAndUpdate(
      { code: order.couponCode },
      { $inc: { usedCount: 1 } }
    );
  }

  // 🚀 FIXED: শুধুমাত্র রেজিস্টার্ড ইউজার হলে কার্ট ক্লিয়ার করো
  if (!order.isDirectBuy && order.user) {
    await Cart.findOneAndUpdate({ user: order.user }, { $set: { items: [] } });
  }
};

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
      message: "Identity required. Please provide a Guest Session or Login.",
    });
  }

  // 🕵️ CRITICAL FIX: চেক করো ইউজার কি মেম্বার নাকি গেস্ট
  const isRegisteredUser = mongoose.Types.ObjectId.isValid(userId);

  const settings = await PageSetting.findOne();
  
  const sslCreds = {
    storeId: process.env.SSL_STORE_ID,
    storePassword: process.env.SSL_STORE_PASSWORD
  };

  const bkashCreds = {
    appKey: process.env.BKASH_APP_KEY,
    appSecret: process.env.BKASH_APP_SECRET
  };

  if (!settings) throw new Error("Settings not initialized.");

  const orderData = await calculateValidatedOrder(
    orderItems,
    couponCode,
    shippingAddress.pathao_city_id
  );

  const order = new Order({
    // ✅ যদি রেজিস্টার্ড ইউজার হয় তবে আইডি দাও, গেস্ট হলে undefined রাখো
    user: isRegisteredUser ? userId : undefined, 
    isGuest: !isRegisteredUser, // 🚀 গেস্ট ট্র্যাকিং
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
// export const getOrders = asyncHandler(async (req, res) => {
//   const { search, status, page = 1, limit = 10 } = req.query;
//   const filter = {};

//   if (status && status !== "all") {
//     filter.orderStatus = status;
//   }

//   if (search && search.trim()) {
//     const safeSearch = search.trim();
//     if (mongoose.Types.ObjectId.isValid(safeSearch)) {
//       filter._id = safeSearch;
//     } else {
//       filter.$or = [
//         { "shippingAddress.phone": { $regex: safeSearch, $options: "i" } },
//         { "shippingAddress.name": { $regex: safeSearch, $options: "i" } },
//       ];
//     }
//   }

//   const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
//   const itemsLimit = Number(limit);

//   const ordersRaw = await Order.find(filter)
//     .sort("-createdAt")
//     .skip(skip)
//     .limit(itemsLimit)
//     .lean();

//   const total = await Order.countDocuments(filter);

//   // Collect unique user IDs from orders
//   const userIds = [...new Set(ordersRaw.map((o) => o.user).filter(Boolean))];

//   // Fetch users using Mongoose User model
//   const users = await User.find({
//     $or: [
//       { _id: { $in: userIds.filter((id) => mongoose.Types.ObjectId.isValid(id)) } },
//       { id: { $in: userIds } },
//     ],
//   }).select("name email avatar role");

//   const userMap = users.reduce((acc, u) => {
//     acc[String(u._id)] = u;
//     if (u.id) acc[String(u.id)] = u;
//     return acc;
//   }, {});

//   const enrichedOrders = ordersRaw.map((order) => ({
//     ...order,
//     user: userMap[String(order.user)] || { name: "Guest Identity", email: "N/A" },
//   }));

//   res.json({
//     success: true,
//     orders: enrichedOrders,
//     total,
//     page: Number(page),
//     pages: Math.ceil(total / itemsLimit) || 1,
//   });
// });





// --- Admin: Fetch All Orders (Updated to show Guest Name from Form) ---
export const getOrders = asyncHandler(async (req, res) => {
  const { search, status, user, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (status && status !== "all") {
    filter.orderStatus = status;
  }

  if (user) {
    filter.user = user;
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

  // Collect unique user IDs
  const userIds = [...new Set(ordersRaw.map((o) => o.user).filter(Boolean))];

  // Fetch users
  const users = await User.find({
    _id: { $in: userIds }
  }).select("name email avatar role");

  const userMap = users.reduce((acc, u) => {
    acc[String(u._id)] = u;
    return acc;
  }, {});

  const enrichedOrders = ordersRaw.map((order) => {
    const registeredUser = userMap[String(order.user)];
    
    return {
      ...order,
      // 🕵️ সিনিয়র লজিক: যদি রেজিস্টার্ড ইউজার থাকে তবে তার ডাটা দাও, 
      // নাহলে গেস্টের ক্ষেত্রে শিপিং ফর্মের নাম এবং ইমেইল ব্যবহার করো।
      user: registeredUser ? {
        name: registeredUser.name,
        email: registeredUser.email,
        avatar: registeredUser.avatar,
        isRegistered: true
      } : {
        name: order.shippingAddress?.name || "Unknown Guest", // ফর্মের নাম
        email: order.shippingAddress?.email || "N/A",      // ফর্মের ইমেইল
        isRegistered: false
      },
    };
  });

  res.json({
    success: true,
    orders: enrichedOrders,
    total,
    page: Number(page),
    pages: Math.ceil(total / itemsLimit) || 1,
  });
});









// --- User: Get My Orders (handles guest via guest ID header) ---
// export const getMyOrders = asyncHandler(async (req, res) => {
//   const userId = getUserIdFromReq(req);
//   if (!userId) {
//     return res.status(401).json({ message: "Authentication required." });
//   }
//   const orders = await Order.find({ user: String(userId) }).sort("-createdAt");
//   res.json(orders);
// });






export const getMyOrders = asyncHandler(async (req, res) => {
  const userId = getUserIdFromReq(req); 

  if (!userId) {
    return res.status(401).json({ message: "Identification required." });
  }

  let query;

  if (mongoose.Types.ObjectId.isValid(userId)) {
    query = { user: userId };
  } else {
   
    query = { "shippingAddress.phone": req.user?.phone || "" }; 
    
    if (!req.user?.phone && !mongoose.Types.ObjectId.isValid(userId)) {
        return res.json([]); 
    }
  }

  const orders = await Order.find(query).sort("-createdAt");
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Order ID protocol." });
  }

  const order = await Order.findById(id).populate(
    "orderItems.product",
    "name images slug"
  );

  if (!order) return res.status(404).json({ message: "Protocol not found." });

  const currentUserId = getUserIdFromReq(req); 
  const isAdmin = req.user?.role === "admin";

  const isOwner = (order.user && order.user.toString() === currentUserId) || 
                  (order.isGuest && !order.user); 


  if (!isAdmin && !isOwner) {
    return res.status(401).json({ message: "Access Denied. Unauthorized Protocol." });
  }

  res.json(order);
});


// --- Get Single Order by ID (admin or owner) ---
// export const getOrderById = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id).populate(
//     "orderItems.product",
//     "name images slug"
//   );
//   if (!order) return res.status(404).json({ message: "Protocol not found." });

//   // Allow access if user is admin or order owner
//   const userId = getUserIdFromReq(req);
//   if (req.user?.role !== "admin" && order.user !== String(userId)) {
//     return res.status(403).json({ message: "Access denied." });
//   }
//   res.json(order);
// });

// --- Sync Order to Pathao (with auto‑resolve fallback) ---
export const syncOrderToPathao = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found." });

  const pKeys = {
    clientId: process.env.PATHAO_CLIENT_ID,
    clientSecret: process.env.PATHAO_CLIENT_SECRET,
    username: process.env.PATHAO_USERNAME,
    password: process.env.PATHAO_PASSWORD,
    storeId: process.env.PATHAO_STORE_ID,
    isActive: !!process.env.PATHAO_CLIENT_ID
  };

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
export const createOrderAdmin = asyncHandler(async (req, res) => {
  const {
    user: customerId,
    orderItems,
    shippingAddress,
    couponCode,
    paymentMethod = "COD",
    orderStatus = "Processing",
    paymentStatus = "Pending"
  } = req.body;

  const orderData = await calculateValidatedOrder(
    orderItems,
    couponCode,
    shippingAddress.pathao_city_id
  );

  const order = new Order({
    user: customerId || undefined,
    isGuest: !customerId,
    orderItems: orderData.validatedItems,
    shippingAddress: normalizeShippingAddress(shippingAddress),
    itemsPrice: orderData.itemsPrice,
    discountAmount: orderData.discountAmount,
    shippingPrice: orderData.shippingPrice,
    totalPrice: orderData.totalPrice,
    couponCode: orderData.couponCode,
    paymentMethod,
    orderStatus,
    paymentResult: {
      transactionId: `ADMIN-${new mongoose.Types.ObjectId().toString()}`,
      status: paymentStatus,
    },
  });

  const createdOrder = await order.save();
  await finalizeOrderProcessing(createdOrder);

  res.status(201).json(createdOrder);
});

export const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found." });

  // 🕵️ CRITICAL: If orderItems are being updated, we must handle stock and financials
  if (req.body.orderItems) {
    // 1. Restore stock for existing items
    const restoreOps = order.orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product, "sizes.size": item.size },
        update: { $inc: { "sizes.$.stock": item.quantity } },
      },
    }));
    if (restoreOps.length > 0) await Product.bulkWrite(restoreOps);

    // 2. Calculate new validated data
    const cityId = req.body.shippingAddress?.pathao_city_id || order.shippingAddress.pathao_city_id;
    const orderData = await calculateValidatedOrder(
      req.body.orderItems,
      order.couponCode,
      cityId
    );

    // 3. Update order fields
    order.orderItems = orderData.validatedItems;
    order.itemsPrice = orderData.itemsPrice;
    order.discountAmount = orderData.discountAmount;
    order.shippingPrice = orderData.shippingPrice;
    order.totalPrice = orderData.totalPrice;

    // 4. Deduct stock for new items
    const deductOps = order.orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product, "sizes.size": item.size },
        update: { $inc: { "sizes.$.stock": -item.quantity } },
      },
    }));
    if (deductOps.length > 0) await Product.bulkWrite(deductOps);
  }

  // Update other metadata
  if (req.body.shippingAddress) {
    order.shippingAddress = { ...order.shippingAddress, ...req.body.shippingAddress };
  }
  if (req.body.orderStatus) order.orderStatus = req.body.orderStatus;
  if (req.body.paymentMethod) order.paymentMethod = req.body.paymentMethod;
  if (req.body.paymentResult) {
    order.paymentResult = { ...order.paymentResult, ...req.body.paymentResult };
  }

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});
