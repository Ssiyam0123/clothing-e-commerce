// src/modules/blog/blog-image.route.js
import express from 'express';
import upload from '../../middleware/upload.js';
import { protect, admin } from '../../middleware/auth.js';
import { uploadImage } from '../../services/imageUploadService.js';

const router = express.Router();

router.post('/upload/blog-image', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    const imageUrl = await uploadImage(req.file, 'blogs');
    res.json({ url: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

export default router;