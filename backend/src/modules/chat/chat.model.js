import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String },
  image: { type: String },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // [User, Admin]
  lastMessage: String,
  messages: [messageSchema],
  status: { type: String, enum: ["open", "closed"], default: "open" },
  type: { type: String, enum: ["support", "direct"], default: "support" }
}, { timestamps: true });

// 🚀 Indexing for performance
conversationSchema.index({ participants: 1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);