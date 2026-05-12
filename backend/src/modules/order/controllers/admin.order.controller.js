import Order from "../order.model.js";
import User from "../../user/user.model.js";
import Product from "../../product/product.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../../../middleware/asyncHandler.js";
import {
  calculateValidatedOrder,
  normalizeShippingAddress,
  finalizeOrderProcessing
} from "../order.utils.js";
import pathaoService from '../../../services/pathao.service.js';

export const getOrders = asyncHandler(async (req, res) => {
  const { search, status, user, sort, page = 1, limit = 30 } = req.query;
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

  // 🏛️ Dynamic Sorting Logic
  const sortOrder = sort && sort !== "all" ? sort.split(",").join(" ") : "-createdAt";

  const ordersRaw = await Order.find(filter)
    .sort(sortOrder)
    .skip(skip)
    .limit(itemsLimit)
    .lean();

  const total = await Order.countDocuments(filter);

  const userIds = [...new Set(ordersRaw.map((o) => o.user).filter(Boolean))];

  const users = await User.find({
    _id: { $in: userIds }
  }).select("name email avatar role").populate("role");

  const userMap = users.reduce((acc, u) => {
    acc[String(u._id)] = u;
    return acc;
  }, {});

  const enrichedOrders = ordersRaw.map((order) => {
    const registeredUser = userMap[String(order.user)];
    
    return {
      ...order,
      user: registeredUser ? {
        name: registeredUser.name,
        email: registeredUser.email,
        avatar: registeredUser.avatar,
        isRegistered: true
      } : {
        name: order.shippingAddress?.name || "Unknown Guest",
        email: order.shippingAddress?.email || "N/A",
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
  
  // 🚀 Finalize: Deduct stock and initialize post-order logic
  await finalizeOrderProcessing(createdOrder);
  
  res.status(201).json(createdOrder);
});

export const getAdminOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate({ path: "user", select: "name email avatar role", populate: { path: "role" } })
        .populate(
            "orderItems.product",
            "name images slug"
        );
    if (!order) return res.status(404).json({ message: "Protocol not found." });
    res.json(order);
});

export const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found." });

  if (req.body.orderItems) {
    const restoreOps = order.orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product, "sizes.size": item.size },
        update: { $inc: { "sizes.$.stock": item.quantity } },
      },
    }));
    if (restoreOps.length > 0) await Product.bulkWrite(restoreOps);

    const cityId = req.body.shippingAddress?.pathao_city_id || order.shippingAddress.pathao_city_id;
    const orderData = await calculateValidatedOrder(
      req.body.orderItems,
      order.couponCode,
      cityId
    );

    order.orderItems = orderData.validatedItems;
    order.itemsPrice = orderData.itemsPrice;
    order.discountAmount = orderData.discountAmount;
    order.shippingPrice = orderData.shippingPrice;
    order.totalPrice = orderData.totalPrice;

    const deductOps = order.orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product, "sizes.size": item.size },
        update: { $inc: { "sizes.$.stock": -item.quantity } },
      },
    }));
    if (deductOps.length > 0) await Product.bulkWrite(deductOps);
  }

  if (req.body.shippingAddress) {
    order.shippingAddress = { ...order.shippingAddress, ...req.body.shippingAddress };
  }
  if (req.body.orderStatus) order.orderStatus = req.body.orderStatus;
  if (req.body.paymentMethod) order.paymentMethod = req.body.paymentMethod;
  if (req.body.paymentResult) {
    order.paymentResult = { ...order.paymentResult, ...req.body.paymentResult };
  }

  await order.save();
  const updatedOrder = await Order.findById(order._id)
    .populate({ path: "user", select: "name email avatar role", populate: { path: "role" } })
    .populate("orderItems.product", "name images slug");
    
  res.json(updatedOrder);
});

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
    return res.status(400).json({ message: "Pathao service is currently inactive in settings." });
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
        message: "Pathao couldn't auto-resolve this address. Please set City/Zone/Area IDs manually in the order details.",
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
    amount_to_collect: order.paymentResult.status === "Completed" ? 0 : Math.round(order.totalPrice),
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
