import express from 'express';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from './review.controller.js';
import { protect, admin, extractUser } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

// IMPORTANT: Use extractUser for public routes that need to identify logged-in users
router.get('/product/:productId', extractUser, getProductReviews);

// Protected routes (require login)
router.use(protect);

router.post('/', upload.array('images', 5), createReview);
router.put('/:reviewId', upload.array('images', 5), updateReview);
router.delete('/:reviewId', deleteReview);

// Admin routes - can be added back if controller logic is implemented
// router.get('/all', protect, admin, getAllReviews);
// router.delete('/admin/:reviewId', protect, admin, adminDeleteReview);

export default router;