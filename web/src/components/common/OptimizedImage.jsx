'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getImageUrl } from '@/utils/imageUtils';

export default function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false 
}) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`w-full h-full bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center ${className}`}>
        <span className="text-4xl grayscale opacity-20">👕</span>
      </div>
    );
  }

  return (
    <Image
      src={getImageUrl(src)}
      alt={alt || 'Image'}
      fill
      priority={priority}
      sizes={sizes}
      className={`object-cover transition-opacity duration-500 ${className}`}
      onError={() => setHasError(true)} 
    />
  );
}