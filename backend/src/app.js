import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Route Imports
import userRoutes from './modules/user/user.routes.js';
import categoryRoutes from './modules/category/category.routes.js';
import subcategoryRoutes from './modules/subcategory/subcategory.routes.js';
import sizeRoutes from './modules/size/size.routes.js';
import productRoutes from './modules/product/product.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import wishlistRoutes from './modules/wishlist/wishlist.routes.js';
import orderRoutes from './modules/order/order.routes.js';
import pathaoRoutes from './modules/pathao/pathao.routes.js';
import reviewRoutes from './modules/review/review.routes.js';
import flashSaleRoutes from './modules/flashSale/flashSale.routes.js';
import bannerRoutes from './modules/banner/banner.routes.js';
import bannerCampaignRoutes from './modules/bannerCampaign/bannerCampaign.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import couponRoutes from './modules/coupon/coupon.routes.js';
import trackingRoutes from './modules/tracking/tracking.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';
import apiKeysRoutes from './modules/apiKeys/apiKey.routes.js';

// Middleware Imports
import { errorHandler } from './middleware/errorHandler.js';
import { handleFileError } from './middleware/cleanup.js';

const app = express();

/**
 * 🚀 1. PRO FIX: Vercel/Reverse Proxy Trust
 */
app.set('trust proxy', 1);

//  Allowed Origins Config
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:3000',
    'https://clothing-e-commerce-web.vercel.app',
    'https://sandbox.sslcommerz.com',       
    'https://securepay.sslcommerz.com',
    'https://connect.facebook.net',
    process.env.SSL_SANDBOX_URL, 
    process.env.SSL_LIVE_URL,
    ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(url => url.trim()) : [])
].filter(Boolean);

/**
 *  2. ADVANCED CORS SETUP
 */
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin === 'null') return callback(null, true);
        
        const isNgrok = origin.match(/^https:\/\/.*\.ngrok-free\.app$/) || origin.match(/^https:\/\/.*\.ngrok\.io$/);
        const isVercelPreview = origin.endsWith('.vercel.app');
        
        if (allowedOrigins.includes(origin) || isNgrok || isVercelPreview) {
            callback(null, true);
        } else {
            console.log("❌ CORS Blocked for Origin:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With', 
        'Accept', 
        'Cookie', 
        'x-guest-id',
        'set-cookie'
    ],
    exposedHeaders: ['set-cookie']
}));

/**
 *  3. PAYLOAD LIMITS
 */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// 🧹 File Cleanup Middleware
app.use(handleFileError); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static Uploads (Local development only)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/**
 * Vercel Health Check & Root Route
 */
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Vanguard System Engine is Active. 🚀',
    environment: process.env.NODE_ENV || 'development'
  });
});

//  API Routes Pipeline
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/sizes', sizeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/pathao', pathaoRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/flash-sales', flashSaleRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/banner-campaigns', bannerCampaignRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/track', trackingRoutes);
app.use('/api/api-keys', apiKeysRoutes);
app.use('/api/settings', settingsRoutes);



/**
 *  GLOBAL ERROR HANDLER
 */
app.use(errorHandler);

export default app;