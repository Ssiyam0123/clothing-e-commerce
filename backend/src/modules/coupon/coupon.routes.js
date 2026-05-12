import express from 'express';
import { createCoupon, getCoupons, getCouponById, updateCoupon, deleteCoupon, validateCoupon } from './coupon.controller.js';
import { protect } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';

const router = express.Router();

router.post('/validate', validateCoupon); // public

// Admin routes
router.route('/')
  .get(protect, authorize('coupons:view'), getCoupons)
  .post(protect, authorize('coupons:create'), createCoupon);

router.route('/:id')
  .get(protect, authorize('coupons:view'), getCouponById)
  .put(protect, authorize('coupons:update'), updateCoupon)
  .delete(protect, authorize('coupons:delete'), deleteCoupon);

export default router;