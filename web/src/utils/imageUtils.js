export const getImageUrl = (path, width = 800, quality = 80) => {
  if (!path) return '/images/placeholder.png';
  if (path.startsWith('http')) return path;
  if (path.startsWith('blob:') || path.startsWith('data:')) return path;
  
  // If it's a Cloudinary URL, extract public ID
  let publicId = path;
  let cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (path.includes('cloudinary.com')) {
    const urlParts = path.split('/');
    const cloudNameIndex = urlParts.indexOf('res.cloudinary.com') + 1;
    if (cloudNameIndex > 0 && urlParts[cloudNameIndex]) {
      cloudName = urlParts[cloudNameIndex];
    }

    const parts = path.split('/upload/');
    if (parts[1]) {
      const pathParts = parts[1].split('/');
      if (pathParts[0].includes('_')) {
        publicId = pathParts.slice(1).join('/');
      } else {
        publicId = parts[1];
      }
    }
  } else {
    const normalizedPath = path.replace(/^\/+/, '');
    if (normalizedPath.startsWith('uploads/')) {
      const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:5000';
      return `${imageBaseUrl}/${normalizedPath}`;
    }
    if (path.startsWith('/')) return path;
  }
  
  if (!cloudName) return path;
  
  // Cloudinary optimizations: f_auto (WebP/AVIF), q_auto (smart quality), c_limit (fit within width)
  const params = ['f_auto', 'q_auto', 'c_limit', `w_${width}`];
  if (quality && quality !== 80) params.push(`q_${quality}`);
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${params.join(',')}/${publicId}`;
};

export const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';