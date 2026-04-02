import mongoose from 'mongoose';
import Product from '../product/product.model.js';
import Cart from '../cart/cart.model.js';

const sizeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true,
  },
}, { timestamps: true });

// Ensure size name is unique per category
sizeSchema.index({ category: 1, name: 1 }, { unique: true });

// Cascade delete: Remove this size from all products and carts
// IMPORTANT: With async/await, DO NOT use the next parameter
sizeSchema.pre('deleteOne', { document: true, query: false }, async function() {
  // Remove size from all products
  await Product.updateMany(
    {},
    { $pull: { sizes: { size: this._id } } }
  );
  
  // Remove size from all carts
  await Cart.updateMany(
    {},
    { $pull: { items: { size: this._id } } }
  );
});

export default mongoose.model('Size', sizeSchema);