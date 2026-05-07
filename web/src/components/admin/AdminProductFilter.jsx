// src/components/admin/AdminProductFilter.jsx
"use client";

import { useRef, useState } from "react";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { useCategories } from "@/hooks/useCategories";
import { getImageUrl } from "@/utils/imageUtils";
import FilterBar from "@/components/common/FilterBar";

export default function AdminProductFilter() {
  const { filters, setSearch, setSort, setCategory } = useAdminProducts();
  const { categories } = useCategories();

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
          { value: "", label: "🌟 Default" },
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
        className={`mt-6 flex overflow-x-auto w-full no-scrollbar gap-4 pb-4 px-1 snap-x snap-mandatory scroll-smooth touch-pan-x transition-all ${
          isDragging ? "cursor-grabbing scale-[0.99] opacity-90" : "cursor-grab"
        }`}
      >
        {/* All Categories button */}
        <button
          onClick={() => setCategory("all")}
          className={`flex items-center gap-3 pr-6 pl-2 py-2 rounded-full border transition-all duration-300 shrink-0 snap-start group ${
            filters.category === "all"
              ? "bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white shadow-xl"
              : "bg-white dark:bg-[#111] border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
              filters.category === "all"
                ? "bg-zinc-800 dark:bg-zinc-100"
                : "bg-zinc-100 dark:bg-[#0a0a0a] grayscale"
            }`}
          >
            ♾️
          </div>
          <span
            className={`text-[10px] font-black uppercase tracking-widest ${
              filters.category === "all"
                ? "text-white dark:text-black"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            All Categories
          </span>
        </button>

        {/* Dynamic Category Buttons */}
        {categories?.map((cat) => {
          const isSelected = filters.category === cat.slug;
          return (
            <button
              key={cat._id}
              onClick={() => setCategory(cat.slug)}
              className={`flex items-center gap-3 pr-6 pl-2 py-2 rounded-full border transition-all duration-300 shrink-0 snap-start group ${
                isSelected
                  ? "bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white shadow-xl"
                  : "bg-white dark:bg-[#111] border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
              }`}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-700/50">
                <img
                  src={getImageUrl(cat.image)}
                  alt={cat.name}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    isSelected
                      ? "grayscale-0 scale-110"
                      : "grayscale group-hover:grayscale-0"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${
                  isSelected
                    ? "text-white dark:text-black"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
