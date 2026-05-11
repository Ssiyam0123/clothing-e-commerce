import Size from './size.model.js';
import Category from '../category/category.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

// Helper function to get natural size order
const getSizeOrder = (sizeName) => {
  const orderMap = {
    'XXS': 1, 'XS': 2, 'S': 3, 'M': 4, 'L': 5, 'XL': 6, 'XXL': 7, 'XXXL': 8,
    '28': 1, '29': 2, '30': 3, '31': 4, '32': 5, '33': 6, '34': 7, '35': 8,
    '36': 9, '37': 10, '38': 11, '39': 12, '40': 13, '41': 14, '42': 15,
    '0': 1, '1': 2, '2': 3, '3': 4, '4': 5, '5': 6, '6': 7, '7': 8, '8': 9, '9': 10,
    '10': 11, '11': 12, '12': 13
  };
  return orderMap[sizeName] || 999;
};

export const createSize = asyncHandler(async (req, res) => {
  // Verify category exists
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).json({ message: 'Invalid category' });
  }
  
  const size = await Size.create(req.body);
  res.status(201).json(size);
});

export const getSizes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 30, category } = req.query;
  const filter = {};
  if (category && category !== 'all') filter.category = category;
  
  const total = await Size.countDocuments(filter);
  const sizes = await Size.find(filter)
    .populate('category', 'name slug')
    .skip((page - 1) * limit)
    .limit(Number(limit));
  
  // Sort sizes by natural order
  const sortedSizes = sizes.sort((a, b) => {
    const orderA = getSizeOrder(a.name);
    const orderB = getSizeOrder(b.name);
    return orderA - orderB;
  });
  
  res.json({
    sizes: sortedSizes,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit)
  });
});

export const getSizeById = asyncHandler(async (req, res) => {
  const size = await Size.findById(req.params.id).populate('category', 'name slug');
  if (!size) {
    return res.status(404).json({ message: 'Size not found' });
  }
  res.json(size);
});

export const updateSize = asyncHandler(async (req, res) => {
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }
  }
  
  const size = await Size.findByIdAndUpdate(req.params.id, req.body, { 
    new: true, 
    runValidators: true 
  });
  
  if (!size) {
    return res.status(404).json({ message: 'Size not found' });
  }
  
  res.json(size);
});

export const deleteSize = asyncHandler(async (req, res) => {
  const size = await Size.findById(req.params.id);
  if (!size) {
    return res.status(404).json({ message: 'Size not found' });
  }
  
  await size.deleteOne();
  res.json({ message: 'Size removed' });
});