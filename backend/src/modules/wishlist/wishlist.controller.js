import Wishlist from './wishlist.model.js';
import Product from '../product/product.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

// Centralized populate config
const populateConfig = {
  path: 'products',
  select: 'name price discount images slug category sizes',
  populate: { path: 'sizes.size', select: 'name' }
};

// FIX Issue 11: All functions wrapped in asyncHandler for proper error propagation
export const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  let wishlist = await Wishlist.findOne({ user: userId })
    .populate(populateConfig);
  
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }
  
  res.json(wishlist);
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id || req.user._id;
  
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }
  
  // Safe ObjectId comparison using toString()
  const alreadyExists = wishlist.products.some(
    existing => existing.toString() === productId.toString()
  );

  if (!alreadyExists) {
    wishlist.products.push(productId);
    await wishlist.save();
  }
  
  await wishlist.populate(populateConfig);
  res.json(wishlist);
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id || req.user._id;
  
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
  
  wishlist.products = wishlist.products.filter(
    id => id.toString() !== productId
  );
  
  await wishlist.save();
  await wishlist.populate(populateConfig);
  res.json(wishlist);
});

export const clearWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const wishlist = await Wishlist.findOne({ user: userId });
  if (wishlist) {
    wishlist.products = [];
    await wishlist.save();
  }
  res.json({ message: 'Wishlist cleared' });
});

export const bulkAddWishlist = asyncHandler(async (req, res) => {
  const { productIds } = req.body; 
  const userId = req.user.id || req.user._id;

  if (!Array.isArray(productIds)) {
    return res.status(400).json({ message: 'productIds must be an array' });
  }

  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }

  // FIX Bug 3: Use toString() comparison to avoid ObjectId vs String mismatch
  productIds.forEach(id => {
    const alreadyExists = wishlist.products.some(
      existing => existing.toString() === id.toString()
    );
    if (!alreadyExists) {
      wishlist.products.push(id);
    }
  });

  await wishlist.save();
  await wishlist.populate(populateConfig);
  
  res.json(wishlist);
});