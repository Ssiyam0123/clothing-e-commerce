// ... imports
import Subcategory from './subcategory.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { uploadImage, deleteImage } from '../../services/imageUploadService.js';

export const createSubcategory = asyncHandler(async (req, res) => {
  let imageUrl = null;
  if (req.file) {
    imageUrl = await uploadImage(req.file, 'subcategories');
  }
  const subcategory = await Subcategory.create({
    name: req.body.name,
    slug: req.body.slug,
    category: req.body.category,
    description: req.body.description,
    image: imageUrl,
  });
  res.status(201).json(subcategory);
});

export const updateSubcategory = asyncHandler(async (req, res) => {
  const existing = await Subcategory.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Subcategory not found' });

  let imageUrl = existing.image;
  if (req.file) {
    imageUrl = await uploadImage(req.file, 'subcategories', existing.image);
  }

  const updated = await Subcategory.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      category: req.body.category,
      description: req.body.description,
      image: imageUrl,
    },
    { new: true, runValidators: true }
  );
  res.json(updated);
});

export const deleteSubcategory = asyncHandler(async (req, res) => {
  const sub = await Subcategory.findById(req.params.id);
  if (!sub) return res.status(404).json({ message: 'Subcategory not found' });
  if (sub.image) await deleteImage(sub.image);
  await sub.deleteOne();
  res.json({ message: 'Subcategory removed' });
});

export const getSubcategories = asyncHandler(async (req, res) => {
    const { page = 1, limit = 30, search = '', category } = req.query;
    const filter = {};
    if (search) {
        filter.name = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'all') {
        filter.category = category;
    }
    
    const total = await Subcategory.countDocuments(filter);
    const subcategories = await Subcategory.find(filter)
        .populate('category', 'name')
        .sort('name')
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.json({
        subcategories,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
    });
});

export const getSubcategoryById = asyncHandler(async (req, res) => {
    const subcategory = await Subcategory.findById(req.params.id).populate('category', 'name');
    if (!subcategory) {
        res.status(404);
        throw new Error('Subcategory not found');
    }
    res.json(subcategory);
});
