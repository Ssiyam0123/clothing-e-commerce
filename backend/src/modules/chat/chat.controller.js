import mongoose from "mongoose";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { Conversation, Message } from "./chat.model.js";
import User from "../user/user.model.js";

/**
 * @desc    Get chat history between two users (Paginated)
 * @route   GET /api/chat/history/:recipientId?page=1&limit=20
 */
export const getChatHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { recipientId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  // 1. Find conversation
  const conversation = await Conversation.findOne({
    participants: { $all: [userId, recipientId] },
    type: "support"
  });

  if (!conversation) return res.json([]);

  // 2. Fetch paginated messages
  const messages = await Message.find({ conversationId: conversation._id })
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("sender", "name avatar role")
    .lean();

  res.json(messages.reverse());
});

/**
 * @desc    Get all active conversations for Admin (Optimized)
 * @filter  Only show conversations with message history
 */
export const getAllConversations = asyncHandler(async (req, res) => {
  const rawConversations = await Conversation.find({ 
      type: "support",
      lastMessage: { $exists: true, $ne: null } // Only chats with history
    })
    .populate({
      path: "participants",
      select: "name email avatar role",
      populate: { path: "role" }
    })
    .sort("-updatedAt")
    .lean();

  // 🚀 Parallel Execution for Unread Counts
  const conversations = await Promise.all(rawConversations.map(async (conv) => {
    const unreadCount = await Message.countDocuments({
      conversationId: conv._id,
      isRead: false,
      sender: { $in: conv.participants.filter(p => p.role?.name === "customer").map(p => p._id) }
    });

    return { ...conv, unreadCount };
  }));

  res.json({ success: true, conversations });
});

/**
 * @desc    Search for users to start new conversation (Admin only)
 */
export const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query) return res.json([]);

  // Search by name, email or phone
  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
      { phone: { $regex: query, $options: "i" } }
    ],
  })
  .select("name email avatar role")
  .populate("role")
  .limit(10)
  .lean();

  res.json(users);
});

/**
 * @desc    Get messages for a specific conversation (Paginated)
 */
export const getConversationMessages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const messages = await Message.find({ conversationId: id })
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({
      path: "sender",
      select: "name avatar role",
      populate: { path: "role" }
    })
    .lean();

  // 📝 Optimized Mark as Read: Bulk update
  await Message.updateMany(
    { conversationId: id, isRead: false },
    { $set: { isRead: true } }
  );

  res.json(messages.reverse());
});

/**
 * @desc    Get customer's own support conversation
 */
export const getMyConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    participants: req.user._id,
    type: "support",
  }).lean();

  if (!conversation) {
    return res.json(null);
  }

  // Load latest 20 messages for initial view
  const messages = await Message.find({ conversationId: conversation._id })
    .sort("-createdAt")
    .limit(20)
    .populate({
      path: "sender",
      select: "name avatar role",
      populate: { path: "role" }
    })
    .lean();

  res.json({ ...conversation, messages: messages.reverse() });
});

/**
 * @desc    Find or create conversation with a participant (Admin only)
 */
export const startConversation = asyncHandler(async (req, res) => {
  const { participantId } = req.body;
  if (!participantId) return res.status(400).json({ success: false, message: "Participant ID required" });

  let conversation = await Conversation.findOne({
    participants: participantId,
    type: "support"
  }).populate({
    path: "participants",
    select: "name email avatar role",
    populate: { path: "role" }
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [participantId],
      type: "support"
    });
    conversation = await conversation.populate({
      path: "participants",
      select: "name email avatar role",
      populate: { path: "role" }
    });
  }

  res.json({ success: true, conversation });
});