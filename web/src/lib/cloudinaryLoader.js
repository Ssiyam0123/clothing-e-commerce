export default function cloudinaryLoader({ src, width, quality }) {
  // Cloudinary optimizations: f_auto (WebP/AVIF), q_auto (smart quality), c_limit (fit within width)
  const params = ['f_auto', 'q_auto', 'c_limit', `w_${width}`];
  if (quality && quality !== 'auto') params.push(`q_${quality}`);
  
  // If it's a local path or not a Cloudinary public ID/URL, return as is but handle local uploads
  if (src.startsWith('http') && !src.includes('cloudinary.com')) {
    // If it's a local upload, we can't resize it easily without a proxy, 
    // but we return it to satisfy Next.js that we're "handling" the width.
    return src;
  }

  const normalizedPath = src.replace(/^\/+/, '');
  if (normalizedPath.startsWith('uploads/')) {
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:5000';
    // Even if we can't resize locally, returning the URL as is is fine 
    // but Next.js prefers we know about the width.
    return `${imageBaseUrl}/${normalizedPath}`;
  }

  if (src.startsWith('/') && !src.includes('cloudinary.com')) return src;
  if (src.startsWith('blob:') || src.startsWith('data:')) return src;

  let path = src;
  let cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (src.includes('cloudinary.com')) {
    const urlParts = src.split('/');
    const cloudNameIndex = urlParts.indexOf('res.cloudinary.com') + 1;
    if (cloudNameIndex > 0 && urlParts[cloudNameIndex]) {
      cloudName = urlParts[cloudNameIndex];
    }

    path = src.split('/upload/')[1] || src;
    const pathParts = path.split('/');
    if (pathParts[0].includes('_')) {
      path = pathParts.slice(1).join('/');
    }
  }
  
  if (!cloudName) return src;
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${params.join(',')}/${path}`;
};
