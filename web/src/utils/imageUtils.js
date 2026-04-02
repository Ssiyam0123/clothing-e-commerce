
export const getImageUrl = (path) => {
  if (!path || typeof path !== 'string') {
    return '/images/placeholder.png'; 
  }

  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }

  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:5000';
  
  const normalizedPath = path.replace(/^\/+/, '');
  
  if (normalizedPath.startsWith('uploads/')) {
    return `${imageBaseUrl}/${normalizedPath}`;
  }
  
  return `${imageBaseUrl}/uploads/${normalizedPath}`;
};

export const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';