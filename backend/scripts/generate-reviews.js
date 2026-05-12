import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_PATH = path.join(__dirname, '../jsons/e-commerce-z.users.json');
const PRODUCTS_PATH = path.join(__dirname, '../jsons/e-commerce-z.products.json');
const REVIEWS_PATH = path.join(__dirname, '../jsons/e-commerce-z.reviews.json');

const REVIEW_TEMPLATES = [
  "Absolutely love this! The quality is outstanding.",
  "Decent product for the price. Would recommend.",
  "The fit is perfect and the fabric feels premium.",
  "Great value for money. I'm very satisfied.",
  "It looks even better in person than in the photos.",
  "Fast shipping and great packaging. Product is as described.",
  "A bit expensive, but definitely worth it for the quality.",
  "Highly recommended for anyone looking for style and comfort.",
  "I've been using this for a week now and it's holding up great.",
  "The color is slightly different from the picture but still looks good.",
  "Best purchase I've made this year! Simply amazing.",
  "Very comfortable to wear all day. No complaints at all.",
  "Stylish and modern design. Gets me lots of compliments.",
  "The material is breathable and soft. Perfect for daily use.",
  "Good craftsmanship. You can tell they put effort into the details.",
  "Simple, elegant, and effective. Just what I needed.",
  "Exceeded my expectations! Will definitely buy more from this brand.",
  "A must-have for your collection. Very versatile.",
  "The packaging was eco-friendly, which I really appreciate.",
  "Impressive quality! I'm glad I took the chance on this.",
  "The size guide was accurate, fits like a glove.",
  "Very happy with this purchase. Five stars!",
  "Great addition to my wardrobe. Goes with everything.",
  "The finish is smooth and high-end. Love it.",
  "Worth every penny. The attention to detail is superb."
];

const ADJECTIVES = ["Fantastic", "Excellent", "Wonderful", "Superb", "Amazing", "Great", "Nice", "Solid", "Premium", "Stunning"];
const NOUNS = ["quality", "design", "fit", "material", "look", "feel", "style", "experience", "purchase", "item"];

function generateUniqueComment() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const template = REVIEW_TEMPLATES[Math.floor(Math.random() * REVIEW_TEMPLATES.length)];
  return `${adj} ${noun}! ${template}`;
}

async function generateReviews() {
  try {
    console.log('🔍 Loading data...');
    const users = JSON.parse(fs.readFileSync(USERS_PATH, 'utf8'));
    const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));
    
    console.log(`👥 Users: ${users.length}, 📦 Products: ${products.length}`);

    const reviews = [];
    const updatedProducts = [];

    for (const product of products) {
      const reviewCount = Math.floor(Math.random() * 11) + 20; // 20-30 reviews
      let totalRating = 0;
      
      // Get unique users for this product
      const productUsers = [];
      const usedUserIndices = new Set();
      
      while (productUsers.length < reviewCount) {
        const randomIndex = Math.floor(Math.random() * users.length);
        if (!usedUserIndices.has(randomIndex)) {
          usedUserIndices.add(randomIndex);
          productUsers.push(users[randomIndex]);
        }
      }

      for (let i = 0; i < reviewCount; i++) {
        const user = productUsers[i];
        // Generate rating: 4-5 are most common (80%), 3 (15%), 1-2 (5%)
        let rating;
        const rand = Math.random();
        if (rand < 0.8) rating = Math.floor(Math.random() * 2) + 4; // 4 or 5
        else if (rand < 0.95) rating = 3;
        else rating = Math.floor(Math.random() * 2) + 1; // 1 or 2
        
        totalRating += rating;

        reviews.push({
          product: product._id, // Keep original format ($oid)
          user: user._id.$oid || user._id, // Use the actual ID string for lookup
          rating: rating,
          comment: generateUniqueComment(),
          isEdited: false,
          createdAt: { "$date": new Date(Date.now() - Math.random() * 10000000000).toISOString() },
          updatedAt: { "$date": new Date().toISOString() }
        });
      }

      // Update product stats
      product.averageRating = parseFloat((totalRating / reviewCount).toFixed(1));
      product.totalReviews = reviewCount;
      updatedProducts.push(product);
    }

    console.log(`✍️ Writing ${reviews.length} reviews to JSON...`);
    fs.writeFileSync(REVIEWS_PATH, JSON.stringify(reviews, null, 2), 'utf8');

    console.log('💾 Updating products with new ratings...');
    fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(updatedProducts, null, 2), 'utf8');

    console.log('✅ Review generation completed successfully!');

  } catch (error) {
    console.error('❌ Generation Failed:', error);
  }
}

generateReviews();
