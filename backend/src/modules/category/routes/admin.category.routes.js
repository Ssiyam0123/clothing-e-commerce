import express from 'express';
import {
    createCategory,
    updateCategory,
    deleteCategory,
    getAdminCategories,
    getAdminCategoryById
} from '../controllers/admin.category.controller.js';
import { protect } from '../../../middleware/auth.js';
import { authorize } from '../../../middleware/rbac.js';
import upload from '../../../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(authorize('categories:view'), getAdminCategories)
    .post(authorize('categories:create'), upload.single('image'), createCategory);

router.route('/:id')
    .get(authorize('categories:view'), getAdminCategoryById)
    .put(authorize('categories:update'), upload.single('image'), updateCategory)
    .delete(authorize('categories:delete'), deleteCategory);

export default router;
