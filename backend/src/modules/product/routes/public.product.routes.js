import express from 'express';
import {
    getPublicProducts,
    getPublicProductBySlug
} from '../controllers/public.product.controller.js';

const router = express.Router();

router.get('/', getPublicProducts);
router.get('/details/:slug', getPublicProductBySlug);

export default router;
