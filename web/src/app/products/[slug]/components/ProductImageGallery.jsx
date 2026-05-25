"use client";

import { useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/utils/imageUtils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ImageOff } from "lucide-react";

export default function ProductImageGallery({ images, name, discount, isFeatured }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col items-center w-full min-w-0 overflow-hidden">
      <div className="lg:sticky lg:top-32 w-full min-w-0">
        {/* Main Display Engine */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-accent/20 shadow-2xl group cursor-crosshair">
          {images && images.length > 0 ? (
            <Image
              key={selectedImage}
              src={getImageUrl(images[selectedImage], 1200, 85)}
              alt={name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              className="object-cover transition-all duration-1000 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-accent/5 text-muted-foreground/30">
              <ImageOff size={64} strokeWidth={1} />
            </div>
          )}
          
          {/* Glass Overlay Elements */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Image Navigation Dots (Mobile) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 lg:hidden">
             {images?.map((_, idx) => (
               <div 
                key={idx} 
                className={cn(
                  "h-1 transition-all duration-500 rounded-full",
                  selectedImage === idx ? "w-8 bg-white" : "w-2 bg-white/30"
                )} 
               />
             ))}
          </div>
        </div>

        {/* Thumbnail Sequence */}
        <div className="mt-8 flex gap-4 overflow-x-auto no-scrollbar w-full py-4 lg:px-0">
          {images?.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={cn(
                "relative aspect-[3/4] h-24 md:h-32 rounded-2xl overflow-hidden shadow-lg shrink-0 transition-all duration-500 border-2",
                selectedImage === idx
                  ? "scale-105 border-accent-secondary opacity-100 ring-4 ring-accent-secondary/10"
                  : "opacity-40 grayscale hover:opacity-70 hover:grayscale-0 border-transparent"
              )}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={getImageUrl(img, 300, 75)}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
