import express from 'express';
import { 
  getActiveLayout, 
  getAllLayouts, 
  createLayout, 
  updateLayout, 
  switchLayout,
  deleteLayout 
} from './homeLayout.controller.js';
import { protect } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';

import { cacheMiddleware } from '../../middleware/cacheMiddleware.js';

const router = express.Router();

// Public: Get active layout (Cached for 30 mins)
router.get('/', cacheMiddleware(1800), getActiveLayout);
router.get('/active', cacheMiddleware(1800), getActiveLayout);

// Admin: Manage architectures
router.get('/all', protect, authorize('homeLayout:view'), getAllLayouts);
router.post('/', protect, authorize('homeLayout:create'), createLayout);
router.put('/:id', protect, authorize('homeLayout:update'), updateLayout);
router.put('/:id/switch', protect, authorize('homeLayout:update'), switchLayout);
router.delete('/:id', protect, authorize('homeLayout:delete'), deleteLayout);

export default router;
