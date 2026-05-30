import mongoose from "mongoose";
import axios from "axios";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import ApiKey from "../settings/apiKey.model.js";
import PageSetting from "../settings/settings.model.js";

import Product from "../product/product.model.js";
import Order from "../order/order.model.js";
import Size from "../size/size.model.js";
import Category from "../category/category.model.js";
import Coupon from "../coupon/coupon.model.js";
import User from "../user/user.model.js";
import FlashSale from "../flashSale/flashSale.model.js";
import Blog from "../blog/blog.model.js";
import { decrypt } from "../../utils/encryption.js";


// Helper function to resolve API key
const getApiKey = async () => {
  let apiKey = "";
  try {
    const apiKeys = await ApiKey.findOne();
    if (apiKeys && apiKeys.geminiApiKey) {
      apiKey = decrypt(apiKeys.geminiApiKey);
    }
  } catch (error) {
    console.error("Error reading geminiApiKey from DB:", error.message);
  }

  return apiKey;
};

// Define tool functions
const localTools = {
  searchProducts: async ({ query }) => {
    try {
      let products = await Product.find({ $text: { $search: query } })
        .limit(5)
        .populate("category", "name")
        .lean();
      
      if (!products || products.length === 0) {
        products = await Product.find({ name: { $regex: query, $options: "i" } })
          .limit(5)
          .populate("category", "name")
          .lean();
      }

      return {
        success: true,
        count: products.length,
        products: products.map(p => ({
          id: p._id,
          name: p.name,
          price: p.price,
          category: p.category?.name || "Uncategorized",
          isActive: p.isActive,
          sizes: p.sizes.map(s => ({ stock: s.stock }))
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  updateProductStock: async ({ productId, sizeName, newStock }) => {
    try {
      const product = await Product.findById(productId).populate("sizes.size");
      if (!product) {
        return { success: false, error: "Product not found" };
      }

      // Check sizes matching sizeName (case-insensitive)
      let matchedSize = product.sizes.find(
        s => s.size && s.size.name.toLowerCase() === sizeName.toLowerCase()
      );

      if (!matchedSize) {
        // Fallback: If not found in current product, find the size document globally
        const sizeDoc = await Size.findOne({ name: { $regex: `^${sizeName}$`, $options: "i" } });
        if (sizeDoc) {
          // If product doesn't have this size yet, add it
          product.sizes.push({ size: sizeDoc._id, stock: newStock });
          await product.save();
          return {
            success: true,
            message: `Added size ${sizeName} to ${product.name} with stock ${newStock}`
          };
        }
        return {
          success: false,
          error: `Size "${sizeName}" is not a valid size option in the store.`
        };
      }

      matchedSize.stock = newStock;
      await product.save();

      return {
        success: true,
        message: `Successfully updated stock of "${product.name}" (Size: ${sizeName}) to ${newStock}.`
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getDashboardSummary: async () => {
    try {
      const [ordersCount, productsCount] = await Promise.all([
        Order.countDocuments(),
        Product.countDocuments()
      ]);

      const revenueResult = await Order.aggregate([
        { $match: { "paymentResult.status": { $in: ["Completed", "COD"] } } },
        { $group: { _id: null, total: { $sum: { $toDouble: "$totalPrice" } } } }
      ]);
      const totalRevenue = revenueResult[0]?.total || 0;

      // Low stock stats (sum of stock < 10)
      const lowStockProducts = await Product.aggregate([
        { $project: { name: 1, totalStock: { $sum: "$sizes.stock" } } },
        { $match: { totalStock: { $lt: 10 } } },
        { $limit: 5 }
      ]);

      return {
        success: true,
        ordersCount,
        productsCount,
        totalRevenue: Math.round(totalRevenue),
        criticalStockCount: lowStockProducts.length,
        criticalItems: lowStockProducts
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getRecentOrders: async ({ limit = 5 }) => {
    try {
      const orders = await Order.find({})
        .sort("-createdAt")
        .limit(limit)
        .populate("user", "name email")
        .lean();

      return {
        success: true,
        orders: orders.map(o => ({
          id: o._id,
          customer: o.user?.name || o.shippingAddress?.name || "Guest User",
          totalPrice: o.totalPrice,
          paymentStatus: o.paymentResult?.status || "Pending",
          orderStatus: o.orderStatus || "Processing",
          createdAt: o.createdAt
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  createProduct: async ({ name, price, description, categoryName, sizeStockList, brand, color, material, gender }) => {
    try {
      let categoryObj = await Category.findOne({ name: { $regex: `^${categoryName}$`, $options: "i" } });
      if (!categoryObj) {
        categoryObj = await Category.findOne({ name: { $regex: categoryName, $options: "i" } });
      }
      if (!categoryObj) {
        return { success: false, error: `Category "${categoryName}" does not exist. Please specify a valid category.` };
      }

      const sizesArray = [];
      if (sizeStockList && Array.isArray(sizeStockList)) {
        for (const item of sizeStockList) {
          const sizeDoc = await Size.findOne({ name: { $regex: `^${item.sizeName}$`, $options: "i" } });
          if (sizeDoc) {
            sizesArray.push({
              size: sizeDoc._id,
              stock: Math.max(0, parseInt(item.stock))
            });
          }
        }
      }

      let siteName = "Store";
      try {
        const settings = await PageSetting.findOne();
        if (settings && settings.branding && settings.branding.siteName) {
          siteName = settings.branding.siteName;
        }
      } catch (error) {
        console.error("Error reading siteName from PageSetting:", error.message);
      }

      const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

      const product = await Product.create({
        name,
        slug,
        price: parseFloat(price),
        description: description || "",
        category: categoryObj._id,
        sizes: sizesArray,
        brand: brand || siteName,
        color: color || "",
        material: material || "",
        gender: gender || "Unisex",
        isActive: true
      });


      return {
        success: true,
        message: `Successfully created product "${product.name}" under category "${categoryObj.name}"!`,
        productId: product._id
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  updateProductSeo: async ({ productId, metaTitle, metaDescription, keywords }) => {
    try {
      const product = await Product.findById(productId);
      if (!product) return { success: false, error: "Product not found" };

      product.seo = {
        metaTitle: metaTitle || "",
        metaDescription: metaDescription || "",
        keywords: keywords || ""
      };
      await product.save();
      return { success: true, message: `Successfully updated SEO/AEO tags for product "${product.name}"` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  updateOrderStatus: async ({ orderId, status }) => {
    try {
      const order = await Order.findById(orderId);
      if (!order) return { success: false, error: "Order not found" };
      order.orderStatus = status;
      await order.save();
      return { success: true, message: `Successfully updated order #${orderId} status to "${status}"` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  createCoupon: async ({ code, discountType, discountValue, usageLimit = 100, daysValid = 30 }) => {
    try {
      const existing = await Coupon.findOne({ code: code.toUpperCase() });
      if (existing) return { success: false, error: `Coupon code "${code}" already exists.` };

      const expiry = new Date();
      expiry.setDate(expiry.getDate() + parseInt(daysValid));

      const coupon = await Coupon.create({
        code: code.toUpperCase(),
        discountType: discountType || "percentage",
        discountValue: parseFloat(discountValue),
        usageLimit: parseInt(usageLimit),
        endDate: expiry,
        isActive: true
      });

      return {
        success: true,
        message: `Successfully created coupon "${coupon.code}" (${coupon.discountValue}${coupon.discountType === "percentage" ? "%" : "$"} off, expires on ${coupon.endDate.toLocaleDateString()})`
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  toggleFlashSale: async ({ productId, discountPercentage, name = "AI Flash Sale" }) => {
    try {
      const product = await Product.findById(productId);
      if (!product) return { success: false, error: "Product not found" };

      let flashSale = await FlashSale.findOne({ isActive: true });
      if (!flashSale) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        
        flashSale = await FlashSale.create({
          name,
          discount: parseInt(discountPercentage || 20),
          products: [productId],
          startDate: new Date(),
          endDate: expiry,
          startImmediately: true,
          isActive: true
        });
        return { success: true, message: `Created new flash sale "${name}" and added ${product.name}` };
      } else {
        if (flashSale.products.includes(productId)) {
          flashSale.products = flashSale.products.filter(id => String(id) !== productId);
          await flashSale.save();
          return { success: true, message: `Removed "${product.name}" from active flash sale "${flashSale.name}"` };
        } else {
          flashSale.products.push(productId);
          await flashSale.save();
          return { success: true, message: `Added "${product.name}" to active flash sale "${flashSale.name}"` };
        }
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  searchCustomer: async ({ query }) => {
    try {
      const users = await User.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } }
        ]
      }).limit(5).select("name email isActive role createdAt").lean();
      return {
        success: true,
        count: users.length,
        users
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  toggleUserStatus: async ({ userId }) => {
    try {
      const user = await User.findById(userId);
      if (!user) return { success: false, error: "User not found" };

      user.isActive = !user.isActive;
      await user.save();
      return {
        success: true,
        message: `Successfully changed status of customer "${user.name}" to ${user.isActive ? "ACTIVE" : "BLOCKED"}`
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  createBlogDraft: async ({ title, content, category = "NEWS" }) => {
    try {
      const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      
      const authorUser = await User.findOne({ role: { $ne: null } }); 
      const authorId = authorUser ? authorUser._id : null;

      const blog = await Blog.create({
        title,
        slug,
        content,
        category: category.toUpperCase(),
        author: authorId || new mongoose.Types.ObjectId(),
        featuredImage: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f",
        status: "DRAFT",
        readingTime: "3 min read"
      });

      return {
        success: true,
        message: `Successfully created blog draft "${blog.title}" under category "${blog.category}"!`,
        blogId: blog._id
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  listCoupons: async () => {
    try {
      const coupons = await Coupon.find({ isActive: true }).lean();
      return {
        success: true,
        count: coupons.length,
        coupons: coupons.map(c => ({
          code: c.code,
          discountType: c.discountType,
          discountValue: c.discountValue,
          usageLimit: c.usageLimit,
          usedCount: c.usedCount,
          isActive: c.isActive,
          endDate: c.endDate
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Define Gemini tool declarations (Function Declarations)
const toolDeclarations = [
  {
    name: "searchProducts",
    description: "Search for clothing products in the catalog by a text query or product name",
    parameters: {
      type: "OBJECT",
      properties: {
        query: {
          type: "STRING",
          description: "The search query (e.g. 'T-shirt', 'Jeans', 'Red jacket')"
        }
      },
      required: ["query"]
    }
  },
  {
    name: "updateProductStock",
    description: "Update the inventory / stock count of a specific size of a product",
    parameters: {
      type: "OBJECT",
      properties: {
        productId: {
          type: "STRING",
          description: "The MongoDB ID of the product"
        },
        sizeName: {
          type: "STRING",
          description: "The name of the size (e.g. 'S', 'M', 'L', 'XL', 'XXL')"
        },
        newStock: {
          type: "INTEGER",
          description: "The new stock count to set (must be >= 0)"
        }
      },
      required: ["productId", "sizeName", "newStock"]
    }
  },
  {
    name: "getDashboardSummary",
    description: "Get general store business metrics, total completed sales revenue, order count, and low stock inventory alerts",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  },
  {
    name: "getRecentOrders",
    description: "Retrieve a list of the most recent orders placed in the store",
    parameters: {
      type: "OBJECT",
      properties: {
        limit: {
          type: "INTEGER",
          description: "The number of orders to return (defaults to 5)"
        }
      }
    }
  },
  {
    name: "createProduct",
    description: "Create a new clothing product in the store database catalog",
    parameters: {
      type: "OBJECT",
      properties: {
        name: { type: "STRING", description: "Name of the clothing product" },
        price: { type: "NUMBER", description: "Retail price of the product" },
        description: { type: "STRING", description: "Detailed description of the product" },
        categoryName: { type: "STRING", description: "Category name (e.g., 'T-Shirt', 'Pants', 'Outerwear')" },
        sizeStockList: {
          type: "ARRAY",
          description: "List of sizes and their initial stock levels",
          items: {
            type: "OBJECT",
            properties: {
              sizeName: { type: "STRING", description: "Name of size e.g. 'S', 'M', 'L', 'XL'" },
              stock: { type: "INTEGER", description: "Initial stock quantity" }
            },
            required: ["sizeName", "stock"]
          }
        },
        brand: { type: "STRING", description: "Brand name" },
        color: { type: "STRING", description: "Primary color name" },
        material: { type: "STRING", description: "Fabric material" },
        gender: { type: "STRING", description: "Target gender ('Men', 'Women', 'Unisex', 'Kids')" }
      },
      required: ["name", "price", "categoryName"]
    }
  },
  {
    name: "updateProductSeo",
    description: "Update the search engine optimization (SEO / AEO) meta details and keywords of a specific product",
    parameters: {
      type: "OBJECT",
      properties: {
        productId: { type: "STRING", description: "MongoDB object ID of the product to modify" },
        metaTitle: { type: "STRING", description: "Optimized SEO Meta Title" },
        metaDescription: { type: "STRING", description: "Optimized SEO Meta Description" },
        keywords: { type: "STRING", description: "Comma-separated keywords (e.g., 'jeans, pants, blue jeans')" }
      },
      required: ["productId", "metaTitle", "metaDescription", "keywords"]
    }
  },
  {
    name: "updateOrderStatus",
    description: "Change the processing / delivery status of a customer order",
    parameters: {
      type: "OBJECT",
      properties: {
        orderId: { type: "STRING", description: "MongoDB ID of the order" },
        status: { type: "STRING", description: "New status of order, e.g., 'Processing', 'Shipped', 'Delivered', 'Cancelled'" }
      },
      required: ["orderId", "status"]
    }
  },
  {
    name: "createCoupon",
    description: "Generate a new active store coupon code for customer discounts",
    parameters: {
      type: "OBJECT",
      properties: {
        code: { type: "STRING", description: "Coupon code text (e.g. SUMMERSALE)" },
        discountType: { type: "STRING", description: "Type of discount ('percentage' or 'fixed')" },
        discountValue: { type: "NUMBER", description: "Discount rate (e.g. 15 for percentage, or 100 for fixed USD)" },
        usageLimit: { type: "INTEGER", description: "Total number of times coupon can be used storewide" },
        daysValid: { type: "INTEGER", description: "Number of days the coupon will remain active from today" }
      },
      required: ["code", "discountType", "discountValue"]
    }
  },
  {
    name: "toggleFlashSale",
    description: "Add or remove a product from the active flash sale catalog immediately",
    parameters: {
      type: "OBJECT",
      properties: {
        productId: { type: "STRING", description: "MongoDB ID of the product" },
        discountPercentage: { type: "INTEGER", description: "Discount percentage for this flash sale (e.g. 25 for 25% off)" },
        name: { type: "STRING", description: "Name of the Flash Sale campaign" }
      },
      required: ["productId"]
    }
  },
  {
    name: "searchCustomer",
    description: "Look up and search customer user profiles by name or email address",
    parameters: {
      type: "OBJECT",
      properties: {
        query: { type: "STRING", description: "Customer name or email address query" }
      },
      required: ["query"]
    }
  },
  {
    name: "toggleUserStatus",
    description: "Toggle activation status of a user. Can ban/block or activate/unblock accounts",
    parameters: {
      type: "OBJECT",
      properties: {
        userId: { type: "STRING", description: "MongoDB ID of the user" }
      },
      required: ["userId"]
    }
  },
  {
    name: "createBlogDraft",
    description: "Draft a new fashion or marketing blog post for the store",
    parameters: {
      type: "OBJECT",
      properties: {
        title: { type: "STRING", description: "Blog title" },
        content: { type: "STRING", description: "Full HTML content/article body text" },
        category: { type: "STRING", description: "Category: 'LIFESTYLE', 'COLLECTION', 'FABRIC', 'CULTURE', 'NEWS'" }
      },
      required: ["title", "content"]
    }
  },
  {
    name: "listCoupons",
    description: "Retrieve a list of all active discount coupons available in the store",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  }
];



export const handleAdminAiChat = asyncHandler(async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      success: false,
      message: "A list of messages is required."
    });
  }

  const apiKey = await getApiKey();
  if (!apiKey) {
    return res.status(500).json({
      success: false,
      message: "GEMINI_API_KEY is not configured on the server. Please add it to your Settings or environment variables."
    });
  }

  // Format incoming messages into Gemini contents structure
  const contents = messages.map(msg => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }]
  }));

  // Helper: call Gemini API with retry + model fallback
  const MODELS = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
  const MAX_RETRIES = 2;

  const callGeminiWithRetry = async (payload) => {
    let lastError = null;
    for (const model of MODELS) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const response = await axios.post(url, payload, { timeout: 25000 });
          return response;
        } catch (err) {
          lastError = err;
          const status = err.response?.status;

          // 429 = rate limit — wait short delay (2s, 4s) to avoid request timeouts
          if (status === 429 && attempt < MAX_RETRIES) {
            const delay = 2000 * attempt;
            console.warn(`⏳ Rate limited (429) on ${model}, waiting ${delay / 1000}s before retry (attempt ${attempt}/${MAX_RETRIES})...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          if (status === 429) {
            // Rate limit retries exhausted for this model — fall back immediately to next model
            console.warn(`❌ Model ${model} rate limited (429). Trying next model...`);
            break;
          }

          // Other transient errors (500, 502, 503, 504) — short backoff, then try next model
          if ([500, 502, 503, 504].includes(status) && attempt < MAX_RETRIES) {
            const delay = 1000 * attempt;
            console.warn(`⏳ Gemini ${model} returned ${status}, retrying in ${delay}ms (attempt ${attempt}/${MAX_RETRIES})...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          // Non-retryable error or max retries exhausted — try next model
          break;
        }
      }
    }
    // All models and retries exhausted
    throw lastError;
  };

  try {
    let keepLooping = true;
    let iterations = 0;
    const maxIterations = 5; // Prevent infinite loops
    let finalResponseText = "";
    let toolExecutionLog = [];

    while (keepLooping && iterations < maxIterations) {
      iterations++;
      
      const payload = {
        contents,
        tools: [{ functionDeclarations: toolDeclarations }]
      };

      const response = await callGeminiWithRetry(payload);
      const candidate = response?.data?.candidates?.[0];
      const parts = candidate?.content?.parts;

      if (!parts) {
        throw new Error("No parts returned from Gemini API");
      }

      // Find any tool calls requested by Gemini
      const functionCalls = parts.filter(part => part.functionCall);

      if (functionCalls.length > 0) {
        // Gemini wants to run one or more functions
        const modelContent = {
          role: "model",
          parts: functionCalls
        };
        contents.push(modelContent);

        const responseParts = [];
        for (const call of functionCalls) {
          const { name, args } = call.functionCall;
          const toolFn = localTools[name];

          let result;
          if (toolFn) {
            toolExecutionLog.push({ name, args, status: "executing" });
            result = await toolFn(args);
            toolExecutionLog.push({ name, args, status: "completed", result });
          } else {
            result = { error: `Tool ${name} not found` };
          }

          responseParts.push({
            functionResponse: {
              name,
              response: { result }
            }
          });
        }

        // Push the tool results back into the conversation history
        contents.push({
          role: "user",
          parts: responseParts
        });

      } else {
        // No function calls, we received the final text reply
        finalResponseText = parts.map(p => p.text).join("\n");
        keepLooping = false;
      }
    }

    res.json({
      success: true,
      reply: finalResponseText,
      toolExecutions: toolExecutionLog
    });

  } catch (err) {
    console.error("❌ Gemini AI Admin Chat error:", err.message);
    const status = err.response?.status;
    const isQuotaError = err.response?.data?.error?.message?.includes("quota") || 
                         err.message?.includes("429") || 
                         status === 429;
    const is503 = status === 503;
    let errMsg;
    if (isQuotaError) {
      errMsg = "Gemini API Quota Exceeded (429). You are on the free tier limit (15 RPM). Please wait a minute before retrying, or configure a premium/higher-limit API key.";
    } else if (is503) {
      errMsg = "Gemini API is temporarily unavailable (503). The service may be experiencing high demand. Please try again in a few seconds.";
    } else {
      errMsg = `Failed to communicate with AI Assistant: ${err.response?.data?.error?.message || err.message}`;
    }
    res.status(status || 500).json({
      success: false,
      message: errMsg
    });
  }
});
