import Category from '../category.model.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';

export const getPublicCategories = asyncHandler(async (req, res) => {
    // For storefront, we only need basic info
    const categories = await Category.find({})
        .select('name slug image description')
        .sort('name');

    // 🚀 Prepend Virtual "On Sale" Category
    const onSaleCategory = {
        _id: 'virtual-on-sale',
        name: 'On Sale',
        slug: 'on-sale',
        description: 'Tactical valuations on premium artifacts.',
        image: null // Frontend will handle the specialized icon/gradient
    };

    res.json([onSaleCategory, ...categories]);
});

export const getPublicCategoryBySlug = asyncHandler(async (req, res) => {
    const category = await Category.findOne({ slug: req.params.slug })
        .select('name slug image description');
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
});
