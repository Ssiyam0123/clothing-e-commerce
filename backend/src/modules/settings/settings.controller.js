import PageSetting from './settings.model.js';
import ApiKey from './apiKey.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { uploadImage } from '../../services/imageUploadService.js';
import { encrypt, decrypt } from '../../utils/encryption.js';
import { clearCache } from '../../middleware/cacheMiddleware.js';

export const getSettings = asyncHandler(async (req, res) => {
    let settings = await PageSetting.findOne();
    if (!settings) {
        settings = await PageSetting.create({
            branding: { siteName: "VANGUARD" },
            config: { storageMethod: 'cloudinary' },
            paymentOptions: { cod: true, online: true, bkash: true }
        });
    }

    // Fetch API Keys from separate collection
    let apiKeys = await ApiKey.findOne();
    if (!apiKeys) {
        apiKeys = await ApiKey.create({});
    }

    // Decrypt all fields and categorize them
    const apiKeysObj = apiKeys.toObject();
    const categories = {
        marketing: ['fbPixelId', 'fbAccessToken', 'fbTestEventCode', 'gtmId', 'tiktokPixelId', 'tiktokAccessToken', 'snapPixelId', 'pinterestTagId', 'googleAdsId', 'clarityId'],
        payment: ['sslStoreId', 'sslStorePassword', 'sslIsTest', 'bkashAppKey', 'bkashAppSecret', 'bkashUsername', 'bkashPassword', 'bkashIsTest'],
        smtp: ['mailHost', 'mailPort', 'mailUser', 'mailPass', 'mailFrom'],
        sms: ['smsApiKey', 'smsSenderId']
    };

    const response = { ...settings.toObject() };

    Object.keys(categories).forEach(cat => {
        response[cat] = {};
        categories[cat].forEach(key => {
            const val = apiKeysObj[key];
            if (typeof val === 'string' && val !== "") {
                response[cat][key] = decrypt(val);
            } else {
                response[cat][key] = val || (typeof val === 'boolean' ? val : "");
            }
        });
    });

    res.status(200).json(response);
});

export const updateSettings = asyncHandler(async (req, res) => {
    // Merge nested objects properly
    const updateData = {};
    
    // Parse JSON fields (if sent as strings via multipart/form-data)
    const parseField = (field) => {
        if (!req.body[field]) return undefined;
        try {
            return typeof req.body[field] === 'string' ? JSON.parse(req.body[field]) : req.body[field];
        } catch (e) {
            return req.body[field];
        }
    };

    if (req.body.branding) updateData.branding = parseField('branding');
    if (req.body.config) updateData.config = parseField('config');
    if (req.body.socialLinks) updateData.socialLinks = parseField('socialLinks');
    if (req.body.contact) updateData.contact = parseField('contact');
    if (req.body.paymentOptions) updateData.paymentOptions = parseField('paymentOptions');
    if (req.body.shipping) updateData.shipping = parseField('shipping');
    
    // Handle API Keys / Credentials (Encrypted)
    const credentialFields = ['marketing', 'smtp', 'payment', 'sms'];
    let combinedCredentials = {};
    let hasCredentials = false;

    for (const field of credentialFields) {
        const fieldData = parseField(field);
        if (fieldData) {
            hasCredentials = true;
            Object.keys(fieldData).forEach(key => {
                // Skip system fields
                if (!['_id', 'createdAt', 'updatedAt', '__v'].includes(key)) {
                    // Encrypt string values, keep others (like booleans) as is
                    if (typeof fieldData[key] === 'string' && fieldData[key].trim() !== "") {
                        combinedCredentials[key] = encrypt(fieldData[key]);
                    } else {
                        combinedCredentials[key] = fieldData[key];
                    }
                }
            });
        }
    }

    if (hasCredentials) {
        await ApiKey.findOneAndUpdate({}, combinedCredentials, { upsert: true, new: true });
    }

    // Handle Image Uploads
    const currentSettings = await PageSetting.findOne();
    let branding = parseField('branding') || (currentSettings ? JSON.parse(JSON.stringify(currentSettings.branding)) : {});

    let brandingUpdated = !!req.body.branding;

    if (req.files) {
        if (req.files.logo) {
            branding.logo = await uploadImage(req.files.logo[0], 'settings', currentSettings?.branding?.logo);
            brandingUpdated = true;
        }
        if (req.files.logoDark) {
            branding.logoDark = await uploadImage(req.files.logoDark[0], 'settings', currentSettings?.branding?.logoDark);
            brandingUpdated = true;
        }
        if (req.files.favicon) {
            branding.favicon = await uploadImage(req.files.favicon[0], 'settings', currentSettings?.branding?.favicon);
            brandingUpdated = true;
        }
    }

    if (brandingUpdated) updateData.branding = branding;

    const settings = await PageSetting.findOneAndUpdate(
        {}, 
        { $set: updateData }, 
        { new: true, upsert: true, runValidators: true }
    );

    // Clear settings cache after update (Non-blocking)
    clearCache('cache:/api/settings*');

    res.status(200).json({
        message: "Site protocol updated successfully.",
        settings
    });
});