export const getImageUrl = (path, width = 800, quality = 80) => {
  if (!path || typeof path !== 'string') {
    return '/images/placeholder.png';
  }

  // External URLs (already absolute) or blob/data URIs – return as is
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }

  // Cloudinary URL – add transformation parameters if not already present
  if (path.includes('cloudinary.com')) {
    // If the URL already has transformations, return it unchanged
    if (path.includes('/upload/') && !path.includes('/upload/w_')) {
      const [base, rest] = path.split('/upload/');
      return `${base}/upload/w_${width},q_${quality},f_auto/${rest}`;
    }
    return path; // already has transformations or no upload segment
  }

  // Local development / uploaded files
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:5000';
  const normalizedPath = path.replace(/^\/+/, '');
  
  if (normalizedPath.startsWith('uploads/')) {
    return `${imageBaseUrl}/${normalizedPath}`;
  }
  
  return `${imageBaseUrl}/uploads/${normalizedPath}`;
};

export const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';