import 'dotenv/config';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import app from './app.js';
import { socketAuth } from './middleware/socketAuth.js'; 
import { initSocketEvents } from './modules/chat/chat.socket.js'; 
import redisClient from "./config/redis.js";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// 🚀 Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://clothing-e-commerce-web.vercel.app",
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'], // 🛰️ Force transports
  allowEIO3: true // 🛡️ Backward compatibility
});

// 🚀 Redis Adapter Setup
if (redisClient) {
  const pubClient = redisClient.duplicate();
  const subClient = redisClient.duplicate();

  pubClient.on("error", (err) => console.error("❌ Redis Pub Error:", err.message));
  subClient.on("error", (err) => console.error("❌ Redis Sub Error:", err.message));

  io.adapter(createAdapter(pubClient, subClient));
  console.log("📡 Redis Adapter Linked: Horizontal Scaling Enabled");
}

// 🛡️ Socket Middleware
io.use(socketAuth);

// ⚡ Keep-alive self-ping mechanism to keep Render instance awake
const pingSelf = () => {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl || process.env.NODE_ENV !== 'production') return;

  setInterval(async () => {
    try {
      const res = await fetch(backendUrl);
      console.log(`📡 Keep-Alive Ping Status: ${res.status} - ${new Date().toISOString()}`);
    } catch (err) {
      console.error('❌ Keep-Alive Ping Failed:', err.message);
    }
  }, 10 * 60 * 1000); // every 10 minutes
};

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Vanguard DB Linked');
    
    // 🛰️ Initialize Chat Events
    initSocketEvents(io);
    app.set('io', io);

    server.listen(PORT, () => {
      console.log(`🚀 System Live & Socket Ready: ${PORT}`);
      pingSelf();
    });
  });