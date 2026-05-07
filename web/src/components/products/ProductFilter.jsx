"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { getImageUrl } from "@/utils/imageUtils";
import FilterBar from "@/components/common/FilterBar";
import { useTrackingStore } from "@/store/trackingStore";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, LayoutGrid, ChevronRight, ChevronLeft } from "lucide-react";

export default function ProductFilter({ initialCategories }) {
  const { filters, setSearch, setSort, setCategory } = useProducts();
  const { categories } = useCategories(initialCategories);
  const trackSearch = useTrackingStore((state) => state.trackSearch);

  const scrollRef = useRef(null);

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
    <div className="mb-16 space-y-12" aria-label="Product filters">
      {/* 🚀 Primary Interface: Search & Sort */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
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
      </motion.div>

      {/* 🏷️ Secondary Interface: Category Archives */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                Category
              </h3>
           </div>
           {filters.category !== 'all' && (
             <button 
              onClick={() => handleCategoryUpdate('all', 'All')}
              className="text-[9px] font-black uppercase tracking-widest text-accent-secondary hover:underline underline-offset-4 transition-all"
             >
               Clear Protocol
             </button>
           )}
        </div>

        <ScrollArea className="w-full whitespace-nowrap rounded-none pb-4">
          <div className="flex w-max gap-6 px-2">
            {/* ♾️ Universal Node */}
            <CategoryButton
              isSelected={filters.category === "all"}
              onClick={() => handleCategoryUpdate("all", "All Categories")}
              label="All Collections"
              icon={<LayoutGrid size={18} />}
            />

            {/* 📦 Collection Nodes */}
            {categories?.map((cat) => (
              <CategoryButton
                key={cat._id}
                isSelected={filters.category === cat.slug}
                onClick={() => handleCategoryUpdate(cat.slug, cat.name)}
                label={cat.name}
                image={getImageUrl(cat.image, 200, 200)}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-1.5 bg-accent/20" />
        </ScrollArea>
      </div>
    </div>
  );
}

function CategoryButton({ isSelected, onClick, label, icon, image }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-5 p-2 pr-10 rounded-[2rem] border transition-all duration-500 group overflow-hidden",
        isSelected
          ? "bg-foreground border-foreground shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] z-10"
          : "bg-background border-border/40 hover:border-accent-secondary/50 hover:shadow-xl hover:shadow-accent-secondary/5"
      )}
    >
      {/* Visual Identity */}
      <div className={cn(
        "w-12 h-12 rounded-full overflow-hidden flex items-center justify-center transition-all duration-700 shadow-inner",
        isSelected ? "bg-background/10" : "bg-accent/30"
      )}>
        {image ? (
          <Image
            src={image}
            alt={label}
            width={48}
            height={48}
            className={cn(
              "w-full h-full object-cover transition-all duration-700",
              isSelected ? "scale-110 grayscale-0" : "grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
            )}
          />
        ) : (
          <div className={cn(
            "transition-colors",
            isSelected ? "text-background" : "text-muted-foreground group-hover:text-accent-secondary"
          )}>
            {icon || <Sparkles size={18} />}
          </div>
        )}
      </div>

      {/* Label Matrix */}
      <div className="flex flex-col items-start gap-0.5">
        <span className={cn(
          "text-[10px] font-black uppercase tracking-[0.25em] transition-colors",
          isSelected ? "text-background" : "text-muted-foreground group-hover:text-foreground"
        )}>
          {label}
        </span>
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="h-0.5 bg-accent-secondary rounded-full mt-1"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Decoration */}
      <div className={cn(
        "absolute top-0 right-0 h-full w-2 flex items-center justify-center transition-all",
        isSelected ? "bg-accent-secondary opacity-100" : "bg-accent/10 opacity-0 group-hover:opacity-100"
      )}>
         <ChevronRight size={8} className={isSelected ? "text-white" : "text-muted-foreground"} />
      </div>
    </motion.button>
  );
}
