import User from "./user.model.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { uploadImage, deleteImage } from "../../services/imageUploadService.js";
import { clearCache } from "../../middleware/cacheMiddleware.js";

// @desc    Get current logged-in user
// @route   GET /api/users/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  // req.user is attached by protect middleware
  const user = await User.findById(req.user._id).select("-password").populate("role");
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

  if (req.body.addresses) {
    try {
      user.addresses = typeof req.body.addresses === 'string' ? JSON.parse(req.body.addresses) : req.body.addresses;
    } catch (e) {
      user.addresses = req.body.addresses;
    }
  }

  await user.save();
  clearCache('cache:/api/admin/dashboard*');

  const updatedUser = await User.findById(user._id).populate("role");

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    bio: updatedUser.bio,
    avatar: updatedUser.avatar,
    role: updatedUser.role,
    addresses: updatedUser.addresses,
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
  const { search, sort, page = 1, limit = 30 } = req.query;
  
  const query = {};
  
  // 🛰️ Search Logic (Name or Email)
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  // 🏛️ Sorting Logic
  // Default to newest first
  const sortOrder = sort ? sort.split(",").join(" ") : "-createdAt";

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select("-password")
    .populate("role")
    .sort(sortOrder)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .allowDiskUse();


  res.json({
    users,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit))
  });
});

// @desc    Get single user by ID (admin)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").populate("role");
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
  if (req.body.isActive !== undefined) {
    user.isActive = req.body.isActive === "true" || req.body.isActive === true;
  }

  if (req.body.addresses) {
    try {
      user.addresses = typeof req.body.addresses === 'string' ? JSON.parse(req.body.addresses) : req.body.addresses;
    } catch (e) {
      user.addresses = req.body.addresses;
    }
  }

  // Handle avatar upload if provided
  if (req.file) {
    user.avatar = await uploadImage(req.file, "avatars", user.avatar);
  }

  await user.save();
  clearCache('cache:/api/admin/dashboard*');

  const updatedUser = await User.findById(user._id).populate("role");

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    phone: updatedUser.phone,
    bio: updatedUser.bio,
    avatar: updatedUser.avatar,
    addresses: updatedUser.addresses,
    isActive: updatedUser.isActive,
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
  clearCache('cache:/api/admin/dashboard*');
  res.json({ message: "User removed successfully" });
});