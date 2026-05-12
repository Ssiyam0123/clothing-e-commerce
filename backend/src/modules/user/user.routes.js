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
import { protect } from "../../middleware/auth.js";
import { authorize } from "../../middleware/rbac.js";
import upload from "../../middleware/upload.js";

const router = express.Router();

// Authenticated user routes
router.get("/me", protect, getMe);
router.put("/profile", protect, upload.single("avatar"), updateProfile);
router.put("/change-password", protect, changePassword);

// Admin only routes
router.get("/", protect, authorize("users:view"), getAllUsers);
router.get("/:id", protect, authorize("users:view"), getUserById);
router.put("/:id", protect, authorize("users:update"), upload.single("avatar"), updateUser);
router.delete("/:id", protect, authorize("users:delete"), deleteUser);

export default router;