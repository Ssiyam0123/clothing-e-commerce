import { asyncHandler } from '../../middleware/asyncHandler.js';
import { uploadImage, deleteImage } from '../../services/imageUploadService.js';
import mongoose from 'mongoose';

// src/modules/user/user.controller.js
export const updateProfile = asyncHandler(async (req, res) => {
    const db = mongoose.connection.db;
    const userId = req.user.id || req.user._id; 
    
    // 🌟 গুগলের 'image' অথবা আমাদের 'avatar' যেটা থাকে সেটা নিবো
    let newImageUrl = req.user.avatar || req.user.image;

    if (req.file) {
        newImageUrl = await uploadImage(req.file, 'users', newImageUrl);
    }

    const updateData = {
        name: req.body.name || req.user.name,
        phone: req.body.phone !== undefined ? req.body.phone : req.user.phone,
        bio: req.body.bio !== undefined ? req.body.bio : req.user.bio,
        image: newImageUrl,   // 👈 Better Auth-কে খুশি রাখার জন্য
        avatar: newImageUrl,  // 👈 আমাদের কাস্টম লজিক ঠিক রাখার জন্য
        updatedAt: new Date()
    };

    await db.collection('user').updateOne(
        { id: userId },
        { $set: updateData }
    );

    res.json({ message: 'Identity synchronized.', user: { ...req.user, ...updateData } });
});








export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' });
  }

  const avatarUrl = await uploadImage(req.file, 'users');
  res.json({ url: avatarUrl });
});





export const getUsers = asyncHandler(async (req, res) => {
    const db = mongoose.connection.db;
    // পাসওয়ার্ড বা সেনসিটিভ ডেটা ফিল্টার আউট করা ভালো, তবে Better Auth ডিফল্টভাবে পাসওয়ার্ড হ্যাশ আলাদা টেবিলে রাখে (accounts)
    const users = await db.collection('users').find({}).sort({ createdAt: -1 }).toArray();
    res.json(users);
});

export const getUserById = asyncHandler(async (req, res) => {
    const db = mongoose.connection.db;
    const { id } = req.params;
    
    const user = await db.collection('users').findOne({ id: id });
    
    if (!user) {
        return res.status(404).json({ message: 'User identity not found in databanks.' });
    }
    
    res.json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
    const db = mongoose.connection.db;
    const { id } = req.params;

    const existingUser = await db.collection('users').findOne({ id: id });
    if (!existingUser) {
        return res.status(404).json({ message: 'User not found.' });
    }

    let avatarUrl = existingUser.avatar;
    if (req.file) {
        avatarUrl = await uploadImage(req.file, 'users', existingUser.avatar);
    }

    const updateData = {
        name: req.body.name || existingUser.name,
        email: req.body.email || existingUser.email,
        role: req.body.role || existingUser.role,
        phone: req.body.phone !== undefined ? req.body.phone : existingUser.phone,
        bio: req.body.bio !== undefined ? req.body.bio : existingUser.bio,
        avatar: avatarUrl,
        updatedAt: new Date()
    };

    await db.collection('users').updateOne(
        { id: id },
        { $set: updateData }
    );

    res.json({ ...existingUser, ...updateData });
});

export const deleteUser = asyncHandler(async (req, res) => {
    const db = mongoose.connection.db;
    const { id } = req.params;
    
    const user = await db.collection('users').findOne({ id: id });
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    // ছবি থাকলে ডিলিট করো
    if (user.avatar) {
        await deleteImage(user.avatar);
    }
    
    // Better Auth এর অন্যান্য টেবিল থেকেও ডেটা সরানো
    await db.collection('users').deleteOne({ id: id });
    await db.collection('sessions').deleteMany({ userId: id });
    await db.collection('accounts').deleteMany({ userId: id });
    
    res.json({ message: 'User purged from system.' });
});