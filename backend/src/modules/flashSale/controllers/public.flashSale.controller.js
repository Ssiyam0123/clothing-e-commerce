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
  .populate(populatedProductsConfig);

  const salesWithCalculatedPrices = sales.map(sale => {
    const saleObj = sale.toObject();
    saleObj.products = saleObj.products.map(product => {
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
    return saleObj;
  });

  res.json(salesWithCalculatedPrices);
});

export const getFlashSaleProducts = asyncHandler(async (req, res) => {
  const now = new Date();
  const sale = await FlashSale.findOne({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).populate(populatedProductsConfig);
  
  if (!sale) return res.json({ flashSale: null, products: [] });
  
  const productsWithDiscount = sale.products.map(product => {
    const p = product.toObject();
    const basePrice = p.price; 
    const flashDiscount = sale.discount;
    return {
      ...p,
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
  const sale = await FlashSale.findOne({ slug, isActive: true })
    .populate(populatedProductsConfig);

  if (!sale) return res.status(404).json({ message: 'Sequence not found in archives.' });

  const productsWithDiscount = sale.products.map(p => {
    const productObj = p.toObject();
    const basePrice = productObj.price;
    return {
      ...productObj,
      originalPrice: basePrice,
      discountedPrice: basePrice - (basePrice * sale.discount / 100),
      discountPercentage: sale.discount,
      flashSaleEnds: sale.endDate
    };
  });

  const response = sale.toObject();
  response.products = productsWithDiscount;
  res.json(response);
});
