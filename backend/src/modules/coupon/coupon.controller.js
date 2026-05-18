import Coupon from './coupon.model.js';
import Order from '../order/order.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { clearCache } from '../../middleware/cacheMiddleware.js';

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  clearCache('cache:/api/admin/dashboard*');
  res.status(201).json(coupon);
});

export const getCoupons = asyncHandler(async (req, res) => {
  const { page = 1, limit = 30, search = '' } = req.query;
  const filter = {};
  if (search) {
    filter.code = { $regex: search, $options: 'i' };
  }
  const total = await Coupon.countDocuments(filter);
  const coupons = await Coupon.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
    
  res.json({
    coupons,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit)
  });
});

export const getCouponById = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
  
  // 🔍 Forensic Audit: Retrieve orders that used this coupon code (paginated)
  const filter = { couponCode: coupon.code };
  const total = await Order.countDocuments(filter);
  
  const usageHistory = await Order.find(filter)
    .populate('user', 'name email avatar')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  // 🔍 Strategic Intelligence: Calculate unique products impacted
  const uniqueProductsImpacted = await Order.distinct('orderItems.product', { couponCode: coupon.code });

  res.json({
    ...coupon.toObject(),
    usageHistory,
    uniqueProductsCount: uniqueProductsImpacted.length,
    usagePagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit)
    }
  });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  clearCache('cache:/api/admin/dashboard*');
  res.json(coupon);
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  clearCache('cache:/api/admin/dashboard*');
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