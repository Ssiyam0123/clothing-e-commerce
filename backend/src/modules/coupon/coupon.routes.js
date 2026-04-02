import express from 'express';
import { createCoupon, getCoupons, getCouponById, updateCoupon, deleteCoupon, validateCoupon } from './coupon.controller.js';
import { protect, admin } from '../../middleware/auth.js';

const router = express.Router();

router.post('/validate', validateCoupon); // public
router.use(protect, admin);
router.post('/', createCoupon);
router.get('/', getCoupons);
router.get('/:id', getCouponById);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router;