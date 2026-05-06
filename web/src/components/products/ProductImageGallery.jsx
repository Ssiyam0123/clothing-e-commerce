'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/utils/imageUtils';

export default function ProductImageGallery({ images, name, discount }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col items-center">
      <div className="lg:sticky lg:top-28 w-full max-w-[620px]">
        <div className="relative aspect-[3/4] overflow-hidden lg:rounded-[3.5rem] bg-zinc-100 dark:bg-zinc-900 shadow-2xl">
          <Image
            key={selectedImage}
            src={getImageUrl(images?.[selectedImage], 1000, 85)}
            alt={name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
          />
          {discount > 0 && (
            <div className="absolute top-10 left-10 bg-rose-600 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest z-10">
              -{discount}% DROP
            </div>
          )}
        </div>
        
        {/* Thumbnails */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar w-full py-8 px-6 lg:px-0 lg:justify-center">
          {images?.map((img, idx) => (
            <button 
              key={idx} 
              onClick={() => setSelectedImage(idx)}
              className={`relative w-20 h-28 md:w-28 md:h-36 rounded-2xl overflow-hidden shadow-md shrink-0 transition-all border-2 ${
                selectedImage === idx ? 'scale-110 opacity-100 border-zinc-900 dark:border-white' : 'opacity-40 grayscale border-transparent'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={getImageUrl(img, 200, 75)}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 80px, 112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
