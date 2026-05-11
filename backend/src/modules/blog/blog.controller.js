// src/modules/blog/blog.controller.js
import Blog from "./blog.model.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import slugify from "slugify";
import { uploadImage, deleteImage } from "../../services/imageUploadService.js";

// 📝 Create Post
export const createPost = asyncHandler(async (req, res) => {
  const { title, content, category, status, seo } = req.body;
  
  let featuredImage = "";
  if (req.file) {
    // Use the unified image upload service
    featuredImage = await uploadImage(req.file, "blogs");
  } else if (req.body.featuredImage) {
    featuredImage = req.body.featuredImage;
  }

  if (!featuredImage) {
    return res.status(400).json({ 
      message: "A featured image is required. Please attach a valid artifact." 
    });
  }

  const slug = slugify(title, { lower: true, strict: true });
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTime = `${Math.ceil(wordCount / 200)} min read`;

  let parsedSeo = {};
  if (seo) parsedSeo = typeof seo === 'string' ? JSON.parse(seo) : seo;

  const blog = await Blog.create({
    title,
    slug,
    content,
    featuredImage,
    category,
    status: status || 'PUBLISHED',
    readingTime,
    seo: parsedSeo,
    author: req.user._id
  });

  res.status(201).json(blog);
});

// 📰 Get All Posts (public)
export const getPosts = asyncHandler(async (req, res) => {
  const { category, status = 'PUBLISHED', fields, page = 1, limit = 30 } = req.query;
  const query = {};
  
  if (status !== 'all') {
    query.status = status;
  }
  
  if (category) query.category = category;

  const total = await Blog.countDocuments(query);
  let postsQuery = Blog.find(query)
    .populate('author', 'name avatar')
    .sort('-isFeatured -createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit));

  if (fields) {
    postsQuery = postsQuery.select(fields.split(',').join(' '));
  }
  
  const posts = await postsQuery;
    
  res.json({
    blogs: posts,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit)
  });
});

// 📖 Get Single Post by Slug
export const getPostBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug },
    { $inc: { viewCount: 1 } },
    { new: true }
  ).populate('author', 'name avatar')
   .populate('comments.user', 'name avatar');

  if (!blog) return res.status(404).json({ message: "Article not found" });
  res.json(blog);
});

// 🔎 Get Single Post by ID (Admin)
export const getPostById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
    .populate('author', 'name avatar')
    .populate('comments.user', 'name avatar');

  if (!blog) return res.status(404).json({ message: "Sequence not found in archives." });
  res.json(blog);
});

// 🔄 Update Post (with image cleanup)
export const updatePost = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Sequence not found in archives." });

  const { title, content, seo, ...rest } = req.body;

  // Handle featured image update – delete old one if new one is uploaded
  if (req.file) {
    // Delete the old featured image from storage
    if (blog.featuredImage) await deleteImage(blog.featuredImage);
    // Upload the new one
    blog.featuredImage = await uploadImage(req.file, "blogs");
  }

  if (title) {
    blog.title = title;
    blog.slug = slugify(title, { lower: true, strict: true });
  }

  if (content) {
    blog.content = content;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    blog.readingTime = `${Math.ceil(wordCount / 200)} min read`;
  }

  if (seo) {
    blog.seo = typeof seo === 'string' ? JSON.parse(seo) : seo;
  }

  Object.assign(blog, rest);
  
  const updatedBlog = await blog.save();
  res.json(updatedBlog);
});

// 🗑️ Delete Post (with image cleanup)
export const deletePost = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Article not found." });

  // Delete the featured image from storage
  if (blog.featuredImage) await deleteImage(blog.featuredImage);

  await blog.deleteOne();
  res.json({ message: "Article purged from archives successfully." });
});