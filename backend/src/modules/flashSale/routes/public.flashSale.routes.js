import express from 'express';
import {
    getActiveFlashSales,
    getFlashSaleProducts,
    getPublicFlashSaleBySlug
} from '../controllers/public.flashSale.controller.js';

import { cacheMiddleware } from '../../../middleware/cacheMiddleware.js';

const router = express.Router();

router.get('/active', cacheMiddleware(60), getActiveFlashSales); // Cache for 1 min
router.get('/current', cacheMiddleware(60), getFlashSaleProducts); // Cache for 1 min
router.get('/slug/:slug', cacheMiddleware(300), getPublicFlashSaleBySlug); // Cache for 5 mins

export default router;
