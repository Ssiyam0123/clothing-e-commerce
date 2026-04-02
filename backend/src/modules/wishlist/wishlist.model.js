import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  // 🌟 FIXED: ObjectId এবং ref: 'User' মুছে String করা হয়েছে
  user: {
    type: String,
    required: true,
    unique: true,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
}, { timestamps: true });

export default mongoose.model('Wishlist', wishlistSchema);