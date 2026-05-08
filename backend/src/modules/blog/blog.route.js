import express from 'express';
import { 
  createPost, 
  getPosts, 
  getPostBySlug,
  getPostById,
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

// 🛠️ Admin: Get, Update & Delete by ID
// Using /admin/:id prefix to avoid collision with /:slug public route
router.route('/admin/:id')
  .get(protect, admin, getPostById)
  .put(protect, admin, upload.single('image'), updatePost)
  .delete(protect, admin, deletePost);

// 📖 Public: Read by Slug (Keep this last)
router.route('/:slug')
  .get(getPostBySlug);

export default router;