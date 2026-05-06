import 'dotenv/config';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { socketAuth } from './middleware/socketAuth.js'; 
import { initSocketEvents } from './modules/chat/chat.socket.js'; 

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

//  Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://clothing-e-commerce-web.vercel.app"],
    credentials: true
  }
});

// 🛡️ Socket Middleware
io.use(socketAuth);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Vanguard DB Linked');
    
    //  Initialize Chat Events
    initSocketEvents(io);

    server.listen(PORT, () => console.log(`🚀 System Live & Socket Ready: ${PORT}`));
  });