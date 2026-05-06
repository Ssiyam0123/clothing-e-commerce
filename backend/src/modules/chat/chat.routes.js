import express from "express";
import { getChatHistory, getAllConversations, getConversationMessages, getMyConversation } from "./chat.controller.js";
import { requireAuth, admin } from "../../middleware/auth.js";

const router = express.Router();

// 🛒 কাস্টমার এবং অ্যাডমিন দুজনেই চ্যাট হিস্টোরি দেখতে পারবে
router.get("/history/:recipientId", requireAuth, getChatHistory);

// 🛡️ শুধুমাত্র অ্যাডমিনরা সব কাস্টমারের চ্যাট লিস্ট দেখতে পারবে
router.get("/conversations", requireAuth, admin, getAllConversations);
router.get("/conversations/:id/messages", requireAuth, admin, getConversationMessages);

// 🛒 কাস্টমার নিজের সাপোর্ট কনভারসেশন দেখতে পারবে
router.get("/my-conversation", requireAuth, getMyConversation);

export default router;