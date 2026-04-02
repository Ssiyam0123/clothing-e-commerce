import mongoose from 'mongoose';
import Product from '../product/product.model.js';
import Subcategory from '../subcategory/subcategory.model.js';
import Size from '../size/size.model.js';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: String,
  image: String,
}, { timestamps: true });

// Cascade delete: Remove all related subcategories, sizes, and products
// IMPORTANT: With async/await, DO NOT use the next parameter
categorySchema.pre('deleteOne', { document: true, query: false }, async function() {
  // Delete all subcategories in this category
  await Subcategory.deleteMany({ category: this._id });
  
  // Delete all sizes in this category
  await Size.deleteMany({ category: this._id });
  
  // Delete all products in this category (they will trigger their own cascade)
  await Product.deleteMany({ category: this._id });
});

export default mongoose.model('Category', categorySchema);