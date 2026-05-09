// src/components/admin/AdminProductFilter.jsx
"use client";

import { useRef, useState } from "react";
import { useAdminProducts } from "@/hooks/admin/useAdminProducts";
import { useAdminCategories } from "@/hooks/admin/useAdminCategories";
import { getImageUrl } from "@/utils/imageUtils";
import FilterBar from "@/components/common/FilterBar";
import { cn } from "@/lib/utils";

export default function AdminProductFilter() {
  const { filters, setSearch, setSort, setCategory } = useAdminProducts();
  const { categories } = useAdminCategories();

  // Drag-to-scroll for category buttons
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="space-y-6">
      {/* Search & Sort Bar */}
      <FilterBar
        search={filters.search}
        onSearchChange={setSearch}
        sort={filters.sort}
        onSortChange={setSort}
        sortOptions={[
          { value: "all", label: "🌟 Default" },
          { value: "-createdAt", label: "✨ Newest" },
          { value: "price", label: "💵 Low Price" },
          { value: "-price", label: "💎 High Price" },
          { value: "stockHigh", label: "📈 Stock: High to Low" },
          { value: "stockLow", label: "📉 Stock: Low to High" },
        ]}
      />

      {/* Category Filter Buttons with Drag-to-Scroll */}
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={cn(
          "mt-6 flex overflow-x-auto w-full no-scrollbar gap-4 pb-4 px-1 snap-x snap-mandatory scroll-smooth touch-pan-x transition-all",
          isDragging ? "cursor-grabbing scale-[0.99] opacity-90" : "cursor-grab"
        )}
      >
        {/* All Categories button */}
        <button
          onClick={() => setCategory("all")}
          className={cn(
            "flex items-center gap-3 pr-6 pl-2 py-2 rounded-full border transition-all duration-300 shrink-0 snap-start group",
            filters.category === "all"
              ? "bg-foreground text-background border-foreground shadow-xl"
              : "bg-card text-muted-foreground border-border hover:border-foreground"
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-lg",
              filters.category === "all"
                ? "bg-background/20"
                : "bg-muted grayscale"
            )}
          >
            ♾️
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">
            All Categories
          </span>
        </button>

        {/* Featured Items Button */}
        <button
          onClick={() => setCategory("isFeatured")}
          className={cn(
            "flex items-center gap-3 pr-6 pl-2 py-2 rounded-full border transition-all duration-300 shrink-0 snap-start group",
            filters.category === "isFeatured"
              ? "bg-amber-500 text-white border-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              : "bg-card text-muted-foreground border-border hover:border-amber-500/50"
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-lg",
              filters.category === "isFeatured"
                ? "bg-white/20"
                : "bg-amber-100 grayscale group-hover:grayscale-0"
            )}
          >
            ★
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">
            Featured Items
          </span>
        </button>

        {/* Dynamic Category Buttons */}
        {categories?.map((cat) => {
          const isSelected = filters.category === cat.slug;
          return (
            <button
              key={cat._id}
              onClick={() => setCategory(cat.slug)}
              className={cn(
                "flex items-center gap-3 pr-6 pl-2 py-2 rounded-full border transition-all duration-300 shrink-0 snap-start group",
                isSelected
                  ? "bg-foreground text-background border-foreground shadow-xl"
                  : "bg-card text-muted-foreground border-border hover:border-foreground"
              )}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted border border-border">
                <img
                  src={getImageUrl(cat.image)}
                  alt={cat.name}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-500",
                    isSelected
                      ? "grayscale-0 scale-110"
                      : "grayscale group-hover:grayscale-0"
                  )}
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
