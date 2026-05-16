import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: [
      'HERO', 
      'USP', 
      'FLASH_SALE', 
      'CATEGORY_GRID', 
      'FEATURED_PRODUCTS', 
      'NEW_ARRIVALS', 
      'SALE_PRODUCTS', 
      'FEATURED_CATEGORY_SECTION', 
      'CATEGORY_COLLECTION',
      'PROMO_BANNER',
      'BANNER_SLIDER',
      'HEADER',
      'CUSTOM_PRODUCTS'
    ]
  },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  titleBn: { type: String, default: '' },
  subtitleBn: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  images: [{ type: String }],
  actionLink: { type: String, default: '' },
  isVisible: { type: Boolean, default: true },
  config: { type: mongoose.Schema.Types.Mixed, default: {} },
  order: { type: Number, default: 0 }
});

const homeLayoutSchema = new mongoose.Schema({
  name: { type: String, default: 'Primary Layout' },
  sections: [sectionSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('HomeLayout', homeLayoutSchema);
