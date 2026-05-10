import express from 'express';
import {
    getPublicProducts,
    getPublicProductBySlug,
    getPublicProductById
} from '../controllers/public.product.controller.js';

const router = express.Router();

router.get('/', getPublicProducts);
router.get('/details/:slug', getPublicProductBySlug);
router.get('/:id', getPublicProductById);

export default router;
