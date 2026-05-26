import PageSetting from './settings.model.js';
import ApiKey from './apiKey.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { uploadImage } from '../../services/imageUploadService.js';
import { bustStorageConfigCache } from '../../services/imageUploadService.js';
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
        sms: ['smsApiKey', 'smsSenderId'],
        auth: ['googleClientId', 'facebookAppId'],
        cloudinary: ['cloudinaryCloudName', 'cloudinaryApiKey', 'cloudinaryApiSecret'],
        ai: ['geminiApiKey']
    };

    const response = { ...settings.toObject() };

    const isSuperAdmin = req.user && req.user.role && req.user.role.name === 'superadmin';
    const sensitiveKeys = [
        'fbAccessToken',
        'sslStorePassword',
        'bkashAppSecret',
        'bkashPassword',
        'mailPass',
        'smsApiKey',
        'cloudinaryApiSecret',
        'geminiApiKey'
    ];

    Object.keys(categories).forEach(cat => {
        response[cat] = {};
        categories[cat].forEach(key => {
            const val = apiKeysObj[key];
            let decryptedVal = "";
            if (typeof val === 'string' && val !== "") {
                decryptedVal = decrypt(val);
            } else {
                decryptedVal = val || (typeof val === 'boolean' ? val : "");
            }

            if (sensitiveKeys.includes(key)) {
                if (isSuperAdmin) {
                    response[cat][key] = decryptedVal;
                } else {
                    response[cat][key] = decryptedVal ? "••••••••••••" : "";
                }
            } else {
                response[cat][key] = decryptedVal;
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

    if (req.body.config) updateData.config = parseField('config');
    if (req.body.socialLinks) updateData.socialLinks = parseField('socialLinks');
    if (req.body.contact) updateData.contact = parseField('contact');
    if (req.body.paymentOptions) updateData.paymentOptions = parseField('paymentOptions');
    if (req.body.shipping) updateData.shipping = parseField('shipping');
    
    // Handle API Keys / Credentials (Encrypted)
    const credentialFields = ['marketing', 'smtp', 'payment', 'sms', 'auth', 'cloudinary', 'ai'];
    let combinedCredentials = {};
    let hasCredentials = false;

    for (const field of credentialFields) {
        const fieldData = parseField(field);
        if (fieldData) {
            hasCredentials = true;
            Object.keys(fieldData).forEach(key => {
                // Skip system fields
                if (['_id', 'createdAt', 'updatedAt', '__v'].includes(key)) return;

                const val = fieldData[key];

                if (typeof val === 'string') {
                    // FIX Bug 10: Skip empty strings — don't overwrite existing value with empty
                    // Empty string in form means "no change", not "clear this field"
                    // Also if we receive "••••••••••••", it means the non-superadmin or unchanged key, so don't update it!
                    if (val.trim() !== '' && val !== '••••••••••••') {
                        combinedCredentials[key] = encrypt(val.trim());
                    }
                } else if (typeof val === 'boolean') {
                    // Booleans (e.g. sslIsTest, bkashIsTest) stored as-is
                    combinedCredentials[key] = val;
                }
                // null / undefined / other types — ignored
            });
        }
    }

    if (hasCredentials) {
        await ApiKey.findOneAndUpdate({}, combinedCredentials, { upsert: true, new: true });
    }

    // Handle Image Uploads and merge branding properties safely
    const currentSettings = await PageSetting.findOne();
    let branding = currentSettings ? JSON.parse(JSON.stringify(currentSettings.branding)) : {};

    if (req.body.branding) {
        const parsedBranding = parseField('branding');
        if (parsedBranding && typeof parsedBranding === 'object') {
            branding = { ...branding, ...parsedBranding };
        }
    }

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
    // Bust image storage config cache so new Cloudinary keys take effect immediately
    bustStorageConfigCache();

    res.status(200).json({
        message: "Site protocol updated successfully.",
        settings
    });
});