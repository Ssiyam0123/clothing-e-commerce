import FlashSale from './flashSale.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';


const populatedProductsConfig = {
  path: 'products',
  populate: {
    path: 'sizes.size',
    select: 'name'
  }
};

// Create a new flash sale
export const createFlashSale = asyncHandler(async (req, res) => {
  const { 
    name, description, discount, products, 
    startDate, endDate, bannerImage, startImmediately 
  } = req.body;

  if (!name || !discount || !products || !endDate) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let finalStartDate = startDate ? new Date(startDate) : new Date();
  if (startImmediately === true || startImmediately === 'true') {
    finalStartDate = new Date();
  }

  const end = new Date(endDate);
  if (finalStartDate >= end) {
    return res.status(400).json({ message: 'End date must be after start date' });
  }

  const flashSale = await FlashSale.create({
    name,
    description: description || '',
    discount: Number(discount),
    products,
    startDate: finalStartDate,
    endDate: end,
    bannerImage: bannerImage || '',
    isActive: true,
    startImmediately: startImmediately === true || startImmediately === 'true',
  });

  res.status(201).json(flashSale);
});

// Update a flash sale
export const updateFlashSale = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sale = await FlashSale.findById(id);
  if (!sale) return res.status(404).json({ message: 'Campaign not found' });

  const updateData = { ...req.body };

  if (updateData.startImmediately !== undefined) {
    const startNow = updateData.startImmediately === true || updateData.startImmediately === 'true';
    if (startNow) updateData.startDate = new Date();
  }

  if (updateData.discount !== undefined) {
    const discount = Number(updateData.discount);
    if (isNaN(discount)) return res.status(400).json({ message: 'Invalid discount value' });
    updateData.discount = discount;
  }

  if (updateData.products && Array.isArray(updateData.products)) {
    updateData.products = updateData.products.filter(id => id && typeof id === 'string');
  }

  const updatedSale = await FlashSale.findByIdAndUpdate(
    id,
    { $set: updateData },
    { returnDocument: 'after', runValidators: true }
  ).populate(populatedProductsConfig); // 🚀 সাইজ সিঙ্ক করা হলো

  res.json(updatedSale);
});

// Get all flash sales (admin)
export const getAllFlashSales = asyncHandler(async (req, res) => {
  const flashSales = await FlashSale.find({})
    .sort('-createdAt')
    .populate(populatedProductsConfig); 
  res.json(flashSales);
});

// Delete a flash sale
export const deleteFlashSale = asyncHandler(async (req, res) => {
  await FlashSale.findByIdAndDelete(req.params.id);
  res.json({ message: 'Campaign Terminated' });
});

// Get all active flash sales (public)
export const getActiveFlashSales = asyncHandler(async (req, res) => {
  const now = new Date();
  const sales = await FlashSale.find({ 
    isActive: true, 
    endDate: { $gte: now } 
  }).sort('startDate');
  res.json(sales);
});

export const getFlashSaleProducts = asyncHandler(async (req, res) => {
  const now = new Date();
  const sale = await FlashSale.findOne({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).populate(populatedProductsConfig); // 🚀 Deep Populate Applied
  
  if (!sale) return res.json({ flashSale: null, products: [] });
  
  const productsWithDiscount = sale.products.map(product => {
    const p = product.toObject();
    
    const basePrice = p.price; 
    const flashDiscount = sale.discount;
    const finalFlashPrice = basePrice - (basePrice * flashDiscount / 100);

    return {
      ...p,
      originalPrice: basePrice,
      discountedPrice: finalFlashPrice,
      discountPercentage: flashDiscount,
      flashSaleEnds: sale.endDate,
    };
  });
  
  res.json({ flashSale: sale, products: productsWithDiscount });
});

export const getFlashSaleById = asyncHandler(async (req, res) => {
  const sale = await FlashSale.findById(req.params.id).populate(populatedProductsConfig); // 🚀 Deep Populate Applied
  if (!sale) return res.status(404).json({ message: 'Sale not found' });

  const productsWithDiscount = sale.products.map(p => {
    const productObj = p.toObject();
    const basePrice = productObj.price;
    const flashDiscount = sale.discount;

    return {
      ...productObj,
      originalPrice: basePrice,
      discountedPrice: basePrice - (basePrice * flashDiscount / 100),
      discountPercentage: flashDiscount
    };
  });

  const saleObj = sale.toObject();
  saleObj.products = productsWithDiscount; 
  
  res.json(saleObj);
});