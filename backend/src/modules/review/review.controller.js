import Review from './review.model.js';
import Product from '../product/product.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { uploadMultipleImages, deleteImage } from '../../services/imageUploadService.js';
import mongoose from 'mongoose'; // 👈 Added Mongoose for Native DB Call

// --- Helper Function to Recalculate Ratings ---
const updateProductRating = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) return;

  const stats = await Review.aggregate([
    { $match: { product: product._id } },
    { $group: { _id: '$product', averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
  ]);
  
  if (stats.length > 0) {
    product.averageRating = stats[0].averageRating;
    product.totalReviews = stats[0].totalReviews;
  } else {
    product.averageRating = 0;
    product.totalReviews = 0;
  }
  await product.save();
};

// --- Helper Function to Attach User Data ---
const attachUserToReview = async (reviewDoc) => {
  const db = mongoose.connection.db;
  const review = reviewDoc.toObject ? reviewDoc.toObject() : reviewDoc;
  
  const user = await db.collection('users').findOne({ 
    $or: [{ id: review.user }, { _id: review.user }] 
  });

  review.user = user 
    ? { _id: review.user, name: user.name, avatar: user.avatar } 
    : { _id: review.user, name: 'Anonymous', avatar: '' };

  return review;
};

export const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user.id || req.user._id;

  if (!productId || !rating) return res.status(400).json({ message: 'Product ID and rating are required.' });

  const existingReview = await Review.findOne({ product: productId, user: userId });
  if (existingReview) return res.status(400).json({ message: 'You have already reviewed this product.' });

  let imageUrls = [];
  if (req.files && req.files.length) {
    imageUrls = await uploadMultipleImages(req.files, 'reviews');
  }

  const review = await Review.create({
    product: productId,
    user: userId,
    rating: parseInt(rating),
    comment,
    images: imageUrls.map(url => ({ url })),
  });

  await updateProductRating(productId); 
  
  // 🌟 FIXED: Mapped User Data manually instead of .populate()
  const reviewWithUser = await attachUserToReview(review);
  
  res.status(201).json(reviewWithUser);
});

export const updateReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment, removeImages } = req.body;
    const userId = req.user.id || req.user._id;
    const review = await Review.findById(reviewId);

    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this review' });
    }
  
    if (removeImages && removeImages !== 'undefined') {
      let removeImageUrls = [];
      try { removeImageUrls = JSON.parse(removeImages); } catch (e) {}
      if (removeImageUrls.length) {
        for (const url of removeImageUrls) await deleteImage(url);
        review.images = review.images.filter(img => !removeImageUrls.includes(img.url));
      }
    }
  
    if (req.files && req.files.length) {
      const newImageUrls = await uploadMultipleImages(req.files, 'reviews');
      for (const url of newImageUrls) review.images.push({ url });
    }

    if (rating) review.rating = parseInt(rating);
    if (comment) review.comment = comment;
    review.isEdited = true; 
  
    await review.save();
    await updateProductRating(review.product); 
    
    // 🌟 FIXED: Mapped User Data manually
    const reviewWithUser = await attachUserToReview(review);
    res.json(reviewWithUser);
});

export const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id || req.user._id;
    const review = await Review.findById(reviewId);

    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    if (req.user.role !== 'admin' && review.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    for (const img of review.images) await deleteImage(img.url);
    await review.deleteOne();
    
    await updateProductRating(review.product); 
    res.json({ message: 'Review removed' });
});

export const getProductReviews = asyncHandler(async (req, res) => {
    const db = mongoose.connection.db;
    const { productId } = req.params;
    
    // 🌟 FIXED: Removed .populate('user')
    const reviewsRaw = await Review.find({ product: productId })
        .sort('-createdAt')
        .lean();

    // 🌟 Manual Population for Users in bulk (Fast and Efficient)
    const userIdsToFetch = [...new Set(reviewsRaw.map(r => r.user))];
    const users = await db.collection('users').find({
      $or: [{ id: { $in: userIdsToFetch } }, { _id: { $in: userIdsToFetch } }]
    }).toArray();

    const userMap = users.reduce((acc, u) => {
      const idStr = u.id || u._id.toString();
      acc[idStr] = { _id: idStr, name: u.name, avatar: u.avatar };
      return acc;
    }, {});

    const reviews = reviewsRaw.map(r => ({
      ...r,
      user: userMap[r.user] || { _id: r.user, name: 'Anonymous', avatar: '' }
    }));

    const product = await Product.findById(productId).select('averageRating totalReviews');

    let userReview = null;
    if (req.user) {
        const reqUserId = req.user.id || req.user._id;
        userReview = reviews.find(r => r.user?._id?.toString() === reqUserId.toString());
    }

    res.json({
        reviews,
        userReview,
        averageRating: product?.averageRating || 0,
        totalReviews: product?.totalReviews || 0
    });
});