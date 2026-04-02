import PageSetting from './settings.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

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
    if (req.body.branding) updateData.branding = req.body.branding;
    if (req.body.config) updateData.config = req.body.config;
    if (req.body.socialLinks) updateData.socialLinks = req.body.socialLinks;
    if (req.body.navigation) updateData.navigation = req.body.navigation;
    if (req.body.contact) updateData.contact = req.body.contact;
    if (req.body.paymentOptions) updateData.paymentOptions = req.body.paymentOptions;

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