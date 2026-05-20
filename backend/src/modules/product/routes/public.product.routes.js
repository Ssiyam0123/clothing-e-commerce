import express from 'express';
import {
    getPublicProducts,
    getPublicProductBySlug,
    getPublicProductById
} from '../controllers/public.product.controller.js';

import { cacheMiddleware } from '../../../middleware/cacheMiddleware.js';

const router = express.Router();

router.get('/', cacheMiddleware(300), getPublicProducts);         // Cache list for 5 mins
router.get('/details/:slug', cacheMiddleware(900), getPublicProductBySlug); // Cache details for 15 mins
router.get('/:id', cacheMiddleware(900), getPublicProductById);   // Cache by ID for 15 mins

export default router;
