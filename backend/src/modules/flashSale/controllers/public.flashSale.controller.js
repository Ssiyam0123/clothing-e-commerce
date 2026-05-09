import FlashSale from '../flashSale.model.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';

const populatedProductsConfig = {
  path: 'products',
  populate: {
    path: 'sizes.size',
    select: 'name'
  }
};

export const getActiveFlashSales = asyncHandler(async (req, res) => {
  const now = new Date();
  const sales = await FlashSale.find({ 
    isActive: true, 
    endDate: { $gte: now } 
  })
  .sort('startDate')
  .populate({
    path: 'products',
    model: 'Product',
    populate: {
      path: 'sizes.size',
      model: 'Size',
      select: 'name'
    }
  })
  .lean();

  const salesWithCalculatedPrices = sales.map(sale => {
    const products = (sale.products || []).map(product => {
      const basePrice = product.price;
      const flashDiscount = sale.discount;
      return {
        ...product,
        originalPrice: basePrice,
        discountedPrice: basePrice - (basePrice * flashDiscount / 100),
        discountPercentage: flashDiscount,
        flashSaleEnds: sale.endDate,
        isLive: new Date(sale.startDate) <= now
      };
    });
    return { ...sale, products };
  });

  res.json(salesWithCalculatedPrices);
});

export const getFlashSaleProducts = asyncHandler(async (req, res) => {
  const now = new Date();
  const sale = await FlashSale.findOne({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  })
  .populate({
    path: 'products',
    model: 'Product',
    populate: {
      path: 'sizes.size',
      model: 'Size',
      select: 'name'
    }
  })
  .lean();
  
  if (!sale) return res.json({ flashSale: null, products: [] });
  
  const productsWithDiscount = (sale.products || []).map(product => {
    const basePrice = product.price; 
    const flashDiscount = sale.discount;
    return {
      ...product,
      originalPrice: basePrice,
      discountedPrice: basePrice - (basePrice * flashDiscount / 100),
      discountPercentage: flashDiscount,
      flashSaleEnds: sale.endDate,
    };
  });
  
  res.json({ flashSale: sale, products: productsWithDiscount });
});

export const getPublicFlashSaleBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const sale = await FlashSale.findOne({ slug })
    .populate({
      path: 'products',
      model: 'Product',
      populate: {
        path: 'sizes.size',
        model: 'Size',
        select: 'name'
      }
    })
    .lean();

  if (!sale) return res.status(404).json({ message: 'Sequence not found in archives.' });

  const productsWithDiscount = (sale.products || []).map(p => {
    const basePrice = p.price;
    return {
      ...p,
      originalPrice: basePrice,
      discountedPrice: basePrice - (basePrice * sale.discount / 100),
      discountPercentage: sale.discount,
      flashSaleEnds: sale.endDate
    };
  });

  const response = { ...sale, products: productsWithDiscount };
  res.json(response);
});
