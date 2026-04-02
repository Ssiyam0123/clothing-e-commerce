import express from 'express';
import {
  createSubcategory,
  getSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
} from './subcategory.controller.js';
import { protect, admin } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';
import { validate } from '../../middleware/validate.js';
import { createSubcategorySchema, updateSubcategorySchema } from './validators/subcategory.validator.js';

const router = express.Router();

router.route('/')
  .get(getSubcategories)
  .post(protect, admin, upload.single('image'), validate(createSubcategorySchema), createSubcategory);

router.route('/:id')
  .get(getSubcategoryById)
  .put(protect, admin, upload.single('image'), validate(updateSubcategorySchema), updateSubcategory)
  .delete(protect, admin, deleteSubcategory);

export default router;