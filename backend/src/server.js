import 'dotenv/config';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import app from './app.js';
import { socketAuth } from './middleware/socketAuth.js'; 
import { initSocketEvents } from './modules/chat/chat.socket.js'; 

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

//  Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://clothing-e-commerce-web.vercel.app",
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
  }
});

// 🚀 Horizontal Scaling: Redis Adapter
if (process.env.REDIS_URL) {
  const pubClient = new Redis(process.env.REDIS_URL);
  const subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));
  console.log('📡 Redis Adapter Linked: Horizontal Scaling Enabled');
}

// 🛡️ Socket Middleware
io.use(socketAuth);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Vanguard DB Linked');
    
    //  Initialize Chat Events
    initSocketEvents(io);

    server.listen(PORT, () => console.log(`🚀 System Live & Socket Ready: ${PORT}`));
  });