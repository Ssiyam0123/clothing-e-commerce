import redis from "../config/redis.js";

/**
 * 🚀 High-Performance Redis Caching Middleware
 * @param {number} ttl - Time to live in seconds
 */
export const cacheMiddleware = (ttl = 300) => {
  return async (req, res, next) => {
    if (!redis || req.method !== "GET" || req.headers.authorization) {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      if (redis.status !== "ready" && redis.status !== "connect") {
        return next();
      }

      const cachedResponse = await redis.get(key);
      if (cachedResponse) {
        return res.status(200).json(JSON.parse(cachedResponse));
      }

      res.originalJson = res.json;
      res.json = (data) => {
        if (res.statusCode === 200) {
          // Store in cache without blocking the response
          redis.set(key, JSON.stringify(data), "EX", ttl).catch(err => {
            console.error("Redis Set Error:", err.message);
          });
        }
        res.originalJson(data);
      };

      next();
    } catch (err) {
      console.error("Redis Cache Middleware Error:", err.message);
      next();
    }
  };
};

/**
 * 🗑️ Efficient Cache Clearing (Non-blocking)
 * @param {string} pattern - Pattern to match keys
 */
export const clearCache = (pattern) => {
  if (!redis || (redis.status !== "ready" && redis.status !== "connect")) return;

  // Use scanStream instead of keys for better performance
  const stream = redis.scanStream({
    match: pattern,
    count: 100
  });

  stream.on("data", (resultKeys) => {
    if (resultKeys.length > 0) {
      redis.del(resultKeys).catch(err => console.error("Redis Del Error:", err.message));
    }
  });

  stream.on("error", (err) => {
    console.error("Redis Scan Error:", err.message);
  });
};
