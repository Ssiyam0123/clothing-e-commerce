import User from "../user/user.model.js";
import Role from "../role/role.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail, sendPasswordResetEmail } from "../../services/email.service.js";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import ApiKey from "../settings/apiKey.model.js";
import { decrypt } from "../../utils/encryption.js";
import { clearCache } from "../../middleware/cacheMiddleware.js";

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

    clearCache('cache:/api/admin/dashboard*');

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

    if (user.isActive === false) {
      return res.status(403).json({ message: "Your account has been deactivated/blocked by admin" });
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

// Google Login Verification
export const googleLogin = async (req, res) => {
  const { idToken, accessToken } = req.body;

  if (!idToken && !accessToken) {
    return res.status(400).json({ message: "Google ID Token or Access Token is required" });
  }

  try {
    let googleId, email, name, picture;
    let googleClientId = process.env.GOOGLE_CLIENT_ID;

    // Retrieve and decrypt googleClientId from ApiKey settings collection
    try {
      const apiKeys = await ApiKey.findOne();
      if (apiKeys && apiKeys.googleClientId) {
        googleClientId = decrypt(apiKeys.googleClientId);
      }
    } catch (dbErr) {
      console.error("Failed to fetch googleClientId from database:", dbErr.message);
    }

    // Determine if the token is a JWT ID Token or an Access Token
    // A JWT consists of three base64url-encoded parts separated by dots
    const isJWT = typeof idToken === "string" && idToken.split(".").length === 3;

    if (idToken && isJWT) {
      if (!googleClientId) {
        return res.status(400).json({ message: "Google client ID is not configured on the server." });
      }
      const client = new OAuth2Client(googleClientId);
      const ticket = await client.verifyIdToken({
        idToken,
        audience: googleClientId,
      });

      const payload = ticket.getPayload();
      googleId = payload.sub;
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    } else {
      // Treat as access token (either from accessToken field or misnamed idToken field)
      const tokenToUse = accessToken || idToken;
      if (!tokenToUse) {
        return res.status(400).json({ message: "Google ID Token or Access Token is required" });
      }
      // Validate using Google UserInfo API using the access token
      const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenToUse}` },
      });
      googleId = response.data.sub;
      email = response.data.email;
      name = response.data.name;
      picture = response.data.picture;
    }

    if (!email) {
      return res.status(400).json({ message: "Google account does not provide an email" });
    }

    // Assign default "customer" role
    const customerRole = await Role.findOne({ name: "customer" });

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() }).populate("role");

    if (user) {
      if (user.isActive === false) {
        return res.status(403).json({ message: "Your account has been deactivated/blocked by admin" });
      }
      // Merge/update google information if missing
      user.googleId = googleId;
      user.provider = "google";
      user.isEmailVerified = true;
      if (!user.avatar) user.avatar = picture || "";
      await user.save();
    } else {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        avatar: picture || "",
        isEmailVerified: true,
        provider: "google",
        googleId,
        role: customerRole ? customerRole._id : null,
      });
      // Clear caches
      clearCache('cache:/api/admin/dashboard*');
      // Populate role after creation
      user = await User.findById(user._id).populate("role");
    }

    const token = generateToken(user._id);

    res.json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google login verification error:", error);
    res.status(400).json({ message: "Invalid Google ID Token or Access Token" });
  }
};

// Facebook Login Verification
export const facebookLogin = async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ message: "Facebook Access Token is required" });
  }

  try {
    // Call Facebook Graph API to verify the token and get user details
    const fbResponse = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`
    );

    const { id: facebookId, name, email, picture } = fbResponse.data;

    // Facebook accounts might not return email in rare cases (e.g. registered with phone only)
    const userEmail = email ? email.toLowerCase() : `${facebookId}@facebook.com`;

    // Assign default "customer" role
    const customerRole = await Role.findOne({ name: "customer" });

    // Find or create user
    let user = await User.findOne({ 
      $or: [
        { email: userEmail },
        { facebookId: facebookId }
      ]
    }).populate("role");

    const avatarUrl = picture?.data?.url || "";

    if (user) {
      if (user.isActive === false) {
        return res.status(403).json({ message: "Your account has been deactivated/blocked by admin" });
      }
      // Merge/update facebook information
      user.facebookId = facebookId;
      user.provider = "facebook";
      user.isEmailVerified = true;
      if (!user.avatar) user.avatar = avatarUrl;
      await user.save();
    } else {
      user = await User.create({
        name,
        email: userEmail,
        avatar: avatarUrl,
        isEmailVerified: true,
        provider: "facebook",
        facebookId,
        role: customerRole ? customerRole._id : null,
      });
      // Clear caches
      clearCache('cache:/api/admin/dashboard*');
      // Populate role
      user = await User.findById(user._id).populate("role");
    }

    const token = generateToken(user._id);

    res.json({
      message: "Facebook login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Facebook login verification error:", error);
    res.status(400).json({ message: "Invalid Facebook Access Token" });
  }
};