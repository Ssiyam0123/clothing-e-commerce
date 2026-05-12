import mongoose from "mongoose";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { Conversation } from "./chat.model.js";

/**
 * @desc    Get chat history between two users
 * @route   GET /api/chat/history/:recipientId
 */
export const getChatHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { recipientId } = req.params;

  // 🛡️ সিনিয়র চেক: আইডি ভ্যালিড কি না?
  if (!mongoose.Types.ObjectId.isValid(recipientId)) {
    return res.status(400).json({ success: false, message: "Invalid Recipient Protocol." });
  }

  const conversation = await Conversation.findOne({
    participants: { $all: [userId, recipientId] }
  }).lean();

  res.json({
    success: true,
    messages: conversation ? conversation.messages : []
  });
});

/**
 * @desc    Get all active conversations for Admin
 * @route   GET /api/chat/conversations
 */
export const getAllConversations = asyncHandler(async (req, res) => {
  // 🛡️ শুধুমাত্র সাপোর্ট টাইপের কথোপকথনগুলো দেখাবে
  const rawConversations = await Conversation.find({ type: "support" })
    .populate({
      path: "participants",
      select: "name email avatar role",
      populate: { path: "role" }
    })
    .sort("-updatedAt")
    .lean();

  const conversations = rawConversations.map(conv => {
    // Count unread messages from customers (not from admins)
    const unreadCount = conv.messages.filter(msg => 
      !msg.isRead && 
      conv.participants.find(p => p._id.toString() === msg.sender.toString())?.role?.name === "customer"
    ).length;

    return {
      ...conv,
      unreadCount
    };
  });

  res.json({
    success: true,
    conversations
  });
});

/**
 * @desc    Get messages for a specific conversation
 * @route   GET /api/chat/conversations/:id/messages
 */
export const getConversationMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id)
    .populate({
      path: "messages.sender",
      select: "name avatar role",
      populate: { path: "role" }
    });
  
  if (!conversation) {
    return res.status(404).json({ success: false, message: "Conversation not found" });
  }

  // 📝 মার্ক অ্যাজ রিড: কাস্টমারের মেসেজগুলো পড়া হয়েছে বলে চিহ্নিত করা হবে
  let updated = false;
  conversation.messages.forEach(msg => {
    if (!msg.isRead && msg.sender && msg.sender.role?.name === "customer") {
      msg.isRead = true;
      updated = true;
    }
  });

  if (updated) {
    await conversation.save();
  }

  res.json(conversation.messages);
});

/**
 * @desc    Get customer's own support conversation
 * @route   GET /api/chat/my-conversation
 */
export const getMyConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    participants: req.user._id,
    type: "support",
  })
  .populate({
    path: "messages.sender",
    select: "name avatar role",
    populate: { path: "role" }
  })
  .lean();

  res.json(conversation);
});