import mongoose from "mongoose";
import Product from "./src/modules/product/product.model.js";
import Order from "./src/modules/order/order.model.js";
import { calculateValidatedOrder, normalizeShippingAddress, finalizeOrderProcessing } from "./src/modules/order/order.utils.js";

const MONGO_URI = "mongodb+srv://yt:MNuNg1eKCoTi9cau@cluster0.kgw4w.mongodb.net/e-commerce-z?appName=Cluster0";

async function test() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB!");

  try {
    const orderItems = [
      {
        product: "69c7b8eadd74230ef1720d3a", // Women's Sports Bra 12
        size: "69c79515dd74230ef1720c89", // S
        quantity: 1
      }
    ];

    const shippingAddress = {
      name: "Shahjahan Miah",
      email: "shahjahan.miah32@example.com",
      phone: "01710000032",
      address: "Dhaka, Bangladesh"
    };

    console.log("Calculating order...");
    const orderData = await calculateValidatedOrder(
      orderItems,
      "",
      undefined
    );
    console.log("Order data calculated:", orderData);

    const order = new Order({
      user: "69d171d519953b7130bf1b6d",
      isGuest: false,
      orderItems: orderData.validatedItems,
      shippingAddress: normalizeShippingAddress(shippingAddress),
      itemsPrice: orderData.itemsPrice,
      discountAmount: orderData.discountAmount,
      shippingPrice: orderData.shippingPrice,
      totalPrice: orderData.totalPrice,
      couponCode: orderData.couponCode,
      paymentMethod: "COD",
      orderStatus: "Processing",
      paymentResult: {
        transactionId: `ADMIN-${new mongoose.Types.ObjectId().toString()}`,
        status: "Pending",
      },
    });

    console.log("Saving order...");
    const createdOrder = await order.save();
    console.log("Order saved successfully! ID:", createdOrder._id);

    console.log("Finalizing order...");
    await finalizeOrderProcessing(createdOrder);
    console.log("Order finalized successfully!");
  } catch (err) {
    console.error("Error occurred:", err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
