import express from 'express';
import {
  createSize,
  getSizes,
  getSizeById,
  updateSize,
  deleteSize,
} from './size.controller.js';
import { protect, admin } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createSizeSchema, updateSizeSchema } from './validators/size.validator.js';

const router = express.Router();

router.route('/')
  .get(getSizes)
  .post(protect, admin, validate(createSizeSchema), createSize);

router.route('/:id')
  .get(getSizeById)
  .put(protect, admin, validate(updateSizeSchema), updateSize)
  .delete(protect, admin, deleteSize);

export default router;