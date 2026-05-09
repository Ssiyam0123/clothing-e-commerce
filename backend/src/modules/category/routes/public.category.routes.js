import express from 'express';
import {
    getPublicCategories,
    getPublicCategoryBySlug
} from '../controllers/public.category.controller.js';

const router = express.Router();

router.get('/', getPublicCategories);
router.get('/:slug', getPublicCategoryBySlug);

export default router;
