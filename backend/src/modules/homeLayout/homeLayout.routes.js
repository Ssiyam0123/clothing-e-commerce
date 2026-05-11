import express from 'express';
import { 
  getActiveLayout, 
  getAllLayouts, 
  createLayout, 
  updateLayout, 
  switchLayout,
  deleteLayout 
} from './homeLayout.controller.js';
import { protect, admin } from '../../middleware/auth.js';

const router = express.Router();

// Public: Get active layout
router.get('/', getActiveLayout);
router.get('/active', getActiveLayout);

// Admin: Manage architectures
router.get('/all', protect, admin, getAllLayouts);
router.post('/', protect, admin, createLayout);
router.put('/:id', protect, admin, updateLayout);
router.put('/:id/switch', protect, admin, switchLayout);
router.delete('/:id', protect, admin, deleteLayout);

export default router;
