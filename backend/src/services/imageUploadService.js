import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import PageSetting from '../modules/settings/settings.model.js';
import ApiKey from '../modules/settings/apiKey.model.js';
import { decrypt } from '../utils/encryption.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storageType = (process.env.STORAGE_TYPE || 'cloudinary').toLowerCase().trim();

// --- CLOUDINARY CONFIGURATION ---
if (storageType === 'cloudinary') {

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error("❌ Cloudinary Error: Credentials missing in .env file!");
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

// FIX Issue 13: In-memory cache for storage config (60s TTL) — avoids 2 DB queries per upload
let _configCache = null;
let _configCacheTime = 0;
const CONFIG_CACHE_TTL_MS = 60 * 1000; // 60 seconds

const getStorageConfig = async () => {
    const now = Date.now();
    if (_configCache && (now - _configCacheTime) < CONFIG_CACHE_TTL_MS) {
        return _configCache;
    }

    try {
        const settings = await PageSetting.findOne();
        const apiKeys = await ApiKey.findOne();

        let storageType = 'cloudinary';
        if (settings && settings.config && settings.config.storageMethod) {
            storageType = settings.config.storageMethod === 'server' ? 'local' : 'cloudinary';
        } else if (process.env.STORAGE_TYPE) {
            storageType = process.env.STORAGE_TYPE.toLowerCase().trim() === 'server' ? 'local' : 'cloudinary';
        }

        let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        let apiKey = process.env.CLOUDINARY_API_KEY;
        let apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (apiKeys) {
            if (apiKeys.cloudinaryCloudName) {
                const decCloudName = decrypt(apiKeys.cloudinaryCloudName);
                if (decCloudName) cloudName = decCloudName;
            }
            if (apiKeys.cloudinaryApiKey) {
                const decApiKey = decrypt(apiKeys.cloudinaryApiKey);
                if (decApiKey) apiKey = decApiKey;
            }
            if (apiKeys.cloudinaryApiSecret) {
                const decApiSecret = decrypt(apiKeys.cloudinaryApiSecret);
                if (decApiSecret) apiSecret = decApiSecret;
            }
        }

        _configCache = { storageType, cloudName, apiKey, apiSecret };
        _configCacheTime = now;
        return _configCache;
    } catch (err) {
        console.error("❌ Error loading storage configuration from DB, falling back to ENV:", err.message);
        return {
            storageType: (process.env.STORAGE_TYPE || 'cloudinary').toLowerCase().trim() === 'server' ? 'local' : 'cloudinary',
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            apiSecret: process.env.CLOUDINARY_API_SECRET
        };
    }
};

// Exported so admin settings update can bust the cache immediately
export const bustStorageConfigCache = () => {
    _configCache = null;
    _configCacheTime = 0;
};

console.log(`\x1b[36m%s\x1b[0m`, `📦 Image Storage Strategy: ${storageType.toUpperCase()}`);

/**
 * Cloudinary Buffer Upload
 */
const uploadToCloudinary = (fileBuffer, folder, config) => {
    return new Promise((resolve, reject) => {
        cloudinary.config({
            cloud_name: config.cloudName,
            api_key: config.apiKey,
            api_secret: config.apiSecret,
        });

        const uploadStream = cloudinary.uploader.upload_stream(
            { 
                folder: `ecowear/${folder}`,
                resource_type: "auto"
            },
            (error, result) => {
                if (error) {
                    console.error("❌ Cloudinary API Error:", error.message);
                    return reject(error);
                }
                resolve(result.secure_url);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

/**
 * Local File Save
 */
const saveToLocal = async (fileBuffer, folder, originalname) => {
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(originalname)}`;
    const relativeDir = `uploads/${folder}`;
    const fullDirPath = path.join(process.cwd(), relativeDir);
    
    await fs.mkdir(fullDirPath, { recursive: true });
    
    const fullPath = path.join(fullDirPath, fileName);
    await fs.writeFile(fullPath, fileBuffer);
    
    return `/${relativeDir}/${fileName}`; 
};

/**
 * DELETE Logic
 */
export const deleteImage = async (imageUrl) => {
    if (!imageUrl) return;

    const config = await getStorageConfig();

    if (config.storageType === 'cloudinary' && imageUrl.includes('cloudinary.com')) {
        try {
            const parts = imageUrl.split('/');
            const fileNameWithExt = parts.pop();
            const folderPart = parts.slice(parts.indexOf('ecowear')).join('/');
            const publicId = `${folderPart}/${fileNameWithExt.split('.')[0]}`;
            
            cloudinary.config({
                cloud_name: config.cloudName,
                api_key: config.apiKey,
                api_secret: config.apiSecret,
            });

            await cloudinary.uploader.destroy(publicId);
            console.log(`✅ Cloudinary asset purged: ${publicId}`);
        } catch (err) {
            console.error(`❌ Cloudinary delete failed:`, err.message);
        }
    } else if (imageUrl.startsWith('/uploads')) {
        try {
            const relativePath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
            const fullPath = path.join(process.cwd(), relativePath);
            await fs.access(fullPath);
            await fs.unlink(fullPath);
            console.log(`✅ Local file purged: ${fullPath}`);
        } catch (err) {
            console.warn(`⚠️ Local delete skipped: ${imageUrl}`);
        }
    }
};

/**
 * Main Upload Function
 */
export const uploadImage = async (file, folder, oldUrl = null) => {
    if (!file || !file.buffer) return null;

    if (oldUrl) await deleteImage(oldUrl);

    let processedBuffer = file.buffer;
    let processedName = file.originalname;

    try {
        console.log(`[Image Processing] Reading uploaded image: ${file.originalname} (${file.size || file.buffer.length} bytes)`);
        const sharp = (await import('sharp')).default;
        
        const isLogoOrFavicon = folder === 'settings';
        const enableBgRemoval = process.env.ENABLE_BG_REMOVAL === 'true';
        
        if (isLogoOrFavicon && enableBgRemoval) {
            console.log(`[Image Processing] Site setting logo/favicon detected. Automatically removing background using AI (Isolated Process)...`);
            try {
                const tempDir = path.join(__dirname, '../../temp');
                await fs.mkdir(tempDir, { recursive: true });
                
                const tempInput = path.join(tempDir, `input_${Date.now()}_${Math.random().toString(36).substring(7)}.png`);
                const tempOutput = path.join(tempDir, `output_${Date.now()}_${Math.random().toString(36).substring(7)}.png`);
                
                await fs.writeFile(tempInput, processedBuffer);
                
                const runnerPath = path.join(__dirname, 'bgRemoverRunner.js');
                const { exec } = await import('child_process');
                const util = await import('util');
                const execPromise = util.promisify(exec);
                
                console.log(`[Image Processing] Executing isolated background remover process...`);
                await execPromise(`node "${runnerPath}" "${tempInput}" "${tempOutput}"`);
                
                processedBuffer = await fs.readFile(tempOutput);
                console.log(`[Image Processing] AI Background removal completed successfully.`);
                
                // Cleanup temp files asynchronously
                fs.unlink(tempInput).catch(() => {});
                fs.unlink(tempOutput).catch(() => {});
            } catch (err) {
                console.error("❌ [Image Processing] AI Background removal failed, uploading original background:", err.message);
            }
        }

        const isPng = file.mimetype === 'image/png' || file.mimetype === 'image/webp' || file.originalname.endsWith('.png') || file.originalname.endsWith('.webp') || isLogoOrFavicon;
        const MAX_WIDTH = 1200;
        
        let sharpInstance = sharp(processedBuffer).resize({ width: MAX_WIDTH, withoutEnlargement: true });
        
        if (isPng) {
            console.log(`[Image Processing] Compressing as PNG using sharp`);
            processedBuffer = await sharpInstance
                .png({ compressionLevel: 8 })
                .toBuffer();
            processedName = path.basename(file.originalname, path.extname(file.originalname)) + '.png';
        } else {
            console.log(`[Image Processing] Compressing as JPEG using sharp`);
            processedBuffer = await sharpInstance
                .jpeg({ quality: 80, mozjpeg: true })
                .toBuffer();
            processedName = path.basename(file.originalname, path.extname(file.originalname)) + '.jpg';
        }
        
        const originalSize = file.size || file.buffer.length;
        console.log(`[Image Processing] Compressed size: ${processedBuffer.length} bytes (Saved ${Math.round((originalSize - processedBuffer.length) / originalSize * 100)}%)`);
    } catch (e) {
        console.error("❌ [Image Processing] Failed to compress image using sharp, falling back to original:", e.message);
    }

    const config = await getStorageConfig();

    if (config.storageType === 'cloudinary') {
        return await uploadToCloudinary(processedBuffer, folder, config);
    } else {
        return await saveToLocal(processedBuffer, folder, processedName);
    }
};

/**
 * Multiple Uploads
 */
export const uploadMultipleImages = async (files, folder, oldUrls = []) => {
    if (!files || files.length === 0) return [];

    if (oldUrls.length > 0) {
        await Promise.all(oldUrls.map(url => deleteImage(url)));
    }

    const uploadPromises = files.map(file => uploadImage(file, folder));
    return await Promise.all(uploadPromises);
};