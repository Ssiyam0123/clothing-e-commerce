import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_PATH = path.join(__dirname, '../jsons/e-commerce-z.products.json');

// Helper to generate a "big unique description"
function generateBigDescription(name, tags, price) {
  const intros = [
    `Experience the pinnacle of style and comfort with our ${name}.`,
    `Redefine your wardrobe with the elegant and versatile ${name}.`,
    `Step into luxury with the meticulously crafted ${name}.`,
    `Discover the perfect blend of modern aesthetics and traditional quality in the ${name}.`,
    `The ${name} is more than just clothing; it's a statement of sophistication.`
  ];

  const features = [
    `Crafted from high-quality, premium materials, this piece is designed to elevate your everyday wardrobe.`,
    `Featuring a unique blend of craftsmanship and contemporary design, it seamlessly transitions from day to night.`,
    `The specialized texture ensures maximum breathability while maintaining a sharp, professional look.`,
    `Engineered for durability and style, it withstands the test of time and fashion trends.`,
    `Every stitch is a testament to our commitment to quality and attention to detail.`
  ];

  const benefits = [
    `Whether you're heading to a casual outing or a formal event, this product provides the perfect fit and feel.`,
    `Associated with ${tags && tags.length > 0 ? tags.join(', ') : 'modern fashion'}, it represents the latest trends in the industry.`,
    `Designed with the modern individual in mind, it offers both functionality and flair.`,
    `Pair it with your favorite accessories for a look that is uniquely yours.`,
    `Its versatile nature makes it an essential addition to any curated collection.`
  ];

  const closes = [
    `Available at a competitive price of ${price}, it offers unbeatable value for those who don't want to compromise on quality.`,
    `Invest in a piece that brings together luxury and practicality.`,
    `Order your ${name} today and experience the difference in premium apparel.`,
    `This is a limited edition piece that embodies the essence of our brand.`,
    `Join the community of style enthusiasts who choose only the best.`
  ];

  const care = `Care Instructions: Machine wash cold with like colors. Tumble dry low. Do not bleach. Iron on low heat if needed.`;

  const intro = intros[Math.floor(Math.random() * intros.length)];
  const feature = features[Math.floor(Math.random() * features.length)];
  const benefit = benefits[Math.floor(Math.random() * benefits.length)];
  const close = closes[Math.floor(Math.random() * closes.length)];

  return `${intro} \n\n${feature} \n\n${benefit} \n\n${close} \n\n${care}`;
}

async function syncProducts() {
  try {
    console.log('🔍 Reading products JSON...');
    if (!fs.existsSync(JSON_PATH)) {
      throw new Error(`JSON file not found at ${JSON_PATH}`);
    }
    const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
    
    const usedNames = new Set();
    const usedDescriptions = new Set();
    const usedSlugs = new Set();

    console.log(`🚀 Processing ${data.length} products to match Vanguard standards...`);

    const updatedData = data.map((product, index) => {
      // 1. Unique Name
      let name = (product.name || `Vanguard Item ${index + 1}`).trim();
      let uniqueName = name;
      let counter = 1;
      while (usedNames.has(uniqueName)) {
        uniqueName = `${name} ${counter++}`;
      }
      usedNames.add(uniqueName);
      product.name = uniqueName;

      // 2. Unique Slug (URL Friendly)
      let slug = slugify(uniqueName, { lower: true, strict: true });
      let uniqueSlug = slug;
      let slugCounter = 1;
      while (usedSlugs.has(uniqueSlug)) {
        uniqueSlug = `${slug}-${slugCounter++}`;
      }
      usedSlugs.add(uniqueSlug);
      product.slug = uniqueSlug;

      // 3. Unique Big Description
      // We always generate a fresh, big description to ensure quality and uniqueness
      const bigDescription = generateBigDescription(uniqueName, product.tags, product.price);
      product.description = bigDescription;
      usedDescriptions.add(bigDescription);

      // 4. Model Sync (Ensuring all schema fields exist)
      product.price = parseFloat(product.price) || 0;
      product.discount = parseFloat(product.discount) || 0;
      product.isActive = product.isActive !== undefined ? product.isActive : true;
      product.isFeatured = product.isFeatured !== undefined ? product.isFeatured : false;
      product.featuredOrder = parseInt(product.featuredOrder) || 0;
      product.views = parseInt(product.views) || 0;
      product.averageRating = parseFloat(product.averageRating) || 0;
      product.totalReviews = parseInt(product.totalReviews) || 0;
      product.showReviews = product.showReviews !== undefined ? product.showReviews : true;
      
      // Ensure arrays exist
      if (!Array.isArray(product.images)) product.images = [];
      if (!Array.isArray(product.tags)) product.tags = [];
      if (!Array.isArray(product.sizes)) product.sizes = [];

      return product;
    });

    console.log('💾 Saving synchronized data back to JSON...');
    fs.writeFileSync(JSON_PATH, JSON.stringify(updatedData, null, 2), 'utf8');
    console.log('✅ Vanguard Product Sync Completed Successfully!');

  } catch (error) {
    console.error('❌ Sync Failed:', error.message);
  }
}

syncProducts();
