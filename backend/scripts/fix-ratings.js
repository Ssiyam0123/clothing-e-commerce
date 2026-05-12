import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../src/modules/product/product.model.js';
import Review from '../src/modules/review/review.model.js';

dotenv.config();

async function fixProductRatings() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected.');

    console.log('📊 Fetching all products...');
    const products = await Product.find({}, '_id name');
    console.log(`🔎 Found ${products.length} products.`);

    for (const product of products) {
      const stats = await Review.aggregate([
        { $match: { product: product._id.toString() } },
        { 
          $group: { 
            _id: null, 
            avgRating: { $avg: '$rating' }, 
            total: { $sum: 1 } 
          } 
        }
      ]);

      if (stats.length > 0) {
        const { avgRating, total } = stats[0];
        const roundedRating = Math.round(avgRating * 10) / 10;
        
        await Product.findByIdAndUpdate(product._id, {
          averageRating: roundedRating,
          totalReviews: total
        });
        console.log(`✅ Updated ${product.name}: ${roundedRating} (${total} reviews)`);
      } else {
        // Double check with numeric product ID if any
        const numericStats = await Review.aggregate([
            { $match: { product: product._id } },
            { 
              $group: { 
                _id: null, 
                avgRating: { $avg: '$rating' }, 
                total: { $sum: 1 } 
              } 
            }
          ]);

          if (numericStats.length > 0) {
            const { avgRating, total } = numericStats[0];
            const roundedRating = Math.round(avgRating * 10) / 10;
            
            await Product.findByIdAndUpdate(product._id, {
              averageRating: roundedRating,
              totalReviews: total
            });
            console.log(`✅ Updated ${product.name} (ObjectId): ${roundedRating} (${total} reviews)`);
          } else {
            // Reset to 0 if no reviews found
            await Product.findByIdAndUpdate(product._id, {
                averageRating: 0,
                totalReviews: 0
            });
            console.log(`⚪ No reviews for ${product.name}. Reset to 0.`);
          }
      }
    }

    console.log('🏁 Finished updating all products.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixProductRatings();
