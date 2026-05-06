import Product from './product.model.js';
import Category from '../category/category.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { uploadMultipleImages, deleteImage } from '../../services/imageUploadService.js';
import { createProductSchema, updateProductSchema } from './validators/product.validator.js';
import { ZodError } from 'zod';

// Helper to parse product data
const parseProductData = (req) => {
    const body = req.body;
    const parsedData = {};

    if (body.name !== undefined) parsedData.name = body.name;
    if (body.slug !== undefined) parsedData.slug = body.slug;
    if (body.description !== undefined) parsedData.description = body.description;
    if (body.price !== undefined) parsedData.price = parseFloat(body.price);
    if (body.discount !== undefined) parsedData.discount = parseFloat(body.discount);
    if (body.featuredOrder !== undefined) parsedData.featuredOrder = parseInt(body.featuredOrder);
    if (body.isActive !== undefined) parsedData.isActive = body.isActive === 'true' || body.isActive === true;
    if (body.isFeatured !== undefined) parsedData.isFeatured = body.isFeatured === 'true' || body.isFeatured === true;
    if (body.category !== undefined) parsedData.category = body.category;
    if (body.subcategory !== undefined) {
        parsedData.subcategory = (body.subcategory === 'undefined' || body.subcategory === 'null' || !body.subcategory) ? null : body.subcategory;
    }
    if (body.tags) {
        try {
            parsedData.tags = typeof body.tags === 'string' ? JSON.parse(body.tags) : body.tags;
        } catch (e) {
            parsedData.tags = body.tags.split(',').map(t => t.trim()).filter(Boolean);
        }
    }
    if (body.sizes) {
        try {
            const sizes = typeof body.sizes === 'string' ? JSON.parse(body.sizes) : body.sizes;
            parsedData.sizes = sizes.map(s => ({
                size: s.size._id || s.size,
                stock: Math.max(0, parseInt(s.stock))
            }));
        } catch (e) { console.error("Size parsing error"); }
    }
    return parsedData;
};

const handleZodError = (error, res) => {
    const formattedErrors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
    }));
    return res.status(400).json({ errors: formattedErrors });
};

export const createProduct = asyncHandler(async (req, res) => {
    let imageUrls = [];
    if (req.files && req.files.length) {
        imageUrls = await uploadMultipleImages(req.files, 'products');
    }
    const parsedData = parseProductData(req);
    parsedData.images = imageUrls;

    try {
        const validatedData = createProductSchema.parse(parsedData);
        const product = await Product.create(validatedData);
        res.status(201).json(product);
    } catch (error) {
        if (imageUrls.length) await Promise.all(imageUrls.map(url => deleteImage(url)));
        if (error instanceof ZodError) return handleZodError(error, res);
        throw error;
    }
});


