"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/utils/imageUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function CategoryGrid({ categories }) {
  const scrollRef = useRef(null);

  if (!categories || categories.length === 0) return null;

  const displayCategories = categories.filter(cat => cat.slug !== 'on-sale');

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth, scrollLeft } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75; // Scroll 75% of container width
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full overflow-hidden px-4 md:px-0 relative group/swiper">
      {/* Premium Glassmorphic Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md bg-white/20 dark:bg-black/30 border border-white/30 dark:border-white/10 text-white shadow-2xl opacity-0 group-hover/swiper:opacity-100 transition-all duration-300 hover:bg-white/30 dark:hover:bg-black/50 hover:scale-110 active:scale-95 cursor-pointer"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Premium Glassmorphic Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md bg-white/20 dark:bg-black/30 border border-white/30 dark:border-white/10 text-white shadow-2xl opacity-0 group-hover/swiper:opacity-100 transition-all duration-300 hover:bg-white/30 dark:hover:bg-black/50 hover:scale-110 active:scale-95 cursor-pointer"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-3 md:gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory scroll-smooth w-full"
      >
        {displayCategories.map((cat, idx) => (
          <div
            key={cat._id || idx}
            className="w-[55%] sm:w-[45%] md:w-[30%] lg:w-[22%] shrink-0 snap-start"
          >
            <Card className="relative aspect-[4/5] md:aspect-square min-h-[200px] md:min-h-[320px] w-full rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl select-none group border-none bg-elevated transition-all duration-700 md:hover:-translate-y-2">
              <Link
                href={`/products?category=${cat.slug || cat._id}`}
                className="block w-full h-full"
                aria-label={`Browse ${cat.name} category`}
              >
                {/* Background Image with advanced hover */}
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
          </div>
        ))}
      </div>
    </div>
  );
}
