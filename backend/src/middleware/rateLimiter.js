import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisClient from '../config/redis.js';

const isDev = process.env.NODE_ENV !== 'production';

// Setup store — Redis যদি available থাকে, নাহলে in-memory
let store = undefined;
if (redisClient) {
  try {
    store = new RedisStore({
      // @ts-ignore
      sendCommand: async (...args) => {
        try {
          return await redisClient.call(args[0], ...args.slice(1));
        } catch (err) {
          console.warn("⚠️ Redis Store command failure, falling back to memory:", err.message);
          throw err;
        }
      },
    });
    console.log("🛡️ Redis Rate Limiting Store Initialized");
  } catch (err) {
    console.error("❌ Failed to initialize Redis rate limit store, using Memory Store:", err.message);
  }
} else {
  console.log(`🛡️ Memory Rate Limiting Store Initialized (Redis disabled) [${isDev ? 'DEV' : 'PROD'}]`);
}

// Custom handler for standard response shape
const rateLimitHandler = (req, res, next, options) => {
  res.status(429).json({
    success: false,
    message: options.message,
    timestamp: new Date().toISOString()
  });
};

// ─────────────────────────────────────────────
// Global API Limiter
// DEV:  skip (সব request allow)
// PROD: 300 requests/minute per IP
// ─────────────────────────────────────────────
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: isDev ? 0 : 300, // 0 = unlimited in dev
  message: 'Too many requests from this IP, please try again after a minute.',
  standardHeaders: true,
  legacyHeaders: false,
  store: store,
  skip: () => isDev, // development এ সম্পূর্ণ skip
  handler: rateLimitHandler
});

// ─────────────────────────────────────────────
// Login Limiter
// DEV:  20 attempts/15min
// PROD: 5 attempts/15min
// ─────────────────────────────────────────────
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 20 : 5,
  message: 'Too many login attempts. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  store: store,
  keyGenerator: (req) => {
    const email = req.body?.email ? String(req.body.email).toLowerCase().trim() : '';
    return email ? `login:${req.ip}:${email}` : `login:${req.ip}`;
  },
  handler: rateLimitHandler
});

// ─────────────────────────────────────────────
// Register Limiter
// DEV:  20 accounts/hour
// PROD: 3 accounts/hour
// ─────────────────────────────────────────────
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isDev ? 20 : 3,
  message: 'Too many registration attempts. Please try again after an hour.',
  standardHeaders: true,
  legacyHeaders: false,
  store: store,
  handler: rateLimitHandler
});

// ─────────────────────────────────────────────
// Checkout Limiter
// DEV:  50 checkouts/hour
// PROD: 10 checkouts/hour
// ─────────────────────────────────────────────
export const checkoutLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isDev ? 50 : 10,
  message: 'Too many checkout attempts. Please try again after an hour.',
  standardHeaders: true,
  legacyHeaders: false,
  store: store,
  keyGenerator: (req) => {
    const userId = req.user?._id || req.user?.id;
    return userId ? `checkout:${userId}` : `checkout:${req.ip}`;
  },
  handler: rateLimitHandler
});
