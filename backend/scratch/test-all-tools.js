import dotenv from "dotenv";
import mongoose from "mongoose";
import { localTools } from "../src/modules/admin/ai-chat.controller.js";
import Product from "../src/modules/product/product.model.js";
import Category from "../src/modules/category/category.model.js";
import Subcategory from "../src/modules/subcategory/subcategory.model.js";
import Order from "../src/modules/order/order.model.js";
import User from "../src/modules/user/user.model.js";
import Coupon from "../src/modules/coupon/coupon.model.js";
import Blog from "../src/modules/blog/blog.model.js";
import BannerCampaign from "../src/modules/bannerCampaign/bannerCampaign.model.js";
import FlashSale from "../src/modules/flashSale/flashSale.model.js";

dotenv.config();

const runAudit = async () => {
  console.log("=== STARTING AI CHAT TOOLS AUDIT ===");
  if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in environment variables.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  // Fetch real document references to feed into the test tools
  const product = await Product.findOne();
  const category = await Category.findOne();
  const subcategory = await Subcategory.findOne();
  const order = await Order.findOne();
  const user = await User.findOne();
  const coupon = await Coupon.findOne();
  const blog = await Blog.findOne();
  const banner = await BannerCampaign.findOne();
  const flashSale = await FlashSale.findOne();

  console.log("\n--- Real Database IDs Resolved for Testing ---");
  console.log(`Product ID: ${product?._id || "None"}`);
  console.log(`Category ID: ${category?._id || "None"}`);
  console.log(`Subcategory ID: ${subcategory?._id || "None"}`);
  console.log(`Order ID: ${order?._id || "None"}`);
  console.log(`User ID: ${user?._id || "None"}`);
  console.log(`Coupon ID: ${coupon?._id || "None"}`);
  console.log(`Blog ID: ${blog?._id || "None"}`);
  console.log(`Banner Campaign ID: ${banner?._id || "None"}`);
  console.log(`Flash Sale ID: ${flashSale?._id || "None"}\n`);

  const auditLog = [];

  const runTest = async (toolName, arg) => {
    console.log(`Testing tool: ${toolName}...`);
    try {
      const start = Date.now();
      const res = await localTools[toolName](arg);
      const duration = Date.now() - start;
      if (res && res.success === false) {
        console.warn(`⚠️ Tool ${toolName} returned success=false:`, res.error || res);
        auditLog.push({ toolName, status: "WARNING", duration, message: res.error || JSON.stringify(res) });
      } else {
        console.log(`✅ Tool ${toolName} succeeded in ${duration}ms`);
        auditLog.push({ toolName, status: "SUCCESS", duration, message: res.message || "Execution success" });
      }
    } catch (err) {
      console.error(`❌ Tool ${toolName} threw an unhandled exception:`, err);
      auditLog.push({ toolName, status: "FAILED", duration: 0, message: err.message });
    }
  };

  // Test 1: searchProducts
  await runTest("searchProducts", { query: product ? product.name : "shirt" });

  // Test 2: updateProductStock
  if (product && product.sizes && product.sizes.length > 0) {
    await runTest("updateProductStock", {
      productId: String(product._id),
      sizeName: "M", // size Name
      newStock: 25
    });
  } else {
    console.log("Skipping updateProductStock (No product with sizes available)");
  }

  // Test 3: getDashboardSummary
  await runTest("getDashboardSummary", {});

  // Test 4: getRecentOrders
  await runTest("getRecentOrders", { limit: 2 });

  // Test 5: createProduct
  await runTest("createProduct", {
    name: "Girls Legraa Track Pants",
    price: 1200,
    description: "Perfect girls track pants",
    categoryName: category ? category.name : "Women",
    sizeStockList: [{ sizeName: "M", stock: 50 }],
    gender: "Women"
  });

  // Test 6: updateProductSeo
  if (product) {
    await runTest("updateProductSeo", {
      productId: String(product._id),
      metaTitle: "Updated Product Meta Title",
      metaDescription: "Optimized description of product",
      keywords: "pants, legraa, tracking"
    });
  }

  // Test 7: updateOrderStatus
  if (order) {
    await runTest("updateOrderStatus", {
      orderId: String(order._id),
      status: "Processing"
    });
  }

  // Test 8: createCoupon
  await runTest("createCoupon", {
    code: `AUDIT${Math.floor(Math.random() * 1000)}`,
    discountType: "percentage",
    discountValue: 10
  });

  // Test 9: toggleFlashSale
  if (product) {
    await runTest("toggleFlashSale", {
      productId: String(product._id),
      discountPercentage: 15,
      name: "Audit Flash Sale"
    });
  }

  // Test 10: searchCustomer
  await runTest("searchCustomer", { query: user ? user.name : "admin" });

  // Test 11: toggleUserStatus
  if (user) {
    await runTest("toggleUserStatus", { userId: String(user._id) });
  }

  // Test 12: createBlogDraft
  await runTest("createBlogDraft", {
    title: "Audit Test Blog Article",
    content: "<p>This is a test audit blog content.</p>",
    category: "NEWS"
  });

  // Test 13: createCategory
  await runTest("createCategory", {
    name: `Audit Category ${Math.floor(Math.random() * 1000)}`,
    description: "Category generated by audit testing"
  });

  // Test 14: listCoupons
  await runTest("listCoupons", {});

  // Test 15: listCategories
  await runTest("listCategories", {});

  // Test 16: createOrder
  if (product) {
    await runTest("createOrder", {
      customerEmail: user ? user.email : "guest@test.com",
      orderItems: [
        {
          productId: String(product._id),
          sizeName: "M",
          quantity: 1
        }
      ],
      shippingAddress: {
        name: "Audit Customer",
        phone: "01712345678",
        street: "Banani Rd 11",
        city: "Dhaka"
      }
    });
  }

  // Test 17: updateOrder
  if (order) {
    await runTest("updateOrder", {
      orderId: String(order._id),
      orderStatus: "Processing",
      paymentStatus: "Pending"
    });
  }

  // Test 18: getOrderDetails
  if (order) {
    await runTest("getOrderDetails", { orderId: String(order._id) });
  }

  // Test 19: listOrders
  await runTest("listOrders", { status: "all", limit: 5 });

  // Test 20: syncOrderToPathao
  if (order) {
    await runTest("syncOrderToPathao", { orderId: String(order._id) });
  }

  // Test 21: editProduct
  if (product) {
    await runTest("editProduct", {
      productId: String(product._id),
      brand: "Audit Brand"
    });
  }

  // Test 22: updateProductSettings
  if (product) {
    await runTest("updateProductSettings", {
      productId: String(product._id),
      isFeatured: true
    });
  }

  // Test 23: editCategory
  if (category) {
    await runTest("editCategory", {
      categoryId: String(category._id),
      description: "Updated description via audit test"
    });
  }

  // Test 24: listSubcategories
  await runTest("listSubcategories", {});

  // Test 25: createSubcategory
  if (category) {
    await runTest("createSubcategory", {
      name: `Audit Subcat ${Math.floor(Math.random() * 1000)}`,
      categoryName: category.name
    });
  }

  // Test 26: editSubcategory
  if (subcategory) {
    await runTest("editSubcategory", {
      subcategoryId: String(subcategory._id),
      description: "Updated subcategory desc"
    });
  }

  // Test 27: listBannerCampaigns
  await runTest("listBannerCampaigns", {});

  // Test 28: createBannerCampaign
  await runTest("createBannerCampaign", {
    name: "Audit Slide Campaign",
    slides: [{ image: "http://example.com/banner.jpg", link: "/rpproducts" }]
  });

  // Test 29: editBannerCampaign
  if (banner) {
    await runTest("editBannerCampaign", {
      campaignId: String(banner._id),
      isActive: banner.isActive
    });
  }

  // Test 30: listFlashSales
  await runTest("listFlashSales", {});

  // Test 31: createFlashSaleCampaign
  if (product) {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 5);
    await runTest("createFlashSaleCampaign", {
      name: "Audit Flash Sale timed",
      discount: 25,
      productIds: [String(product._id)],
      startDate: start.toISOString(),
      endDate: end.toISOString()
    });
  }

  // Test 32: editFlashSaleCampaign
  if (flashSale) {
    await runTest("editFlashSaleCampaign", {
      campaignId: String(flashSale._id),
      name: flashSale.name
    });
  }

  // Test 33: editCoupon
  if (coupon) {
    await runTest("editCoupon", {
      couponId: String(coupon._id),
      isActive: coupon.isActive
    });
  }

  // Test 34: listBlogs
  await runTest("listBlogs", {});

  // Test 35: editBlog
  if (blog) {
    await runTest("editBlog", {
      blogId: String(blog._id),
      title: blog.title
    });
  }

  console.log("\n=== AUDIT RESULTS LOG SUMMARY ===");
  console.table(auditLog);

  await mongoose.connection.close();
  console.log("Disconnected from MongoDB.");
};

runAudit().catch(async (err) => {
  console.error("Audit run error:", err);
  await mongoose.connection.close();
});
