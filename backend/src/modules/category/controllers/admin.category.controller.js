import Category from '../category.model.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';
import { uploadImage, deleteImage } from '../../../services/imageUploadService.js';
import { clearCache } from '../../../middleware/cacheMiddleware.js';

export const createCategory = asyncHandler(async (req, res) => {
    let imageUrl = null;
    if (req.file) {
        imageUrl = await uploadImage(req.file, 'categories');
    }
    const category = await Category.create({
        name: req.body.name,
        slug: req.body.slug,
        description: req.body.description,
        image: imageUrl,
    });

    // Clear caches
    clearCache('cache:/api/categories*');
    clearCache('cache:/api/products*');
    clearCache('cache:/api/home-layout*');
    clearCache('cache:/api/admin/dashboard*');

    res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
    const existingCategory = await Category.findById(req.params.id);
    if (!existingCategory) return res.status(404).json({ message: 'Category not found' });

    let imageUrl = existingCategory.image;
    if (req.file) {
        imageUrl = await uploadImage(req.file, 'categories', existingCategory.image);
    }

    const updateData = {
        name: req.body.name || existingCategory.name,
        slug: req.body.slug || existingCategory.slug,
        description: req.body.description || existingCategory.description,
        image: imageUrl,
    };

    const updated = await Category.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
    );

    // Clear caches
    clearCache('cache:/api/categories*');
    clearCache('cache:/api/products*');
    clearCache('cache:/api/home-layout*');
    clearCache('cache:/api/admin/dashboard*');

    res.json(updated);
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (category.image) await deleteImage(category.image);
    await category.deleteOne();

    // Clear caches
    clearCache('cache:/api/categories*');
    clearCache('cache:/api/products*');
    clearCache('cache:/api/home-layout*');
    clearCache('cache:/api/admin/dashboard*');

    res.json({ message: 'Category purged.' });
});

export const getAdminCategories = asyncHandler(async (req, res) => {
    const { page = 1, limit = 30, search = '' } = req.query;
    const filter = {};
    if (search) {
        filter.name = { $regex: search, $options: 'i' };
    }
    const total = await Category.countDocuments(filter);
    const categories = await Category.find(filter)
        .sort('name')
        .skip((page - 1) * limit)
        .limit(Number(limit));
        
    res.json({
        categories,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
    });
});

export const getAdminCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
});
