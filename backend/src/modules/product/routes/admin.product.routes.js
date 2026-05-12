import express from 'express';
import {
    createProduct,
    getAdminProducts,
    getAdminProductById,
    getProductHistory,
    updateProduct,
    deleteProduct
} from '../controllers/admin.product.controller.js';
import { protect } from '../../../middleware/auth.js';
import { authorize } from '../../../middleware/rbac.js';
import upload from '../../../middleware/upload.js';

const router = express.Router();

// 🛡️ Base protection for all admin routes
router.use(protect);

router.route('/')
    .get(authorize('products:view'), getAdminProducts)
    .post(authorize('products:create'), upload.array('images', 5), createProduct);

router.route('/:id/history')
    .get(authorize('products:view'), getProductHistory);

router.route('/:id')
    .get(authorize('products:view'), getAdminProductById)
    .put(authorize('products:update'), upload.array('images', 5), updateProduct)
    .delete(authorize('products:delete'), deleteProduct);

export default router;
