// src/modules/admin/admin.routes.js
import express from 'express';
import { getDashboardData } from './admin.controller.js';
import { protect, admin } from '../../middleware/auth.js';

import adminProductRoutes from '../product/routes/admin.product.routes.js';
import adminCategoryRoutes from '../category/routes/admin.category.routes.js';
import adminFlashSaleRoutes from '../flashSale/routes/admin.flashSale.routes.js';
import adminOrderRoutes from '../order/routes/admin.order.routes.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect, admin);

router.get('/dashboard', getDashboardData);

// 📦 Integrated Admin Modules
router.use('/products', adminProductRoutes);
router.use('/categories', adminCategoryRoutes);
router.use('/flash-sales', adminFlashSaleRoutes);
router.use('/orders', adminOrderRoutes);

export default router;
