import PageSetting from './settings.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { uploadImage } from '../../services/imageUploadService.js';

export const getSettings = asyncHandler(async (req, res) => {
    let settings = await PageSetting.findOne();
    if (!settings) {
        settings = await PageSetting.create({
            branding: { siteName: "VANGUARD" },
            config: { storageMethod: 'cloudinary' },
            paymentOptions: { cod: true, online: true, bkash: true }
        });
    }
    res.status(200).json(settings);
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

    // Handle Image Uploads
    const currentSettings = await PageSetting.findOne();
    let branding = parseField('branding') || (currentSettings ? JSON.parse(JSON.stringify(currentSettings.branding)) : {});

    let brandingUpdated = !!req.body.branding;

    if (req.files) {
        if (req.files.headerLogoLight) {
            branding.headerLogoLight = await uploadImage(req.files.headerLogoLight[0], 'settings', currentSettings?.branding?.headerLogoLight);
            brandingUpdated = true;
        }
        if (req.files.headerLogoDark) {
            branding.headerLogoDark = await uploadImage(req.files.headerLogoDark[0], 'settings', currentSettings?.branding?.headerLogoDark);
            brandingUpdated = true;
        }
        if (req.files.footerLogoLight) {
            branding.footerLogoLight = await uploadImage(req.files.footerLogoLight[0], 'settings', currentSettings?.branding?.footerLogoLight);
            brandingUpdated = true;
        }
        if (req.files.footerLogoDark) {
            branding.footerLogoDark = await uploadImage(req.files.footerLogoDark[0], 'settings', currentSettings?.branding?.footerLogoDark);
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
    res.status(200).json({
        message: "Site protocol updated successfully.",
        settings
    });
});