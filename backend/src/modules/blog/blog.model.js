import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true }, // HTML string from Rich Text Editor
  featuredImage: { type: String, required: true },
  category: { type: String, required: true, enum: ['LIFESTYLE', 'COLLECTION', 'FABRIC', 'CULTURE', 'NEWS'] },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  readingTime: { type: String }, // e.g., "5 min read"
  tags: [{ type: String }],
  status: { type: String, enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' },
  
  // 🔍 SEO Core
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }]
  },

  // 💬 Engagement
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  viewCount: { type: Number, default: 0 }
}, { timestamps: true });

blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);