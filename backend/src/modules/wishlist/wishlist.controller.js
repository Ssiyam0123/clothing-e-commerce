import Wishlist from './wishlist.model.js';
import Product from '../product/product.model.js';

// Centralized populate config
const populateConfig = {
  path: 'products',
  select: 'name price discount images slug category sizes',
  populate: { path: 'sizes.size', select: 'name' }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    let wishlist = await Wishlist.findOne({ user: userId })
      .populate(populateConfig);
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }
    
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id || req.user._id;
    
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }
    
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
    
    await wishlist.populate(populateConfig);
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const wishlist = await Wishlist.findOne({ user: userId });
    if (wishlist) {
      wishlist.products = [];
      await wishlist.save();
    }
    res.json({ message: 'Wishlist cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const bulkAddWishlist = async (req, res) => {
  try {
    const { productIds } = req.body; 
    const userId = req.user.id || req.user._id;

    if (!Array.isArray(productIds)) {
      return res.status(400).json({ message: 'productIds must be an array' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    productIds.forEach(id => {
      if (!wishlist.products.includes(id)) {
        wishlist.products.push(id);
      }
    });

    await wishlist.save();
    await wishlist.populate(populateConfig);
    
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};