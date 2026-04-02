import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  link: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { _id: true });

const bannerCampaignSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  slides: [slideSchema],
  isActive: { type: Boolean, default: false },
}, { timestamps: true });

// Ensure only one active campaign
bannerCampaignSchema.pre('save', async function() {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id }, isActive: true },
      { isActive: false }
    );
  }
});

export default mongoose.model('BannerCampaign', bannerCampaignSchema);