import Category from '../category.model.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';
import { uploadImage, deleteImage } from '../../../services/imageUploadService.js';

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
    res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
    const existingCategory = await Category.findById(req.params.id);
    if (!existingCategory) return res.status(404).json({ message: 'Category not found' });

    let imageUrl = existingCategory.image;
    if (req.file) {
        imageUrl = await uploadImage(req.file, 'categories', existingCategory.image);
    }

    const updated = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            slug: req.body.slug,
            description: req.body.description,
            image: imageUrl,
        },
        { new: true, runValidators: true }
    );
    res.json(updated);
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (category.image) await deleteImage(category.image);
    await category.deleteOne();
    res.json({ message: 'Category purged.' });
});

export const getAdminCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({}).sort('name');
    res.json(categories);
});

export const getAdminCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
});
