import mongoose from "mongoose";
import Product from "../src/modules/product/product.model.js";

const MONGO_URI = "mongodb+srv://yt:MNuNg1eKCoTi9cau@cluster0.kgw4w.mongodb.net/e-commerce-z?appName=Cluster0";

async function queryProduct() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB!");

  try {
    const product = await Product.findOne({ slug: "baby-hooded-towel-3" }).lean();
    console.log("Product Details:\n", JSON.stringify(product, null, 2));
  } catch (err) {
    console.error("Error querying product:", err);
  } finally {
    await mongoose.disconnect();
  }
}

queryProduct();
