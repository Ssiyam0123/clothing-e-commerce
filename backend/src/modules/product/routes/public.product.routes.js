import express from 'express';
import {
    getPublicProducts,
    getPublicProductBySlug,
    getPublicProductById
} from '../controllers/public.product.controller.js';

import { cacheMiddleware } from '../../../middleware/cacheMiddleware.js';

const router = express.Router();

router.get('/', cacheMiddleware(120), getPublicProducts); // Cache list for 2 mins
router.get('/details/:slug', cacheMiddleware(300), getPublicProductBySlug); // Cache details for 5 mins
router.get('/:id', cacheMiddleware(300), getPublicProductById);

export default router;
