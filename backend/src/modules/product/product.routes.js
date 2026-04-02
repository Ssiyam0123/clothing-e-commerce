import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from './product.controller.js';
import { requireAuth, admin } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(requireAuth, admin, upload.array('images', 5), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(requireAuth, admin, upload.array('images', 5), updateProduct)
  .delete(requireAuth, admin, deleteProduct);

export default router;