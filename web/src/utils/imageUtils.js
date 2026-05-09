export const getImageUrl = (path, width = 800, quality = 80) => {
  if (!path) return 'https://placehold.co/800x800/222/white?text=Vanguard';
  if (path.startsWith('blob:') || path.startsWith('data:')) return path;
  
  // Cloudinary optimizations: f_auto (WebP/AVIF), q_auto (smart quality), c_limit (fit within width)
  const params = ['f_auto', 'q_auto', 'c_limit', `w_${width}`];
  if (quality && quality !== 80) params.push(`q_${quality}`);
  const paramString = params.join(',');

  // If it's already a Cloudinary URL, inject parameters
  if (path.includes('cloudinary.com')) {
    if (path.includes('/upload/')) {
      // Check if it already has parameters (e.g., /upload/v123/ or /upload/w_100/)
      const parts = path.split('/upload/');
      const afterUpload = parts[1].split('/');
      
      // If the first part after /upload/ doesn't look like a version (v123) or a folder, 
      // it might be parameters. To be safe, we always inject ours.
      return `${parts[0]}/upload/${paramString}/${parts[1]}`;
    }
    return path;
  }

  // Handle relative paths or specific uploads folder
  let publicId = path;
  let cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const normalizedPath = path.replace(/^\/+/, '');
  if (normalizedPath.startsWith('uploads/')) {
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:5000';
    return `${imageBaseUrl}/${normalizedPath}`;
  }
  if (path.startsWith('/')) return path;
  
  if (!cloudName) return path;
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${paramString}/${publicId}`;
};

export const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';