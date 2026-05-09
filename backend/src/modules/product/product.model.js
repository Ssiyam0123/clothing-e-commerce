import mongoose from 'mongoose';
import Cart from '../cart/cart.model.js';
import Wishlist from '../wishlist/wishlist.model.js';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0,
    index: true,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  images: [String],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    index: true,
  },
  sizes: [{
    size: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Size',
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true,
  },
  featuredOrder: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  showReviews: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Text index for search
productSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
}, {
  weights: {
    name: 10,
    description: 5,
    tags: 8,
  },
});

productSchema.index({ category: 1, price: -1 });
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ subcategory: 1, price: -1 });
productSchema.index({ isActive: 1, createdAt: -1 });
productSchema.index({ isFeatured: 1, featuredOrder: 1 });

// Cascade delete: Remove product from all carts and wishlists when deleted
// IMPORTANT: With async/await, DO NOT use the next parameter
productSchema.pre('deleteOne', { document: true, query: false }, async function() {
  await Cart.updateMany({}, { $pull: { items: { product: this._id } } });
  await Wishlist.updateMany({}, { $pull: { products: this._id } });
});

export default mongoose.model('Product', productSchema);