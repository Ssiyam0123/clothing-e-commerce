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

flashSaleSchema.pre("save", async function () {
  if (!this.isModified("name") && this.slug) return;

  let generatedSlug = slugify(this.name, { lower: true, strict: true });

  const slugExists = await mongoose.models.FlashSale.findOne({
    slug: generatedSlug,
    _id: { $ne: this._id },
  });

  if (slugExists) {
    generatedSlug = `${generatedSlug}-${Math.random().toString(36).substring(2, 5)}`;
  }

  this.slug = generatedSlug;
});

flashSaleSchema.index({ startDate: 1, endDate: 1, isActive: 1 });
flashSaleSchema.index({ isActive: 1, endDate: 1 });

export default mongoose.models.FlashSale || mongoose.model("FlashSale", flashSaleSchema);
