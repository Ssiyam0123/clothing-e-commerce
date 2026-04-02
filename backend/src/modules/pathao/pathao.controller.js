import pathaoService from '../../services/pathao.service.js';
import ApiKey from '../apiKeys/apiKey.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

/**
 * 🚀 প্রো-টিপ: প্রতিটি হিডেন ফিল্ড আলাদাভাবে সিলেক্ট করতে হয় (+pathao.field)
 * নাহলে মঙ্গুজ শুধু অবজেক্টটা দেয় কিন্তু ভেতরের সিক্রেটগুলো দেয় না।
 */
const PATHAO_SELECTION = '+pathao.clientId +pathao.clientSecret +pathao.userName +pathao.password +pathao.baseURL';

export const getCities = asyncHandler(async (req, res) => {
    const keys = await ApiKey.findOne().select(PATHAO_SELECTION);
    
    if (!keys?.pathao?.isActive) {
        return res.status(400).json({ message: 'Pathao service is not active in the Vault' });
    }

    // ডাটাবেজে baseURL না থাকলে স্যান্ডবক্স ডিফল্ট ইউজ করা হবে
    const creds = {
        ...keys.pathao.toObject(),
        baseURL: keys.pathao.baseURL || "https://courier-api-sandbox.pathao.com"
    };

    const cities = await pathaoService.getCities(creds);
    res.json(cities);
});

export const getZones = asyncHandler(async (req, res) => {
    const keys = await ApiKey.findOne().select(PATHAO_SELECTION);
    
    if (!keys?.pathao?.isActive) {
        return res.status(400).json({ message: 'Pathao service is offline' });
    }

    const creds = {
        ...keys.pathao.toObject(),
        baseURL: keys.pathao.baseURL || "https://courier-api-sandbox.pathao.com"
    };

    const zones = await pathaoService.getZones(req.params.cityId, creds);
    res.json(zones);
});

export const getAreas = asyncHandler(async (req, res) => {
    const keys = await ApiKey.findOne().select(PATHAO_SELECTION);
    
    if (!keys?.pathao?.isActive) {
        return res.status(400).json({ message: 'Pathao service is offline' });
    }

    const creds = {
        ...keys.pathao.toObject(),
        baseURL: keys.pathao.baseURL || "https://courier-api-sandbox.pathao.com"
    };

    const areas = await pathaoService.getAreas(req.params.zoneId, creds);
    res.json(areas);
});

export const getStores = asyncHandler(async (req, res) => {
    const keys = await ApiKey.findOne().select(PATHAO_SELECTION);
    
    if (!keys?.pathao?.isActive) {
        return res.status(400).json({ message: 'Pathao service is offline' });
    }

    const creds = {
        ...keys.pathao.toObject(),
        baseURL: keys.pathao.baseURL || "https://courier-api-sandbox.pathao.com"
    };

    // যদি তোর সার্ভিসে getStores মেথড থাকে তবে এটা কাজ করবে
    if (typeof pathaoService.getStores === 'function') {
        const stores = await pathaoService.getStores(creds);
        return res.json(stores);
    }
    
    res.json({ message: 'Stores protocol successfully identified but no endpoint found.' });
});