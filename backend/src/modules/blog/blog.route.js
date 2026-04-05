import express from 'express';
import { 
  createPost, 
  getPosts, 
  getPostBySlug,
  updatePost, 
  deletePost 
} from './blog.controller.js';
import { protect, admin } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

// 📰 Public: List | Admin: Create
router.route('/')
  .get(getPosts)
  .post(protect, admin, upload.single('image'), createPost);

// 📖 Public: Read by Slug
router.route('/:slug')
  .get(getPostBySlug);

// 🛠️ Admin: Update & Delete (Using ID)
router.route('/:id')
  .put(protect, admin, upload.single('image'), updatePost)
  .delete(protect, admin, deletePost);

export default router;