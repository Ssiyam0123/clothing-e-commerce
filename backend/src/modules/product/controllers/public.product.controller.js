import Product from '../product.model.js';
import Category from '../../category/category.model.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';

export const getPublicProducts = asyncHandler(async (req, res) => {
    const {
        category,
        search,
        minPrice,
        maxPrice,
        sort,
        page = 1,
        limit = 12,
        isFeatured,
    } = req.query;

    const matchStage = { isActive: true }; // Only active products for public

    if (isFeatured === 'true') matchStage.isFeatured = true;

    if (category && category !== 'all') {
        if (category === 'on-sale') {
            matchStage.discount = { $gt: 0 };
        } else {
            const catDoc = await Category.findOne({ slug: category }).select('_id');
            if (catDoc) matchStage.category = catDoc._id;
            else return res.json({ success: true, total: 0, pages: 0, products: [] });
        }
    }

    if (search) {
        const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        matchStage.name = { $regex: safeSearch, $options: 'i' };
    }

    if (minPrice || maxPrice) {
        matchStage.price = {};
        if (minPrice) matchStage.price.$gte = Number(minPrice);
        if (maxPrice) matchStage.price.$lte = Number(maxPrice);
    }

    const pipeline = [{ $match: matchStage }];
    
    // Add totalStock for display purposes
    pipeline.push({
        $addFields: { totalStock: { $sum: '$sizes.stock' } }
    });

    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await Product.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    let sortObj = { createdAt: -1 };
    if (sort === 'price') sortObj = { price: 1 };
    else if (sort === '-price') sortObj = { price: -1 };

    pipeline.push({ $sort: sortObj });
    const itemsLimit = Math.max(1, Number(limit));
    const skip = (Math.max(1, Number(page)) - 1) * itemsLimit;
    pipeline.push({ $skip: skip }, { $limit: itemsLimit });

    // Populate Category
    pipeline.push(
        {
            $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'category' }
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } }
    );

    // 🚀 STRICT PROJECTION FOR PUBLIC CONSUMPTION
    pipeline.push({
        $project: {
            name: 1,
            slug: 1,
            price: 1,
            discount: 1,
            images: { $slice: ['$images', 1] }, // Only 1st image for card
            category: { name: 1, slug: 1 },
            totalStock: 1,
            isFeatured: 1,
            showReviews: 1
        }
    });

    const products = await Product.aggregate(pipeline);

    res.json({
        success: true,
        total,
        pages: Math.ceil(total / itemsLimit),
        currentPage: Number(page),
        products
    });
});

export const getPublicProductBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const product = await Product.findOne({ slug, isActive: true })
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
        .populate('sizes.size', 'name')
        .lean();

    if (!product) return res.status(404).json({ message: 'Artifact not found' });

    // Minimized projection for details (hide admin internal flags)
    const { isActive, featuredOrder, ...publicData } = product;
    res.json(publicData);
});
