import express from 'express';
import {
  getActiveCampaign,
  getPublicCampaignById,
  getAllCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from './bannerCampaign.controller.js';
import { protect } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import upload from '../../middleware/upload.js';

import { cacheMiddleware } from '../../middleware/cacheMiddleware.js';

const router = express.Router();

router.get('/active', cacheMiddleware(600), getActiveCampaign);
router.get('/:id/public', cacheMiddleware(600), getPublicCampaignById);

// Admin routes
router.route('/')
  .get(protect, authorize('banner-campaigns:view'), getAllCampaigns)
  .post(protect, authorize('banner-campaigns:create'), upload.array('slideImages', 20), createCampaign);

router.route('/:id')
  .put(protect, authorize('banner-campaigns:update'), upload.array('slideImages', 20), updateCampaign)
  .delete(protect, authorize('banner-campaigns:delete'), deleteCampaign);

export default router;