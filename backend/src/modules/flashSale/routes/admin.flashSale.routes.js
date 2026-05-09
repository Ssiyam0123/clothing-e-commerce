import express from 'express';
import {
    createFlashSale,
    updateFlashSale,
    getAllFlashSales,
    deleteFlashSale,
    getAdminFlashSaleById
} from '../controllers/admin.flashSale.controller.js';
import { protect, admin } from '../../../middleware/auth.js';

const router = express.Router();

router.use(protect, admin);

router.route('/')
    .get(getAllFlashSales)
    .post(createFlashSale);

router.route('/:id')
    .get(getAdminFlashSaleById)
    .put(updateFlashSale)
    .delete(deleteFlashSale);

export default router;
