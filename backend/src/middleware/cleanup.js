import fs from 'fs/promises';

export const cleanupFiles = async (files) => {
  if (!files) return;
  
  const filesToDelete = Array.isArray(files) ? files : [files];
  
  for (const file of filesToDelete) {
    if (file && file.path) {
      try {
        await fs.unlink(file.path);
        console.log(`🧹 Cleaned up orphaned file: ${file.path}`);
      } catch (err) {
        console.error(`Failed to cleanup file: ${file.path}`, err.message);
      }
    }
  }
};

export const handleFileError = (req, res, next) => {
  next();
};