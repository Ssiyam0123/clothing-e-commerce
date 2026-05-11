import mongoose from 'mongoose';
import Product from '../product.model.js';
import Category from '../../category/category.model.js';
import Subcategory from '../../subcategory/subcategory.model.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';

export const getPublicProducts = asyncHandler(async (req, res) => {
    const {
        category,
        subcategory,
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
        } else if (category === 'featured') {
            const featCats = await Category.find({ isFeatured: true }).select('_id');
            if (featCats.length > 0) {
                matchStage.category = { $in: featCats.map(c => new mongoose.Types.ObjectId(c._id)) };
            } else return res.json({ success: true, total: 0, pages: 0, products: [] });
        } else {
            const catDoc = await Category.findOne({ slug: category }).select('_id');
            if (catDoc) matchStage.category = new mongoose.Types.ObjectId(catDoc._id);
            else return res.json({ success: true, total: 0, pages: 0, products: [] });
        }
    }

    if (subcategory && subcategory !== 'all') {
        const subDoc = await Subcategory.findOne({ slug: subcategory }).select('_id');
        if (subDoc) matchStage.subcategory = new mongoose.Types.ObjectId(subDoc._id);
        else return res.json({ success: true, total: 0, pages: 0, products: [] });
    }

    if (search) {
        const words = search.trim().split(/\s+/).filter(Boolean);
        if (words.length > 0) {
            const searchRegex = words.map(word => 
                `(?=.*${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`
            ).join('');
            matchStage.name = { $regex: searchRegex, $options: 'i' };
        }
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

    // Populate Category & Subcategory
    pipeline.push(
        {
            $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'category' }
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        {
            $lookup: { from: 'subcategories', localField: 'subcategory', foreignField: '_id', as: 'subcategory' }
        },
        { $unwind: { path: '$subcategory', preserveNullAndEmptyArrays: true } }
    );

    // 🚀 STRICT PROJECTION FOR PUBLIC CONSUMPTION
    pipeline.push({
        $project: {
            name: 1,
            slug: 1,
            price: 1,
            discount: 1,
            images: { $slice: ['$images', 1] }, // Only 1st image for card
            category: { name: 1, slug: 1, _id: 1 },
            subcategory: { name: 1, slug: 1, _id: 1 },
            sizes: 1,
            totalStock: 1,
            isFeatured: 1,
            showReviews: 1
        }
    });

    // 🚀 POPULATE SIZES IN AGGREGATION
    pipeline.push(
        { $unwind: { path: '$sizes', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'sizes',
                let: { sizeId: '$sizes.size' },
                pipeline: [
                    { 
                        $match: { 
                            $expr: { 
                                $and: [
                                    { $ne: ['$$sizeId', null] },
                                    { $ne: ['$$sizeId', ''] },
                                    { $eq: ['$_id', { $toObjectId: '$$sizeId' }] }
                                ]
                            } 
                        } 
                    },
                    { $project: { name: 1 } }
                ],
                as: 'sizes.size'
            }
        },
        { $unwind: { path: '$sizes.size', preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: '$_id',
                root: { $first: '$$ROOT' },
                sizes: { $push: '$sizes' }
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        '$root',
                        {
                            sizes: {
                                $filter: {
                                    input: '$sizes',
                                    as: 's',
                                    cond: { 
                                        $and: [
                                            { $ne: ['$$s', {}] },
                                            { $ne: ['$$s.size', null] }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        }
    );

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

export const getPublicProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product identity protocol' });
    }

    const product = await Product.findOne({ _id: id, isActive: true })
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
        .populate('sizes.size', 'name')
        .lean();

    if (!product) return res.status(404).json({ message: 'Artifact not found' });

    const { isActive, featuredOrder, ...publicData } = product;
    res.json(publicData);
});
