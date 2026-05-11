import FlashSale from '../flashSale.model.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';

const populatedProductsConfig = {
  path: 'products',
  populate: {
    path: 'sizes.size',
    select: 'name'
  }
};

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
  ).populate(populatedProductsConfig);

  res.json(updatedSale);
});

export const getAllFlashSales = asyncHandler(async (req, res) => {
  const { page = 1, limit = 30, search = '' } = req.query;
  const filter = {};
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  
  const total = await FlashSale.countDocuments(filter);
  const flashSales = await FlashSale.find(filter)
    .sort('-createdAt')
    .populate(populatedProductsConfig)
    .skip((page - 1) * limit)
    .limit(Number(limit));
    
  res.json({
    flashSales,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit)
  });
});

export const deleteFlashSale = asyncHandler(async (req, res) => {
  await FlashSale.findByIdAndDelete(req.params.id);
  res.json({ message: 'Campaign Terminated' });
});

export const getAdminFlashSaleById = asyncHandler(async (req, res) => {
  const sale = await FlashSale.findById(req.params.id).populate(populatedProductsConfig);
  if (!sale) return res.status(404).json({ message: 'Sale not found' });
  res.json(sale);
});
