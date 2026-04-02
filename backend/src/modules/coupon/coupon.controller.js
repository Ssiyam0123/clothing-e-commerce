import Coupon from './coupon.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
});

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({});
  res.json(coupons);
});

export const getCouponById = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
  res.json(coupon);
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(coupon);
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ message: 'Coupon deleted' });
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, cartTotal } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
  
  const now = new Date();
  if (coupon.startDate > now) return res.status(400).json({ message: 'Coupon not yet active' });
  if (coupon.endDate && coupon.endDate < now) return res.status(400).json({ message: 'Coupon expired' });
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: 'Coupon usage limit reached' });
  if (cartTotal < coupon.minOrderAmount) return res.status(400).json({ message: `Minimum order amount of ${coupon.minOrderAmount} required` });
  
  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (cartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) discountAmount = coupon.maxDiscount;
  } else {
    discountAmount = coupon.discountValue;
  }
  
  res.json({ 
    valid: true, 
    discountAmount: Math.min(discountAmount, cartTotal),
    coupon 
  });
});