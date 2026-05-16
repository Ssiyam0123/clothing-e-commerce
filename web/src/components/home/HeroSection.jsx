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

export default function HeroSection({ slides = [], ui = {}, lang = "en", showHeader = true }) {
  const [mounted, setMounted] = useState(false);
  const isBn = lang === "bn";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative aspect-[16/9] md:aspect-[16/7] overflow-hidden bg-black">
         <div className="relative z-10 w-full max-w-4xl px-8 md:px-16 flex flex-col items-center gap-6 h-full justify-center">
            <Skeleton className="h-12 w-3/4 rounded-theme opacity-20" />
            <Skeleton className="h-4 w-1/2 rounded-theme opacity-20" />
         </div>
      </div>
    );
  }

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden" aria-label="Hero section">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop={slides.length > 1}
        className="hero-swiper h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative aspect-[16/9] md:aspect-[16/7] overflow-hidden bg-black group">
              <Image
                src={getImageUrl(slide.image, 1920, 100)}
                alt={slide.title || "Campaign banner"}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover object-center transition-transform duration-[15s] ease-out group-hover:scale-105"
                quality={100}
              />
              
              {showHeader && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-[5]" />
              )}

              {showHeader && (
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-16 lg:px-24 pb-8 md:pb-20 z-10">
                  <div className="max-w-4xl space-y-3 md:space-y-6">
                    {slide.title && (
                      <h1 className="text-2xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        {slide.title}
                      </h1>
                    )}
                    
                    {slide.subtitle && (
                      <p className="text-[10px] md:text-xl text-zinc-200 font-medium tracking-wide max-w-2xl line-clamp-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        {slide.subtitle}
                      </p>
                    )}
                    
                    {slide.link && ui.heroBtn && (
                      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 pt-1 md:pt-4">
                        <Button
                          asChild
                          className={cn(
                            "inline-flex items-center justify-center bg-white text-black px-6 py-3 md:px-12 md:py-8 rounded-theme font-black text-[8px] md:text-xs tracking-[0.2em] hover:bg-zinc-100 hover:scale-105 transition-all active:scale-95 shadow-2xl border-none h-auto",
                            isBn && "font-sans font-bold"
                          )}
                        >
                          <Link href={slide.link} aria-label={ui.heroBtn}>
                            {ui.heroBtn}
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .hero-swiper .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background: white !important;
          opacity: 1;
          width: 24px !important;
          border-radius: 4px !important;
        }
      `}</style>
    </section>
  );
}
