"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel, Navigation } from "swiper/modules";
import { getImageUrl } from "@/utils/imageUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Swiper Styles
import "swiper/css";
import "swiper/css/free-mode";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function CategoryGrid({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full overflow-hidden px-4 md:px-0 relative group/swiper">
      {/* Premium Glassmorphic Left Arrow */}
      <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md bg-white/20 dark:bg-black/30 border border-white/30 dark:border-white/10 text-white shadow-2xl opacity-0 group-hover/swiper:opacity-100 transition-all duration-300 hover:bg-white/30 dark:hover:bg-black/50 hover:scale-110 active:scale-95 disabled:opacity-0 cursor-pointer disabled:pointer-events-none">
        <ChevronLeft className="w-6 h-6 transition-transform duration-300" />
      </button>

      {/* Premium Glassmorphic Right Arrow */}
      <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md bg-white/20 dark:bg-black/30 border border-white/30 dark:border-white/10 text-white shadow-2xl opacity-0 group-hover/swiper:opacity-100 transition-all duration-300 hover:bg-white/30 dark:hover:bg-black/50 hover:scale-110 active:scale-95 disabled:opacity-0 cursor-pointer disabled:pointer-events-none">
        <ChevronRight className="w-6 h-6 transition-transform duration-300" />
      </button>

      <Swiper
        slidesPerView={1.8}
        spaceBetween={12}
        freeMode={true}
        mousewheel={{ forceToAxis: true }}
        simulateTouch={true}
        touchStartPreventDefault={false}
        touchReleaseOnEdges={true}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        modules={[FreeMode, Mousewheel, Navigation]}
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
        className="category-swiper w-full"
      >
        {categories.filter(cat => cat.slug !== 'on-sale').map((cat, idx) => (
          <SwiperSlide key={cat._id || idx}>
            <Card className="relative aspect-[4/5] md:aspect-square min-h-[200px] md:min-h-[320px] w-full rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl select-none group border-none bg-elevated transition-all duration-700 md:hover:-translate-y-2">
              <Link
                href={`/products?category=${cat.slug || cat._id}`}
                className="block w-full h-full"
                aria-label={`Browse ${cat.name} category`}
              >
                {/* Background Image with advanced hover */}
                {/* Simple Background Image */}
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={getImageUrl(cat.image, 800, 80)}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 55vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={idx < 2}
                  />
                  {/* Soft Gradient for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                </div>

                {/* Minimalist "Offer" Badge */}
                {cat.slug === 'on-sale' && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                      Offer
                    </span>
                  </div>
                )}

                {/* Minimalist Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8 z-10">
                  <div className="space-y-1">
                    <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-lg">
                      {cat.name}
                    </h3>
                    <div className="w-8 h-1 bg-accent-secondary rounded-full transform origin-left transition-transform duration-500 scale-x-50 group-hover:scale-x-100" />
                  </div>
                </div>
              </Link>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
