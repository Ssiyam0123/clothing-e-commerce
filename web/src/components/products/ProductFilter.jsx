"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { getImageUrl } from "@/utils/imageUtils";
import FilterBar from "@/components/common/FilterBar";
import { useTrackingStore } from "@/store/trackingStore";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function ProductFilter({ initialCategories }) {
  const { filters, setSearch, setSort, setCategory } = useProducts();
  const { categories } = useCategories(initialCategories);
  const trackSearch = useTrackingStore((state) => state.trackSearch);

  const sliderRef = useRef(null);
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  const handleMouseDown = (e) => {
    dragState.current.isDragging = true;
    dragState.current.startX = e.pageX - sliderRef.current.offsetLeft;
    dragState.current.scrollLeft = sliderRef.current.scrollLeft;

    if (sliderRef.current) {
      sliderRef.current.style.cursor = "grabbing";
      sliderRef.current.style.transform = "scale(0.995)";
    }
  };

  const handleMouseLeaveOrUp = () => {
    dragState.current.isDragging = false;
    if (sliderRef.current) {
      sliderRef.current.style.cursor = "grab";
      sliderRef.current.style.transform = "scale(1)";
    }
  };

  const handleMouseMove = (e) => {
    if (!dragState.current.isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - dragState.current.startX) * 2;
    sliderRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const handleSearchSubmit = useCallback(
    (val) => {
      if (val && val.trim().length > 1) {
        trackSearch(
          val.trim(),
          filters.category !== "all" ? filters.category : null,
        );
      }
    },
    [trackSearch, filters.category],
  );

  const handleCategoryUpdate = useCallback(
    (slug, name) => {
      setCategory(slug);
      if (slug !== "all") {
        trackSearch(null, name);
      }
    },
    [setCategory, trackSearch],
  );

  return (
    <div className="mb-16 space-y-10" aria-label="Product filters">
      <FilterBar
        search={filters.search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        sort={filters.sort}
        onSortChange={setSort}
        sortOptions={[
          { value: "all", label: "🌟 Default Sequence" },
          { value: "-createdAt", label: "✨ New Artifacts" },
          { value: "price", label: "💵 Low Investment" },
          { value: "-price", label: "💎 High Artifacts" },
        ]}
      />

      {/* Category Filter Buttons with drag-to-scroll */}
      <div className="relative group/carousel">
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          className="flex overflow-x-auto w-full no-scrollbar gap-4 pb-6 px-2 snap-x snap-mandatory scroll-smooth touch-pan-x transition-all cursor-grab active:cursor-grabbing"
          role="region"
          aria-label="Category filter carousel"
        >
          {/* All Categories button */}
          <button
            onClick={() => handleCategoryUpdate("all", "All Categories")}
            className={cn(
              "flex items-center gap-4 pr-8 pl-3 py-3 rounded-full border-none transition-all duration-500 shrink-0 snap-start group select-none shadow-xl",
              filters.category === "all"
                ? "bg-foreground text-background scale-105 shadow-foreground/20"
                : "glass text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
            aria-label="Show all categories"
            aria-pressed={filters.category === "all"}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500",
                filters.category === "all"
                  ? "bg-background text-foreground"
                  : "bg-foreground/5 grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0"
              )}
            >
              ♾️
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] transition-colors">
              All Categories
            </span>
          </button>

          {/* Dynamic Category Buttons */}
          {categories?.map((cat) => {
            const isSelected = filters.category === cat.slug;
            return (
              <button
                key={cat._id}
                onClick={() => handleCategoryUpdate(cat.slug, cat.name)}
                className={cn(
                  "flex items-center gap-4 pr-8 pl-3 py-3 rounded-full border-none transition-all duration-500 shrink-0 snap-start group select-none shadow-xl",
                  isSelected
                    ? "bg-foreground text-background scale-105 shadow-foreground/20"
                    : "glass text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                aria-label={`Filter by ${cat.name}`}
                aria-pressed={isSelected}
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-accent pointer-events-none shrink-0 shadow-inner">
                  <Image
                    src={getImageUrl(cat.image, 100, 100)}
                    alt={cat.name}
                    fill
                    sizes="48px"
                    className={cn(
                      "object-cover transition-all duration-700",
                      isSelected
                        ? "grayscale-0 scale-110"
                        : "grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                    )}
                    loading="lazy"
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] transition-colors">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Subtle Fade Indicators */}
        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-background to-transparent pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity" />
        <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-background to-transparent pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
