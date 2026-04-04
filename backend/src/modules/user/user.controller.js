import User from "./user.model.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { uploadImage, deleteImage } from "../../services/imageUploadService.js";

// @desc    Get current logged-in user
// @route   GET /api/users/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  // req.user is attached by protect middleware
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

// @desc    Update user profile (name, phone, bio, avatar)
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Handle avatar upload if file provided
  let avatarUrl = user.avatar;
  if (req.file) {
    avatarUrl = await uploadImage(req.file, "avatars", user.avatar);
  }

  // Update fields
  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.bio = req.body.bio || user.bio;
  user.avatar = avatarUrl;

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    bio: user.bio,
    avatar: user.avatar,
    role: user.role,
  });
});

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both current and new password are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters" });
  }

  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password updated successfully" });
});

// ==================== ADMIN ONLY ====================

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

// @desc    Get single user by ID (admin)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

// @desc    Update user (admin) – can change role, name, email, etc.
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Only allow specific fields to be updated by admin
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  user.phone = req.body.phone || user.phone;
  user.bio = req.body.bio || user.bio;

  // Handle avatar upload if provided
  if (req.file) {
    user.avatar = await uploadImage(req.file, "avatars", user.avatar);
  }

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    bio: user.bio,
    avatar: user.avatar,
  });
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: "You cannot delete your own account" });
  }

  // Delete avatar from storage if exists
  if (user.avatar) {
    await deleteImage(user.avatar);
  }

  await user.deleteOne();
  res.json({ message: "User removed successfully" });
});