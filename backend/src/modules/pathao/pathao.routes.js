import express from 'express';
import { getCities, getZones, getAreas, getStores } from './pathao.controller.js';
import { protect, admin } from '../../middleware/auth.js';

const router = express.Router();

// Store list fetch korar jonno route
router.get('/stores', protect, admin, getStores);

router.get('/cities', getCities);
router.get('/zones/:cityId', getZones);
router.get('/areas/:zoneId', getAreas);

export default router;