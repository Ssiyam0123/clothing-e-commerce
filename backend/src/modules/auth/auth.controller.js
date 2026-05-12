import User from "../user/user.model.js";
import Role from "../role/role.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail, sendPasswordResetEmail } from "../../services/email.service.js";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register (SMTP optional – auto‑verify if email fails or not configured)
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Assign default "customer" role
    const customerRole = await Role.findOne({ name: "customer" });

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: customerRole ? customerRole._id : null,
      emailVerificationToken: verificationToken,
      isEmailVerified: false, 
    });

    // Try to send verification email, but don't block registration
    let emailSent = false;
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      await sendVerificationEmail(user.email, verificationUrl);
      emailSent = true;
    } catch (emailError) {
      console.error("Email sending failed (optional SMTP):", emailError.message);
      if (!process.env.SMTP_HOST) {
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        await user.save();
        console.log("🔓 Auto‑verified user (SMTP not configured)");
      }
    }

    const token = generateToken(user._id);

    res.status(201).json({
      message: emailSent
        ? "Registration successful! Please check your email to verify your account."
        : "Registration successful! (Email verification skipped)",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: customerRole, // Send back the role object
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login (no session dependency)
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() })
      .select("+password")
      .populate("role");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isEmailVerified && process.env.SMTP_HOST) {
      return res.status(401).json({ message: "Please verify your email before logging in" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role, // Contains permissions now
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Verify Email
export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=invalid_token`);
  }

  try {
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=invalid_token`);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (error) {
    console.error("Email verification error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=verification_failed`);
  }
};

// Forgot Password (SMTP optional – log reset link if email fails)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    let emailSent = false;
    try {
      await sendPasswordResetEmail(user.email, resetUrl);
      emailSent = true;
    } catch (emailError) {
      console.error("Password reset email failed (optional SMTP):", emailError.message);
      if (!process.env.SMTP_HOST) {
        console.log(`🔐 Password reset link (dev): ${resetUrl}`);
      }
    }

    res.json({
      message: emailSent
        ? "Password reset link sent to your email"
        : "Password reset link generated (SMTP not configured). Check server console for the link.",
      ...(!emailSent && !process.env.SMTP_HOST && { devResetUrl: resetUrl }), 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful. Please login." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Current User (JWT)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate("role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};