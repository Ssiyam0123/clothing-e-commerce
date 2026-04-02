import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: String,
  size: { type: mongoose.Schema.Types.ObjectId, ref: "Size", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: String,
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    orderItems: [orderItemSchema],
    shippingAddress: {
      name: String,
      email: String,
      phone: String,
      street: String,
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
    itemsPrice: Number,
    shippingPrice: Number,
    discountAmount: Number,
    totalPrice: Number,
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
