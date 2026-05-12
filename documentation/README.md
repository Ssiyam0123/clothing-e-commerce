# Vanguard E-commerce API Documentation

Welcome to the Vanguard E-commerce API documentation. This system is built with Node.js, Express, and MongoDB.

## Table of Contents

### 1. Authentication & Users
- [Auth Flow](auth-flow.md) - Detailed explanation of the authentication process.
- [Authentication API](auth.md) - Login, Register, Logout, and Token management.
- [User API](user.md) - Profile management and Admin user controls.

### 2. Product Catalog
- [Product API](product.md) - Browsing, searching, and managing products.
- [Category API](category.md) - Product categories.
- [Subcategory API](subcategory.md) - Product subcategories.
- [Size API](size.md) - Product size management.

### 3. Shopping Experience
- [Cart API](cart.md) - Shopping cart management (Guest & Auth).
- [Wishlist API](wishlist.md) - User wishlist management.
- [Coupon API](coupon.md) - Discount coupons and validation.
- [Flash Sale API](flash-sale.md) - Limited time offers.
- [Review API](review.md) - Product reviews and ratings.

### 4. Orders & Fulfillment
- [Order API](order.md) - Checkout, payment integration (SSLCommerz/bKash), and order tracking.
- [Pathao Integration](pathao.md) - Shipping and delivery with Pathao.
- [Tracking API](tracking.md) - Facebook Conversion API (CAPI) tracking.

### 5. Management & Analytics
- [Admin API](admin.md) - Dashboard statistics and overall management.
- [Banner & Campaign API](banner.md) - Homepage banners and marketing campaigns.
- [Settings API](settings.md) - Global site settings, branding, and contact info.
- [Home Layout API](home-layout.md) - Dynamic homepage section management.
- [Blog API](blog.md) - Blog posts and news.
- [Chat API](chat.md) - Real-time support chat.

---

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, BcryptJS
- **File Upload:** Cloudinary, Multer
- **Payments:** SSLCommerz, bKash
- **Shipping:** Pathao Integration
- **Caching/Session:** Redis (ioredis)
- **Communication:** Socket.io (for chat/real-time)

---

## Technical Overview
- **Base URL:** `/api`
- **Authentication:** Bearer Token (JWT) in `Authorization` header.
- **Content-Type:** `application/json`
- **Port:** `5000` (default dev)
