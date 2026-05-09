import pathaoService from '../../services/pathao.service.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

const getPathaoCreds = () => ({
    clientId: process.env.PATHAO_CLIENT_ID,
    clientSecret: process.env.PATHAO_CLIENT_SECRET,
    username: process.env.PATHAO_USERNAME,
    password: process.env.PATHAO_PASSWORD,
    baseURL: process.env.PATHAO_BASE_URL || "https://courier-api-sandbox.pathao.com",
    isActive: !!process.env.PATHAO_CLIENT_ID // Active if credentials exist
});

export const getCities = asyncHandler(async (req, res) => {
    const creds = getPathaoCreds();
    
    if (!creds.clientId) {
        return res.status(400).json({ message: 'Pathao service is not configured in environment' });
    }

    const cities = await pathaoService.getCities(creds);
    res.json(cities);
});

export const getZones = asyncHandler(async (req, res) => {
    const creds = getPathaoCreds();
    
    if (!creds.clientId) {
        return res.status(400).json({ message: 'Pathao service is offline' });
    }

    const zones = await pathaoService.getZones(req.params.cityId, creds);
    res.json(zones);
});

export const getAreas = asyncHandler(async (req, res) => {
    const creds = getPathaoCreds();
    
    if (!creds.clientId) {
        return res.status(400).json({ message: 'Pathao service is offline' });
    }

    const areas = await pathaoService.getAreas(req.params.zoneId, creds);
    res.json(areas);
});

export const getStores = asyncHandler(async (req, res) => {
    const creds = getPathaoCreds();
    
    if (!creds.clientId) {
        return res.status(400).json({ message: 'Pathao service is offline' });
    }

    if (typeof pathaoService.getStores === 'function') {
        const stores = await pathaoService.getStores(creds);
        return res.json(stores);
    }
    
    res.json({ message: 'Stores protocol successfully identified but no endpoint found.' });
});