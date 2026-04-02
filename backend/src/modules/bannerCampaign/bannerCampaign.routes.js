import express from 'express';
import {
  getActiveCampaign,
  getAllCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  toggleActive,
} from './bannerCampaign.controller.js';
import { protect, admin } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

router.get('/active', getActiveCampaign);

router.use(protect, admin);
router.get('/', getAllCampaigns);
router.post('/', upload.array('slideImages', 20), createCampaign);
router.put('/:id', upload.array('slideImages', 20), updateCampaign);
router.delete('/:id', deleteCampaign);
router.patch('/:id/toggle', toggleActive);

export default router;