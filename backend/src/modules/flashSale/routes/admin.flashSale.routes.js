import express from 'express';
import {
    createFlashSale,
    updateFlashSale,
    getAllFlashSales,
    deleteFlashSale,
    getAdminFlashSaleById
} from '../controllers/admin.flashSale.controller.js';
import { protect } from '../../../middleware/auth.js';
import { authorize } from '../../../middleware/rbac.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(authorize('flash-sales:view'), getAllFlashSales)
    .post(authorize('flash-sales:create'), createFlashSale);

router.route('/:id')
    .get(authorize('flash-sales:view'), getAdminFlashSaleById)
    .put(authorize('flash-sales:update'), updateFlashSale)
    .delete(authorize('flash-sales:delete'), deleteFlashSale);

export default router;
