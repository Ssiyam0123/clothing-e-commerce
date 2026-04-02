// src/services/imageUploadService.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storageType = (process.env.STORAGE_TYPE || 'cloudinary').toLowerCase().trim();

// --- CLOUDINARY CONFIGURATION ---
if (storageType === 'cloudinary') {
    // ডিবাগিংয়ের জন্য চেক: যদি ভেরিয়েবল না থাকে তবে আগেই ওয়ার্নিং দেবে
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error("❌ Cloudinary Error: Credentials missing in .env file!");
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

console.log(`\x1b[36m%s\x1b[0m`, `📦 Image Storage Strategy: ${storageType.toUpperCase()}`);

/**
 * Cloudinary Buffer Upload
 */
const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
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

    if (storageType === 'cloudinary' && imageUrl.includes('cloudinary.com')) {
        try {
            const parts = imageUrl.split('/');
            const fileNameWithExt = parts.pop();
            const folderPart = parts.slice(parts.indexOf('ecowear')).join('/');
            const publicId = `${folderPart}/${fileNameWithExt.split('.')[0]}`;
            
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

    if (storageType === 'cloudinary') {
        return await uploadToCloudinary(file.buffer, folder);
    } else {
        return await saveToLocal(file.buffer, folder, file.originalname);
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