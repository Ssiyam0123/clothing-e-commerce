import Order from "./order.model.js";
import Product from "../product/product.model.js";
import Cart from "../cart/cart.model.js";
import Coupon from "../coupon/coupon.model.js";
import PageSetting from "../settings/settings.model.js";
import ApiKey from "../apiKeys/apiKey.model.js";
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
      { $inc: { usedCount: 1 } },
    );
  if (!order.isDirectBuy)
    await Cart.findOneAndUpdate({ user: order.user }, { $set: { items: [] } });
};








export const initPayment = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    isDirectBuy,
    couponCode,
    paymentMethod = "ssl",
  } = req.body;
  const userId = req.user._id || req.user.id;

  // ১. সেটিংস ফেচ করা
  const settings = await PageSetting.findOne();
  
  /** * 🛡️ প্রো-ফিক্স: প্রতিটি হিডেন ফিল্ড আলাদাভাবে সিলেক্ট করতে হবে।
   * শুধু +sslCommerz দিলে মঙ্গুজ ওর ভেতরের select: false ফিল্ডগুলো আনে না।
   */
  const keys = await ApiKey.findOne().select(
    "+sslCommerz.storeId +sslCommerz.storePassword " +
    "+bkash.appKey +bkash.appSecret +bkash.userName +bkash.password " +
    "+pathao.clientId +pathao.clientSecret +pathao.userName +pathao.password"
  );

  if (!settings) throw new Error("Central settings not initialized.");

  // ২. ড্যাশবোর্ড টগল ভ্যালিডেশন
  if (paymentMethod === "cod" && !settings.paymentOptions?.cod)
    return res.status(400).json({ message: "COD is disabled." });
  if (paymentMethod === "ssl" && !settings.paymentOptions?.online)
    return res.status(400).json({ message: "Online payment is disabled." });
  if (paymentMethod === "bkash" && !settings.paymentOptions?.bkash)
    return res.status(400).json({ message: "bKash is disabled." });

  const orderData = await calculateValidatedOrder(
    orderItems,
    couponCode,
    shippingAddress.pathao_city_id,
  );

  const order = new Order({
    user: userId,
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

  let paymentResponse;

  // ৩. পেমেন্ট গেটওয়ে এক্সিকিউশন
  if (paymentMethod === "cod") {
    order.paymentResult.status = "COD";
    order.orderStatus = "Processing";
    await order.save();
    await finalizeOrderProcessing(order);
    paymentResponse = await handleCODGateway(order);
  } 
  else if (paymentMethod === "bkash") {
    // 🚀 এখানে এখন keys.bkash.appKey এক্সেস পাওয়া যাবে
    if (!keys?.bkash?.isActive || !keys?.bkash?.appKey)
      return res.status(400).json({ message: "bKash terminal is offline or not configured." });
    
    await order.save();
    const bkashData = await initiateBkash(order, keys.bkash);
    order.paymentResult.bkashPaymentID = bkashData.paymentID;
    await order.save();
    paymentResponse = { url: bkashData.url };
  } 
  else {
    // SSLCommerz
    // 🚀 এখানে এখন keys.sslCommerz.storeId এক্সেস পাওয়া যাবে
    if (!keys?.sslCommerz?.isActive || !keys?.sslCommerz?.storeId)
      return res.status(400).json({ message: "SSLCommerz terminal is offline or not configured." });
    
    await order.save();
    const sslUrl = await initiateSSLCommerz(order, keys.sslCommerz);
    paymentResponse = { url: sslUrl };
  }

  res.json(paymentResponse);
});


// export const initPayment = asyncHandler(async (req, res) => {
//   const {
//     orderItems,
//     shippingAddress,
//     isDirectBuy,
//     couponCode,
//     paymentMethod = "ssl",
//   } = req.body;
//   const userId = req.user._id || req.user.id;

//   const settings = await PageSetting.findOne();
//   const keys = await ApiKey.findOne().select("+sslCommerz +bkash +pathao");

//   if (!settings) throw new Error("Settings not found");

//   if (paymentMethod === "cod" && !settings.paymentOptions?.cod)
//     return res.status(400).json({ message: "COD is disabled." });
//   if (paymentMethod === "ssl" && !settings.paymentOptions?.online)
//     return res.status(400).json({ message: "Online payment is disabled." });
//   if (paymentMethod === "bkash" && !settings.paymentOptions?.bkash)
//     return res.status(400).json({ message: "bKash is disabled." });

