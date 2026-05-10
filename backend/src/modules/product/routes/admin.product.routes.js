import express from 'express';
import {
    createProduct,
    getAdminProducts,
    getAdminProductById,
    getProductHistory,
    updateProduct,
    deleteProduct
} from '../controllers/admin.product.controller.js';
import { protect, admin } from '../../../middleware/auth.js';
import upload from '../../../middleware/upload.js';

const router = express.Router();

// 🛡️ All routes require Admin privileges
router.use(protect, admin);

router.route('/')
    .get(getAdminProducts)
    .post(upload.array('images', 5), createProduct);

router.route('/:id/history')
    .get(getProductHistory);

router.route('/:id')
    .get(getAdminProductById)
    .put(upload.array('images', 5), updateProduct)
    .delete(deleteProduct);

export default router;
