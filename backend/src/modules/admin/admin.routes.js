// src/modules/admin/admin.routes.js
import express from 'express';
import { getDashboardData } from './admin.controller.js';
import { protect, admin } from '../../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect, admin);

router.get('/dashboard', getDashboardData);

export default router;
