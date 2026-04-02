import mongoose from 'mongoose';
import Product from '../product/product.model.js';

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true,
  },
  description: String,
  image: String,
}, { timestamps: true });

subcategorySchema.index({ category: 1, name: 1 }, { unique: true });

// Cascade delete: Remove all products in this subcategory
// IMPORTANT: With async/await, DO NOT use the next parameter
subcategorySchema.pre('deleteOne', { document: true, query: false }, async function() {
  await Product.deleteMany({ subcategory: this._id });
});

export default mongoose.model('Subcategory', subcategorySchema);