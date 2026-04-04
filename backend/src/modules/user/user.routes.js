import express from "express";
import {
  getMe,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./user.controller.js";
import { protect, admin } from "../../middleware/auth.js";
import upload from "../../middleware/upload.js";

const router = express.Router();

// Authenticated user routes
router.get("/me", protect, getMe);
router.put("/profile", protect, upload.single("avatar"), updateProfile);
router.put("/change-password", protect, changePassword);

// Admin only routes
router.get("/", protect, admin, getAllUsers);
router.get("/:id", protect, admin, getUserById);
router.put("/:id", protect, admin, upload.single("avatar"), updateUser);
router.delete("/:id", protect, admin, deleteUser);

export default router;