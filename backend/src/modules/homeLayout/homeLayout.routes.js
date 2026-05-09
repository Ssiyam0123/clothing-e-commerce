import express from 'express';
import { 
  getActiveLayout, 
  updateLayout, 
  getAllLayouts, 
  createNewVersion 
} from './homeLayout.controller.js';
import { protect, admin } from '../../middleware/auth.js';

const router = express.Router();

// Public route for storefront
router.get('/active', getActiveLayout);

// Admin routes
router.route('/')
  .get(protect, admin, getAllLayouts)
  .put(protect, admin, updateLayout)
  .post(protect, admin, createNewVersion);

export default router;
