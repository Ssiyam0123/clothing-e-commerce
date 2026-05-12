import jwt from 'jsonwebtoken';
import User from '../modules/user/user.model.js';

export const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token; // 👈 ফ্রন্টএন্ড থেকে টোকেন এখানে আসবে
    if (!token) return next(new Error("Identity Required"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password").populate("role");

    if (!user) return next(new Error("Invalid Identity"));

    socket.user = user; // 🛰️ সকেটের সাথে ইউজার অবজেক্ট বাইন্ড করে দিলাম
    next();
  } catch (err) {
    next(new Error("Protocol Denied"));
  }
};