import express from "express";
import { getChatHistory, getAllConversations, getConversationMessages, getMyConversation, searchUsers, startConversation } from "./chat.controller.js";
import { requireAuth, admin } from "../../middleware/auth.js";
import upload from "../../middleware/upload.js";
import { uploadImage } from "../../services/imageUploadService.js";

const router = express.Router();

// 🛒 কাস্টমার এবং অ্যাডমিন দুজনেই চ্যাট হিস্টোরি দেখতে পারবে
router.get("/history/:recipientId", requireAuth, getChatHistory);

// 🛡️ শুধুমাত্র অ্যাডমিনরা সব কাস্টমারের চ্যাট লিস্ট দেখতে পারবে
router.get("/conversations", requireAuth, admin, getAllConversations);
router.get("/conversations/:id/messages", requireAuth, admin, getConversationMessages);
router.post("/conversations/start", requireAuth, admin, startConversation);
router.get("/search-users", requireAuth, admin, searchUsers);

// 🛡️ কাস্টমার এবং অ্যাডমিনরা চ্যাটে ইমেজ আপলোড করতে পারবে
router.post("/upload", requireAuth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file provided" });
    const imageUrl = await uploadImage(req.file, "chat");
    res.json({ success: true, url: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
});

// 🛒 কাস্টমার নিজের সাপোর্ট কনভারসেশন দেখতে পারবে
router.get("/my-conversation", requireAuth, getMyConversation);

export default router;