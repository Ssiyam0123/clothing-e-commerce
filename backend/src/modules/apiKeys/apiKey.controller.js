import ApiKey from './apiKey.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const getApiKeys = asyncHandler(async (req, res) => {
    const keys = await ApiKey.findOne().select(
        '+sslCommerz.storeId +sslCommerz.storePassword ' +
        '+bkash.appKey +bkash.appSecret +bkash.userName +bkash.password ' +
        '+pathao.clientId +pathao.clientSecret +pathao.userName +pathao.password ' +
        '+meta.accessToken ' +
        '+context7.apiKey'
    );
    res.json(keys || {});
});

export const updateApiKeys = asyncHandler(async (req, res) => {
    const updateData = {};

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
    flattenKeys(req.body.context7, 'context7');

    updateData.updatedBy = req.user._id;

    const keys = await ApiKey.findOneAndUpdate(
        {}, 
        { $set: updateData }, 
        { new: true, upsert: true, runValidators: true }
    ).select('+sslCommerz.storeId +bkash.appKey +pathao.clientId +context7.apiKey'); 

    res.json(keys);
});