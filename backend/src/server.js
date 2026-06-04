import 'dotenv/config';
import dns from 'dns';

// Force Google DNS locally to bypass Cloudflare WARP DNS resolution errors on Windows
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import app, { isAllowedOrigin } from './app.js';
import { socketAuth } from './middleware/socketAuth.js'; 
import { initSocketEvents } from './modules/chat/chat.socket.js'; 
import redisClient from "./config/redis.js";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// 🚀 Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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

  let isAdapterLinked = false;
  const trySetupAdapter = () => {
    if (isAdapterLinked) return;
    if (pubClient.status === 'ready' && subClient.status === 'ready') {
      try {
        io.adapter(createAdapter(pubClient, subClient));
        console.log("📡 Redis Adapter Linked: Horizontal Scaling Enabled");
        isAdapterLinked = true;
      } catch (err) {
        console.error("❌ Failed to link Redis Adapter:", err.message);
      }
    }
  };

  pubClient.on('ready', trySetupAdapter);
  subClient.on('ready', trySetupAdapter);

  // Fallback check in case they are already connected
  trySetupAdapter();
}

// 🛡️ Socket Middleware
io.use(socketAuth);

// 📊 Socket Connection Tracking
io.on('connection', (socket) => {
  console.log(`📡 SOCKET CONNECTED: ${socket.id} (Total: ${io.engine.clientsCount})`);

  socket.on('disconnect', (reason) => {
    console.log(`🔌 SOCKET DISCONNECTED: ${socket.id} - Reason: ${reason} (Total: ${io.engine.clientsCount})`);
  });

  socket.on('error', (error) => {
    console.error(`❌ SOCKET ERROR: ${socket.id} - ${error}`);
  });
});

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