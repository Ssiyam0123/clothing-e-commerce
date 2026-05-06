'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/utils/imageUtils';

export default function ProductImageGallery({ images, name, discount }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      <div className="lg:sticky lg:top-28 w-full max-w-[620px]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] lg:rounded-[3.5rem] bg-zinc-100 dark:bg-zinc-900 shadow-2xl mx-auto">
          <Image
            key={selectedImage}
            src={getImageUrl(images?.[selectedImage], 1000, 85)}
            alt={name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            className="object-cover transition-all duration-1000"
          />
          {discount > 0 && (
            <div className="absolute top-6 left-6 md:top-10 md:left-10 bg-rose-600 text-white px-4 py-1.5 md:px-5 md:py-2 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest z-10">
              -{discount}% DROP
            </div>
          )}
        </div>
        
        {/* Thumbnails */}
        <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar w-full py-6 md:py-8 px-4 lg:px-0 lg:justify-center">
          {images?.map((img, idx) => (
            <button 
              key={idx} 
              onClick={() => setSelectedImage(idx)}
              className={`relative aspect-[3/4] h-20 md:h-28 lg:h-32 rounded-xl md:rounded-2xl overflow-hidden shadow-md shrink-0 transition-all border-2 ${
                selectedImage === idx ? 'scale-105 opacity-100 border-zinc-900 dark:border-white' : 'opacity-40 grayscale border-transparent'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={getImageUrl(img, 200, 75)}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