export const getProducts = asyncHandler(async (req, res) => {
    const {
        category,
        search,
        minPrice,
        maxPrice,
        sort,
        page = 1,
        limit = 12,
        isActive,
        stockStatus,
        isFeatured,
        fields,
    } = req.query;

    const matchStage = {};

    // 1. Filtering Logic
    if (isActive === 'all') {
        // Show both
    } else if (isActive === 'false') {
        matchStage.isActive = false;
    } else {
        matchStage.isActive = true;
    }

    if (isFeatured === 'true') {
        matchStage.isFeatured = true;
    }

    if (category && category !== 'all') {
        const catDoc = await Category.findOne({ slug: category }).select('_id');
        if (catDoc) matchStage.category = catDoc._id;
        else return res.json({ success: true, total: 0, pages: 0, products: [] });
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

    // 2. Base Pipeline
    const pipeline = [];
    pipeline.push({ $match: matchStage });
    
    // Calculate totalStock for filtering
    pipeline.push({
        $addFields: {
            totalStock: { $sum: '$sizes.stock' }
        }
    });

    if (stockStatus) {
        if (stockStatus === 'lowStock') {
            pipeline.push({ $match: { totalStock: { $lt: 10, $gt: 0 } } });
        } else if (stockStatus === 'outOfStock') {
            pipeline.push({ $match: { totalStock: 0 } });
        }
    }

    // 3. Count total items for pagination
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await Product.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // 4. Sorting & Pagination
    let sortObj = { createdAt: -1 };
    if (sort === 'price') sortObj = { price: 1 };
    else if (sort === '-price') sortObj = { price: -1 };
    else if (sort === 'oldest') sortObj = { createdAt: 1 };
    else if (sort === 'stockHigh') sortObj = { totalStock: -1 };
    else if (sort === 'stockLow') sortObj = { totalStock: 1 };

    pipeline.push({ $sort: sortObj });
    
    const currentPage = Math.max(1, Number(page));
    const itemsLimit = Math.max(1, Number(limit));
    const skip = (currentPage - 1) * itemsLimit;
    pipeline.push({ $skip: skip }, { $limit: itemsLimit });

    // 🚀 5. Populate Sizes (The Fix)
    pipeline.push(
        { $unwind: { path: '$sizes', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'sizes', // নিশ্চিত কর কালেকশন নাম 'sizes'
                localField: 'sizes.size',
                foreignField: '_id',
                as: 'sizes.size'
            }
        },
        { $unwind: { path: '$sizes.size', preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: '$_id',
                productData: { $first: '$$ROOT' },
                sizes: { $push: '$sizes' }
            }
        },
        {
            $replaceRoot: {
                newRoot: { $mergeObjects: ['$productData', { sizes: '$sizes' }] }
            }
        }
    );

    // 6. Populate Category & Subcategory
    pipeline.push(
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
            }
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'subcategories',
                localField: 'subcategory',
                foreignField: '_id',
                as: 'subcategory'
            }
        },
        { $unwind: { path: '$subcategory', preserveNullAndEmptyArrays: true } }
    );

    // Final Sort (Grouping মাঝে মাঝে সর্ট নষ্ট করে দেয়)
    pipeline.push({ $sort: sortObj });

    // 7. Field Selection
    if (fields) {
        const projection = fields.split(',').reduce((acc, f) => {
            acc[f.trim()] = 1;
            return acc;
        }, {});
        pipeline.push({ $project: projection });
    }

    const products = await Product.aggregate(pipeline);

    res.json({
        success: true,
        total,
        pages: Math.ceil(total / itemsLimit),
        currentPage,
        pageSize: products.length,
        products
    });
});

export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
        .populate('sizes.size', 'name')
        .lean();

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    res.json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

    const updateFields = parseProductData(req);
    let finalImages = [...existingProduct.images];

    // Image management
    if (req.body.images !== undefined) {
        try {
            const updatedImagesList = typeof req.body.images === 'string' ? JSON.parse(req.body.images) : req.body.images;
            const imagesToDelete = existingProduct.images.filter(img => !updatedImagesList.includes(img));
            for (const url of imagesToDelete) await deleteImage(url);
            finalImages = updatedImagesList;
        } catch (e) { console.error("Image cleanup error", e); }
    }

    if (req.files && req.files.length) {
        const newUploads = await uploadMultipleImages(req.files, 'products');
        finalImages = [...finalImages, ...newUploads];
    }

    updateFields.images = finalImages;

    try {
        const validatedData = updateProductSchema.parse(updateFields);
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: validatedData },
            { returnDocument: 'after', runValidators: true }
        );
        res.json(product);
    } catch (error) {
        if (error instanceof ZodError) return handleZodError(error, res);
        throw error;
    }
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.images?.length) {
        await Promise.all(product.images.map(img => deleteImage(img)));
    }
    await product.deleteOne();
    res.json({ message: 'Product and associated assets purged.' });
});




export const getProductBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const product = await Product.findOne({ slug, isActive: true })
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
        .populate('sizes.size', 'name')
        .lean();

    if (!product) {
        return res.status(404).json({ message: 'Artifact not found in archives' });
    }

    res.json(product);
});