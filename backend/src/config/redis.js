// src/config/redis.js
import Redis from 'ioredis';

let redisClient = null;

if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL);
  redisClient.on('connect', () => console.log('Redis connected'));
  redisClient.on('error', (err) => console.error('Redis error:', err));
} else if (process.env.NODE_ENV === 'production') {
  console.warn('⚠️ Redis not configured. Pathao token caching disabled.');
}

export default redisClient;