import express from 'express';
import {
    getActiveFlashSales,
    getFlashSaleProducts,
    getPublicFlashSaleBySlug
} from '../controllers/public.flashSale.controller.js';

const router = express.Router();

router.get('/active', getActiveFlashSales);
router.get('/current', getFlashSaleProducts);
router.get('/slug/:slug', getPublicFlashSaleBySlug);

export default router;
