import mongoose from 'mongoose';

const pageSettingSchema = new mongoose.Schema({
    branding: {
        siteName: { type: String, default: "VANGUARD" },
        siteTitle: { type: String, default: "Premium Apparel" },
        headerLogo: { type: String }, 
        footerLogo: { type: String },
        favicon: { type: String },
        activeTheme: { type: String, default: "executive", enum: ["executive", "streetwear", "earth", "luxury", "cyber"] },
        // ✅ New fields for centralized control
        defaultTheme: { type: String, default: "dark", enum: ["light", "dark", "system"] }, 
        defaultThemeColor: { type: String, default: "Zinc", enum: ["Zinc", "Rose", "Blue", "Green", "Orange", "Amethyst", "Citrine", "Ruby", "Teal", "Brown"] },
        defaultLanguage: { type: String, default: "en", enum: ["en", "bn"] }
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