//   const orderData = await calculateValidatedOrder(
//     orderItems,
//     couponCode,
//     shippingAddress.pathao_city_id,
//   );
//   const order = new Order({
//     user: userId,
//     orderItems: orderData.validatedItems,
//     shippingAddress: normalizeShippingAddress(shippingAddress),
//     itemsPrice: orderData.itemsPrice,
//     discountAmount: orderData.discountAmount,
//     shippingPrice: orderData.shippingPrice,
//     totalPrice: orderData.totalPrice,
//     couponCode: orderData.couponCode,
//     isDirectBuy: !!isDirectBuy,
//     paymentMethod:
//       paymentMethod === "cod"
//         ? "COD"
//         : paymentMethod === "bkash"
//           ? "bKash"
//           : "SSLCommerz",
//     paymentResult: {
//       transactionId: new mongoose.Types.ObjectId().toString(),
//       status: "Pending",
//     },
//   });

//   let paymentResponse;
//   if (paymentMethod === "cod") {
//     order.paymentResult.status = "COD";
//     order.orderStatus = "Processing";
//     await order.save();
//     await finalizeOrderProcessing(order);
//     paymentResponse = await handleCODGateway(order);
//   } else if (paymentMethod === "bkash") {
//     if (!keys?.bkash?.isActive)
//       return res.status(400).json({ message: "bKash not configured." });
//     await order.save();
//     const bkashData = await initiateBkash(order, keys.bkash);
//     order.paymentResult.bkashPaymentID = bkashData.paymentID;
//     await order.save();
//     paymentResponse = { url: bkashData.url };
//   } else {
//     // ssl
//     if (!keys?.sslCommerz?.storeId)
//       return res.status(400).json({ message: "SSLCommerz not configured." });
//     await order.save();
//     const sslUrl = await initiateSSLCommerz(order, keys.sslCommerz);
//     paymentResponse = { url: sslUrl };
//   }
//   res.json(paymentResponse);
// });

// ... (other exports: paymentSuccess, bkashSuccess, paymentFail, paymentCancel, ipn, getMyOrders, getOrderById, syncOrderToPathao, getOrders)
// Keep them as previously written but ensure they use the correct models and services.
// --- 🌐 Callbacks & Webhooks ---
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
      keys.bkash,
    );
    if (executeResult.transactionStatus === "Completed") {
      order.paymentResult.status = "Completed";
      order.paymentResult.transactionId = executeResult.trxID;
      order.orderStatus = "Processing";
      await order.save();
      await finalizeOrderProcessing(order);
      return res.redirect(
        `${frontendUrl}/payment/success?orderId=${order._id}`,
      );
    }
  }
  res.redirect(
    `${frontendUrl}/payment/failed?reason=bKash verification failed`,
  );
});

export const paymentFail = asyncHandler(async (req, res) => {
  const { tran_id } = req.params;
  await Order.findOneAndUpdate(
    { "paymentResult.transactionId": tran_id },
    { $set: { "paymentResult.status": "Failed", orderStatus: "Cancelled" } },
  );
  res.redirect(
    `${frontendUrl}/payment/failed?tran_id=${tran_id}&reason=Payment rejected by gateway`,
  );
});

export const paymentCancel = asyncHandler(async (req, res) => {
  res.redirect(
    `${frontendUrl}/payment/failed?reason=User cancelled transaction`,
  );
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

// --- 🛡️ Admin: Fetch All Orders (Add this at the end of order.controller.js) ---
export const getOrders = asyncHandler(async (req, res) => {
  const db = mongoose.connection.db;
  const { search, status, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (status && status !== "all") filter.orderStatus = status;

  // Search Logic
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
  const orders = await Order.find(filter)
    .sort("-createdAt")
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await Order.countDocuments(filter);

  res.json({
    orders,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit) || 1,
  });
});

// --- 📊 Retrieval & Admin Sync ---
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "orderItems.product",
    "name images slug",
  );
  if (!order) return res.status(404).json({ message: "Protocol not found." });
  res.json(order);
});

export const syncOrderToPathao = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  const keys = await ApiKey.findOne().select("+pathao");
  const pKeys = keys?.pathao;

  if (!pKeys?.isActive)
    return res.status(400).json({ message: "Pathao service inactive." });

  const payload = {
    store_id: parseInt(pKeys.storeId),
    merchant_order_id: order._id.toString(),
    recipient_name: order.shippingAddress.name,
    recipient_phone: order.shippingAddress.phone,
    recipient_address: `${order.shippingAddress.street}, ${order.shippingAddress.city}`,
    recipient_city: parseInt(order.shippingAddress.pathao_city_id),
    recipient_zone: parseInt(order.shippingAddress.pathao_zone_id),
    recipient_area: parseInt(order.shippingAddress.pathao_area_id),
    delivery_type: 48,
    item_type: 2,
    item_weight: "0.5",
    amount_to_collect:
      order.paymentResult.status === "Completed"
        ? 0
        : Math.round(order.totalPrice),
    item_quantity: order.orderItems.length,
    item_description: order.orderItems.map((i) => i.name).join(", "),
  };

  const pRes = await pathaoService.createOrder(payload, pKeys);
  order.pathaoConsignmentId = pRes.consignment_id;
  order.pathaoStatus = "Synced";
  await order.save();
  res.json({ message: "Pathao Synchronized.", order });
});
