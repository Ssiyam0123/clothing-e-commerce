// src/modules/admin/admin.routes.js
import express from 'express';
import { 
  getDashboardData, 
  getAdminCounts,
  getDashboardStats,
  getDashboardRecentOrders,
  getDashboardInventoryAlerts,
  getDashboardRevenueTrend,
  getDashboardCategoryStats,
  getDashboardCustomerGrowth,
  getDashboardRetention
} from './admin.controller.js';
import { handleAdminAiChat } from './ai-chat.controller.js';
import { protect } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { cacheMiddleware } from '../../middleware/cacheMiddleware.js';

import adminProductRoutes from '../product/routes/admin.product.routes.js';
import adminCategoryRoutes from '../category/routes/admin.category.routes.js';
import adminFlashSaleRoutes from '../flashSale/routes/admin.flashSale.routes.js';
import adminOrderRoutes from '../order/routes/admin.order.routes.js';

const router = express.Router();


// Base protection for admin entry points
router.use(protect);

router.post('/ai-chat', authorize(['dashboard:view']), handleAdminAiChat);


router.get('/dashboard', authorize(['dashboard:view', 'reports:view']), cacheMiddleware(300), getDashboardData);
router.get('/dashboard/stats', authorize(['dashboard:view', 'reports:view']), cacheMiddleware(300), getDashboardStats);
router.get('/dashboard/recent-orders', authorize(['dashboard:view', 'reports:view']), cacheMiddleware(300), getDashboardRecentOrders);
router.get('/dashboard/inventory-alerts', authorize(['dashboard:view', 'reports:view']), cacheMiddleware(300), getDashboardInventoryAlerts);
router.get('/dashboard/revenue-trend', authorize(['dashboard:view', 'reports:view']), cacheMiddleware(300), getDashboardRevenueTrend);
router.get('/dashboard/category-stats', authorize(['dashboard:view', 'reports:view']), cacheMiddleware(300), getDashboardCategoryStats);
router.get('/dashboard/customer-growth', authorize(['dashboard:view', 'reports:view']), cacheMiddleware(300), getDashboardCustomerGrowth);
router.get('/dashboard/retention', authorize(['dashboard:view', 'reports:view']), cacheMiddleware(300), getDashboardRetention);
router.get('/counts', getAdminCounts);

// 📦 Integrated Admin Modules
router.use('/products', adminProductRoutes);
router.use('/categories', adminCategoryRoutes);
router.use('/flash-sales', adminFlashSaleRoutes);
router.use('/orders', adminOrderRoutes);

export default router;
