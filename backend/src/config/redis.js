// src/config/redis.js
import Redis from 'ioredis';

let redisClient = null;
let hasLoggedConnection = false;

const createClient = () => {
  if (process.env.NODE_ENV === 'test') {
    return null;
  }

  if (!process.env.REDIS_URL) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️ Redis not configured. Performance will be degraded.');
    }
    return null;
  }

  const client = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    reconnectOnError: (err) => {
      const targetError = "READONLY";
      return err.message.includes(targetError);
    },
  });

  client.on('connect', () => {
    if (!hasLoggedConnection) {
      console.log('✅ Redis connection established');
      hasLoggedConnection = true;
    }
  });

  client.on('error', (err) => {
    // Only log actual errors, not just disconnects if we already have a connection
    if (client.status !== 'reconnecting' || process.env.NODE_ENV === 'development') {
      console.error('❌ Redis error:', err.message);
    }
  });

  return client;
};

if (!redisClient) {
  redisClient = createClient();
}

export default redisClient;