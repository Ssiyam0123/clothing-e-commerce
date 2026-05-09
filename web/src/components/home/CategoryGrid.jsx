"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { getImageUrl } from "@/utils/imageUtils";

// Swiper Styles
import "swiper/css";
import "swiper/css/free-mode";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function CategoryGrid({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full overflow-hidden px-4 md:px-0">
      <Swiper
        slidesPerView={1.8}
        spaceBetween={12}
        freeMode={true}
        modules={[FreeMode]}
        breakpoints={{
          640: {
            slidesPerView: 2.2,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 3.2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4.2,
            spaceBetween: 24,
          },
        }}
        className="category-swiper"
      >
        {categories.filter(cat => cat.slug !== 'on-sale').map((cat, idx) => (
          <SwiperSlide key={cat._id || idx}>
            <Card className="relative aspect-[4/5] min-h-[200px] md:min-h-[500px] w-full rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl select-none group border-none bg-elevated">
              <Link
                href={`/products?category=${cat.slug || cat._id}`}
                className="block w-full h-full"
                aria-label={`Browse ${cat.name} category`}
              >
                {/* Background Image with advanced hover */}
                <div className="absolute inset-0 transition-all duration-[1.5s] cubic-bezier(0.4, 0, 0.2, 1) group-hover:scale-110 group-hover:rotate-1">
                  {cat.slug === 'on-sale' ? (
                    <div className="absolute inset-0 bg-rose-600/20">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500/30 via-transparent to-transparent opacity-60" />
                    </div>
                  ) : (
                    <Image
                      src={getImageUrl(cat.image, 800, 80)}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 55vw, 25vw"
                      className="object-cover grayscale-[100%] contrast-125 transition-all duration-700 group-hover:grayscale-0 group-hover:contrast-100"
                      priority={idx < 2}
                    />
                  )}
                </div>

                {/* Multi-layered Overlay */}
                <div className={cn(
                  "absolute inset-0 transition-opacity duration-700",
                  cat.slug === 'on-sale' ? "bg-gradient-to-t from-rose-950/90 via-rose-900/20 to-transparent opacity-80" : "bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40"
                )} />
                <div className={cn(
                  "absolute inset-0 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700",
                  cat.slug === 'on-sale' ? "bg-rose-500/20" : "bg-accent-primary/10"
                )} />

                {/* Content Container */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 z-10">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <div className="inline-flex items-center gap-2 mb-3">
                      <span className={cn("w-8 h-[1px]", cat.slug === 'on-sale' ? "bg-rose-500" : "bg-accent-secondary")} />
                      <span className={cn(
                        "text-[8px] md:text-[10px] font-black tracking-[0.4em]",
                        cat.slug === 'on-sale' ? "text-rose-500" : "text-accent-secondary"
                      )}>
                        {cat.slug === 'on-sale' ? "Limited Offer" : "Syndicate"}
                      </span>
                    </div>
                    
                    <div className="relative">
                      <h3 className="text-2xl md:text-5xl font-black text-white tracking-tighter leading-[0.85] italic mb-4 drop-shadow-2xl">
                        {cat.name}
                      </h3>
                      
                      {/* Interactive Button-like text */}
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 translate-x--4 group-hover:translate-x-0 transition-all duration-500 delay-100">
                        <span className="text-[10px] font-black text-white tracking-widest bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                          View Collection
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative index number */}
                <div className="absolute top-6 right-6 text-white/10 text-6xl font-black italic tracking-tighter select-none">
                  0{idx + 1}
                </div>
              </Link>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
