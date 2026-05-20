import express from "express";
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  googleLogin,
  facebookLogin,
} from "./auth.controller.js";
import { protect } from "../../middleware/auth.js";
import { loginLimiter, registerLimiter } from "../../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/google-login", loginLimiter, googleLogin);
router.post("/facebook-login", loginLimiter, facebookLogin);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", loginLimiter, forgotPassword);
router.post("/reset-password", loginLimiter, resetPassword);
router.get("/me", protect, getMe);

export default router;