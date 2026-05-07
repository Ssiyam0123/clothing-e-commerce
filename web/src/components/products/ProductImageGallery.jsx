"use client";

import { useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/utils/imageUtils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function ProductImageGallery({ images, name, discount, isFeatured }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="lg:sticky lg:top-32 w-full">
        {/* Main Display Engine */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-accent/20 shadow-2xl group cursor-crosshair">
          <Image
            key={selectedImage}
            src={getImageUrl(images?.[selectedImage], 1200, 85)}
            alt={name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            className="object-cover transition-all duration-1000 group-hover:scale-110"
          />
          
          {/* Glass Overlay Elements */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute top-8 left-8 md:top-12 md:left-12 flex flex-col gap-3 z-10">
            {discount > 0 && (
              <Badge className="bg-accent-secondary text-white border-none px-6 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] shadow-2xl">
                -{discount}% ARTIFACT DROP
              </Badge>
            )}
            {isFeatured && (
              <Badge className="bg-amber-500 text-black border-none px-6 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] shadow-2xl">
                Featured Artifact
              </Badge>
            )}
          </div>

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
