"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, A11y } from "swiper/modules";
import { getImageUrl } from "@/utils/imageUtils";
import { useSettings } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function HeroSection({ slides = [], ui = {}, lang = "en" }) {
  const isBn = lang === "bn";
  const { settings } = useSettings();
  const siteName = settings?.branding?.siteName || "VANGUARD";

  if (!slides || slides.length === 0) {
    return (
      <section
        className="relative h-[75vh] min-h-[500px] md:h-[85vh] md:min-h-[700px] bg-background flex items-center justify-center overflow-hidden"
        aria-label="Loading hero section"
      >
        <div className="relative z-10 w-full max-w-4xl px-8 md:px-16 flex flex-col items-center gap-6">
          <Skeleton className="h-20 w-3/4 rounded-theme opacity-20" />
          <Skeleton className="h-6 w-1/2 rounded-theme opacity-20" />
          <Skeleton className="h-14 w-40 rounded-theme opacity-20 mt-4" />
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative h-[75vh] min-h-[500px] md:h-[85vh] md:min-h-[700px] overflow-hidden bg-background"
      aria-label="Hero carousel"
    >
      <Swiper
        modules={[Autoplay, Pagination, EffectFade, A11y]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        loop={slides.length > 1}
        className="h-full w-full"
        a11y={{
          enabled: true,
          prevSlideMessage: "Previous slide",
          nextSlideMessage: "Next slide",
          firstSlideMessage: "This is the first slide",
          lastSlideMessage: "This is the last slide",
          paginationBulletMessage: "Go to slide {{index}}",
        }}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={slide._id || idx}>
            <div className="relative h-full w-full group">
              <Image
                src={getImageUrl(slide.image, 1920, 85)}
                alt={slide.title || "Campaign banner"}
                fill
                priority={idx === 0}
                fetchPriority={idx === 0 ? "high" : "auto"}
                sizes="100vw"
                className="object-cover object-center transition-transform duration-[15s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent h-full" />

              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 lg:px-24 pb-20 md:pb-28 z-10">
                <div className="max-w-4xl space-y-6">
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Badge variant="outline" className="border-accent-secondary text-accent-secondary rounded-full px-4 py-1 text-[10px] uppercase font-black tracking-widest bg-black/20 backdrop-blur-md">
                      {isBn ? "নতুন কালেকশন" : "New Collection"}
                    </Badge>
                  </div>
                  
                  {slide.title && (
                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                      {slide.title}
                    </h1>
                  )}
                  
                  {slide.subtitle && (
                    <p className="text-sm md:text-xl text-zinc-200 font-medium tracking-wide animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 max-w-2xl">
                      {slide.subtitle}
                    </p>
                  )}
                  
                  {slide.link && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 pt-4">
                      <Button
                        asChild
                        className={`inline-flex items-center justify-center bg-white text-black px-10 py-6 md:px-12 md:py-8 rounded-theme font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-zinc-100 hover:scale-105 transition-all active:scale-95 shadow-2xl border-none h-auto ${
                          isBn ? "font-sans font-bold" : ""
                        }`}
                      >
                        <Link
                          href={slide.link}
                          aria-label={ui.heroBtn || "Explore Collection"}
                        >
                          {ui.heroBtn || "Explore Collection"}
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
