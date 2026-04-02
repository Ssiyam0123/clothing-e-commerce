import mongoose from 'mongoose';

const pageSettingSchema = new mongoose.Schema({
    branding: {
        siteName: { type: String, default: "VANGUARD" },
        siteTitle: { type: String, default: "Premium Apparel" },
        headerLogo: { type: String }, 
        footerLogo: { type: String },
        favicon: { type: String }
    },
    socialLinks: [{
        platform: { type: String }, 
        url: { type: String },
        icon: { type: String },
        isActive: { type: Boolean, default: true }
    }],
    config: {
        storageMethod: { type: String, enum: ['cloudinary', 'server'], default: 'cloudinary' },
        maintenanceMode: { type: Boolean, default: false }
    },
    navigation: [{
        label: { type: String },
        url: { type: String },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true }
    }],
    contact: {
        phone: String,
        email: String,
        address: String,
        whatsapp: String
    },
    // ✅ New: Payment method toggles
    paymentOptions: {
        cod: { type: Boolean, default: true },
        online: { type: Boolean, default: true },
        bkash: { type: Boolean, default: true }
    }
}, { timestamps: true });

const PageSetting = mongoose.model('PageSetting', pageSettingSchema);
export default PageSetting;