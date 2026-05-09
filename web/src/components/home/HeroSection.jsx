"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/utils/imageUtils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function HeroSection({ slides = [], ui = {}, lang = "en", showHeader = true }) {
  const [mounted, setMounted] = useState(false);
  const isBn = lang === "bn";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use the first slide only as per user request
  const slide = slides[0];

  if (!mounted || !slide) {
    return (
      <section
        className="relative h-[50vh] min-h-[400px] md:h-[85vh] md:min-h-[700px] bg-background flex items-center justify-center overflow-hidden"
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
      className="relative h-[50vh] min-h-[400px] md:h-[85vh] md:min-h-[700px] overflow-hidden bg-background"
      aria-label="Hero section"
    >
      <div className="relative h-full w-full group">
        <img
          src={getImageUrl(slide.image, 1920, 85)}
          alt={slide.title || "Campaign banner"}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[15s] ease-out group-hover:scale-105"
          loading="eager"
        />
        {showHeader && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-[5] transition-opacity duration-700" />
        )}

        {showHeader && (
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-16 lg:px-24 pb-16 md:pb-28 z-10">
            <div className="max-w-4xl space-y-6">
              
              {slide.title && (
                <h1 className={cn(
                  "text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9]",
                  mounted && "animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100"
                )}>
                  {slide.title}
                </h1>
              )}
              
              {slide.subtitle && (
                <p className={cn(
                  "text-sm md:text-xl text-zinc-200 font-medium tracking-wide max-w-2xl",
                  mounted && "animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200"
                )}>
                  {slide.subtitle}
                </p>
              )}
              
              {slide.link && ui.heroBtn && (
                <div className={cn(mounted && "animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 pt-4")}>
                  <Button
                    asChild
                    className={cn(
                      "inline-flex items-center justify-center bg-white text-black px-10 py-6 md:px-12 md:py-8 rounded-theme font-black text-[10px] md:text-xs tracking-[0.2em] hover:bg-zinc-100 hover:scale-105 transition-all active:scale-95 shadow-2xl border-none h-auto",
                      isBn && "font-sans font-bold"
                    )}
                  >
                    <Link
                      href={slide.link}
                      aria-label={ui.heroBtn}
                    >
                      {ui.heroBtn}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
