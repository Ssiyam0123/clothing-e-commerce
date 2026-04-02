import express from 'express';
import {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from './banner.controller.js';
import { protect, admin } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

// Public
router.get('/active', getActiveBanners);

// Admin
router.use(protect, admin);
router.route('/')
  .get(getAllBanners)
  .post(upload.single('image'), createBanner); // <-- added upload
router.route('/:id')
  .put(upload.single('image'), updateBanner) // <-- added upload
  .delete(deleteBanner);

export default router;