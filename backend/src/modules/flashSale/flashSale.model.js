import mongoose from "mongoose";
import slugify from "slugify";

const flashSaleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sale name is required"],
      trim: true,
    },
    slug: { type: String, unique: true, index: true },
    description: String,
    discount: {
      type: Number,
      required: [true, "Discount is required"],
      min: 1,
      max: 100,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    bannerImage: String,
    startImmediately: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

flashSaleSchema.pre('save', async function () {
  // 🚀 লজিক আপডেট: যদি নাম মডিফাই হয় অথবা স্লাগ একদমই না থাকে (Undefined/Null)
  if (!this.isModified('name') && this.slug) return;

  // স্লাগ তৈরি করা
  let generatedSlug = slugify(this.name, { lower: true, strict: true });

  // ডুপ্লিকেট চেক (নিজের আইডি বাদে)
  const slugExists = await mongoose.models.FlashSale.findOne({ 
    slug: generatedSlug, 
    _id: { $ne: this._id } 
  });

  if (slugExists) {
    generatedSlug = `${generatedSlug}-${Math.random().toString(36).substring(2, 5)}`;
  }

  this.slug = generatedSlug;
  // মঙ্গুজ অটোমেটিক সেভ করে নিবে কারণ এটা pre-save হুক
});

flashSaleSchema.index({ startDate: 1, endDate: 1, isActive: 1 });

export default mongoose.model("FlashSale", flashSaleSchema);
