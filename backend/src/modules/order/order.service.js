import mongoose from "mongoose";
import Order from "./order.model.js";
import Product from "../product/product.model.js";
import Coupon from "../coupon/coupon.model.js";
import Cart from "../cart/cart.model.js";
import { finalizeOrderProcessing } from "./order.utils.js";

/**
 * Execute order creation within a MongoDB Transaction session
 */
export const createOrderWithTransaction = async (orderPayload, isCOD = false) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // 1. Create order instance
    const order = new Order(orderPayload);
    
    // Save order in session
    await order.save({ session });
    
    // If Cash on Delivery, finalize stock decrement immediately in transaction session
    if (isCOD) {
      order.paymentResult.status = "COD";
      order.orderStatus = "Processing";
      await order.save({ session });
      
      // Let's call standard finalize processing inside the session
      await finalizeOrderProcessing(order, session);
    }
    
    // Commit transaction
    await session.commitTransaction();
    session.endSession();
    return order;
  } catch (error) {
    console.error("❌ CREATE ORDER TRANSACTION ERROR, ABORTING:", error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/**
 * Execute order status cancellation (and stock replenishment) within a MongoDB Transaction session
 */
export const cancelOrderWithTransaction = async (orderId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.orderStatus === "Cancelled") {
      throw new Error("Order is already cancelled");
    }

    // 1. Replenish product sizes stock
    const restoreOps = order.orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product, "sizes.size": item.size },
        update: { $inc: { "sizes.$.stock": item.quantity } },
      },
    }));

    if (restoreOps.length > 0) {
      await Product.bulkWrite(restoreOps, { session });
    }

    // 2. Replenish coupon usage
    if (order.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: order.couponCode },
        { $inc: { usedCount: -1 } },
        { session }
      );
    }

    // 3. Update order status to Cancelled
    order.orderStatus = "Cancelled";
    if (order.paymentResult) {
      order.paymentResult.status = "Cancelled";
    }
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();
    return order;
  } catch (error) {
    console.error("❌ CANCEL ORDER TRANSACTION ERROR, ABORTING:", error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
