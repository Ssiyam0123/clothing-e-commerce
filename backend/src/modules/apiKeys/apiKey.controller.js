import ApiKey from './apiKey.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

// ১. এপিআই কী গেট করা (অ্যাডমিনের জন্য সব ডাটা শো করবে)
export const getApiKeys = asyncHandler(async (req, res) => {
    const keys = await ApiKey.findOne().select(
        '+sslCommerz.storeId +sslCommerz.storePassword ' +
        '+bkash.appKey +bkash.appSecret +bkash.userName +bkash.password ' +
        '+pathao.clientId +pathao.clientSecret +pathao.userName +pathao.password ' +
        '+meta.accessToken'
    );
    res.json(keys || {});
});

// ২. এপিআই কী আপডেট করা
export const updateApiKeys = asyncHandler(async (req, res) => {
    const updateData = {};

    // 🚀 অবজেক্ট গুলোকে ডট নোটেশনে রূপান্তর করা যাতে সিলেক্টিভ আপডেট হয়
    const flattenKeys = (obj, prefix) => {
        if (!obj) return;
        Object.keys(obj).forEach(key => {
            updateData[`${prefix}.${key}`] = obj[key];
        });
    };

    flattenKeys(req.body.sslCommerz, 'sslCommerz');
    flattenKeys(req.body.bkash, 'bkash');
    flattenKeys(req.body.pathao, 'pathao');
    flattenKeys(req.body.meta, 'meta');

    updateData.updatedBy = req.user._id;

    const keys = await ApiKey.findOneAndUpdate(
        {}, 
        { $set: updateData }, 
        { new: true, upsert: true, runValidators: true }
    ).select('+sslCommerz.storeId +bkash.appKey +pathao.clientId'); // জাস্ট ভেরিফিকেশনের জন্য কিছু সিক্রেট রিটার্ন

    res.json(keys);
});