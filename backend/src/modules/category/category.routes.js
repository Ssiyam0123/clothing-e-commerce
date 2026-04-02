import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from './category.controller.js';
import { protect, admin } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';
import { validate } from '../../middleware/validate.js';
import { createCategorySchema, updateCategorySchema } from './validators/category.validator.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, admin, upload.single('image'), validate(createCategorySchema), createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(protect, admin, upload.single('image'), validate(updateCategorySchema), updateCategory)
  .delete(protect, admin, deleteCategory);

export default router;