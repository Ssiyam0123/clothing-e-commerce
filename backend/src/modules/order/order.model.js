import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false,
  },
  name: { type: String, required: true }, 
  size: { type: mongoose.Schema.Types.ObjectId, ref: "Size", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: String,
});

const orderSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: false, // 🚀 FIXED: গেস্টের জন্য এটা অপশনাল
    },
    isGuest: { 
      type: Boolean, 
      default: false 
    }, // 🕵️ গেস্ট ইউজার ট্র্যাকিংয়ের জন্য
    orderItems: [orderItemSchema],
    shippingAddress: {
      name: { type: String, required: true }, 
      email: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: String,
      state: String,
      zip: String,
      pathao_city_id: String,
      pathao_zone_id: String,
      pathao_area_id: String,
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      transactionId: String,
      val_id: String,
      bkashPaymentID: String,
      status: {
        type: String,
        enum: ["Pending", "Completed", "Failed", "Cancelled", "COD"],
        default: "Pending",
      },
    },
    itemsPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    couponCode: String,
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    pathaoConsignmentId: String,
    pathaoStatus: { type: String, default: "Not Synced" },
    isDirectBuy: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);