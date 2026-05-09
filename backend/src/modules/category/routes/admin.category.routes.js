import express from 'express';
import {
    createCategory,
    updateCategory,
    deleteCategory,
    getAdminCategories,
    getAdminCategoryById
} from '../controllers/admin.category.controller.js';
import { protect, admin } from '../../../middleware/auth.js';
import upload from '../../../middleware/upload.js';

const router = express.Router();

router.use(protect, admin);

router.route('/')
    .get(getAdminCategories)
    .post(upload.single('image'), createCategory);

router.route('/:id')
    .get(getAdminCategoryById)
    .put(upload.single('image'), updateCategory)
    .delete(deleteCategory);

export default router;
