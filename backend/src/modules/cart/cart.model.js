import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  size: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Size',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: {
    type: String, 
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
}, { timestamps: true });

cartSchema.methods.calculateTotals = async function() {
  if (!this.items || this.items.length === 0) {
    return { totalItems: 0, totalPrice: 0 };
  }
  
  await this.populate('items.product', 'price discount isActive');
  
  let totalItems = 0;
  let totalPrice = 0;
  
  for (const item of this.items) {
    if (!item.product || !item.product.isActive) continue;
    
    const price = item.product.discount > 0 
      ? item.product.price - (item.product.price * item.product.discount / 100)
      : item.product.price;
    
    totalItems += item.quantity;
    totalPrice += price * item.quantity;
  }
  
  return { totalItems, totalPrice };
};

export default mongoose.model('Cart', cartSchema);