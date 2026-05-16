"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { getImageUrl } from "@/utils/imageUtils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Swiper Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

/**
 * 🎨 Premium Banner Slider Component
 * Supports multiple images with auto-sliding, fade effects, and interactive overlays.
 */
export default function BannerSlider({ slides = [], buttonText = "Shop Now", lang = "en", showHeader = false }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative aspect-[16/9] md:aspect-[21/9] lg:aspect-[21/7] overflow-hidden bg-zinc-900" />
    );
  }

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden group/slider" aria-label="Main Banner Slider">
      <Swiper
        key={slides.length}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          el: '.custom-pagination',
        }}
        navigation={{
          nextEl: '.slider-next',
          prevEl: '.slider-prev',
        }}
        loop={slides.length > 1}
        grabCursor={true}
        className="banner-swiper h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative aspect-[16/9] md:aspect-[21/9] lg:aspect-[21/7] overflow-hidden bg-black">
              {slide.link ? (
                <Link href={slide.link} className="block w-full h-full">
                  <Image
                    src={getImageUrl(slide.image, 1920, 100)}
                    alt={slide.title || "Banner Image"}
                    fill
                    priority={idx === 0}
                    sizes="100vw"
                    className="object-cover object-center transition-transform duration-[10s] ease-out group-hover/slider:scale-105"
                    quality={100}
                  />
                </Link>
              ) : (
                <Image
                  src={getImageUrl(slide.image, 1920, 100)}
                  alt={slide.title || "Banner Image"}
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className="object-cover object-center transition-transform duration-[10s] ease-out group-hover/slider:scale-105"
                  quality={100}
                />
              )}
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation & Pagination UI */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            <div className="custom-pagination flex gap-2" />
          </div>
        )}
      </Swiper>

      <style jsx global>{`
        .banner-swiper .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.3;
          width: 8px !important;
          height: 8px !important;
          transition: all 0.5s ease;
        }
        .banner-swiper .swiper-pagination-bullet-active {
          background: #fff !important;
          opacity: 1;
          width: 40px !important;
          border-radius: 4px !important;
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}

function ArrowRight({ size, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
