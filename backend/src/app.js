import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// 📦 Route Imports
import userRoutes from "./modules/user/user.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import subcategoryRoutes from "./modules/subcategory/subcategory.routes.js";
import sizeRoutes from "./modules/size/size.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import wishlistRoutes from "./modules/wishlist/wishlist.routes.js"; // ✅ fixed import
import orderRoutes from "./modules/order/order.routes.js";
import pathaoRoutes from "./modules/pathao/pathao.routes.js";
import reviewRoutes from "./modules/review/review.routes.js";
import flashSaleRoutes from "./modules/flashSale/flashSale.routes.js";
import bannerCampaignRoutes from "./modules/bannerCampaign/bannerCampaign.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import couponRoutes from "./modules/coupon/coupon.routes.js";
import trackingRoutes from "./modules/tracking/tracking.routes.js";
import settingsRoutes from "./modules/settings/settings.routes.js";
import apiKeysRoutes from "./modules/apiKeys/apiKey.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import blogRoutes from "./modules/blog/blog.route.js";
import blogImageRoutes from './modules/blog/blog-image.route.js';
import chatRoutes from "./modules/chat/chat.routes.js";
// 🛡️ Middleware Imports
import { errorHandler } from "./middleware/errorHandler.js";
import { handleFileError } from "./middleware/cleanup.js";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://clothing-e-commerce-web.vercel.app" 
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "x-guest-id",
      "Cookie",
    ],
    exposedHeaders: ["set-cookie"],
  })
);

// Parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Static assets
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Vanguard System Engine is Active.",
    environment: process.env.NODE_ENV || "development",
  });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/sizes", sizeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/pathao", pathaoRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/flash-sales", flashSaleRoutes);
app.use("/api/banner-campaigns", bannerCampaignRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/track", trackingRoutes);
app.use("/api/api-keys", apiKeysRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/blogs",blogRoutes)
app.use('/api', blogImageRoutes);
app.use("/api/chat", chatRoutes);

app.use(handleFileError);
app.use(errorHandler);

export default app;