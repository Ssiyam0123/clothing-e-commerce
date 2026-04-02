import mongoose from 'mongoose';

const flashSaleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sale name is required'],
    trim: true,
  },
  description: String,
  discount: {
    type: Number,
    required: [true, 'Discount is required'],
    min: 1,
    max: 90,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  }],
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  bannerImage: String,
  // NEW: if true, startDate will be set to now on creation/update
  startImmediately: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Validation
flashSaleSchema.pre('save', function() {
  if (this.startDate >= this.endDate) {
    throw new Error('End date must be strictly after start date');
  }
});

flashSaleSchema.index({ startDate: 1, endDate: 1, isActive: 1 });

export default mongoose.model('FlashSale', flashSaleSchema);