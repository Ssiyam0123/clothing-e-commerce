"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { useProducts } from "@/hooks/client/useProducts";
import { useCategories } from "@/hooks/client/useCategories";
import { useSubcategories } from "@/hooks/useSubcategories";
import { getImageUrl } from "@/utils/imageUtils";
import FilterBar from "@/components/common/FilterBar";
import { useTrackingStore } from "@/store/trackingStore";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, LayoutGrid, ChevronRight, Hash } from "lucide-react";

export default function ProductFilter({ initialCategories, t }) {
  const { filters, setSearch, setSort, setCategory, setSubcategory } = useProducts();
  const { categories } = useCategories(initialCategories);
  const { subcategories } = useSubcategories();
  const trackSearch = useTrackingStore((state) => state.trackSearch);

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
      if (slug !== "all" && slug !== "isFeatured") {
        trackSearch(null, name);
      }
    },
    [setCategory, trackSearch],
  );

  // 🧬 Taxonomy Logic: Filter subcategories by selected category
  const selectedCategory = categories?.find(c => c.slug === filters.category);
  const filteredSubcategories = subcategories?.filter(sub => {
    if (!selectedCategory) return true; // Show all if "All Collections" or "Featured"
    const catId = sub.category?._id || sub.category;
    return String(catId) === String(selectedCategory._id);
  }) || [];

  return (
    <div className="mb-12 space-y-10" aria-label="Product discovery engine">
      {/* 🔍 Phase 1: Search & Sort Interface */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-40"
      >
        <FilterBar
          search={filters.search}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearchSubmit}
          sort={filters.sort}
          onSortChange={setSort}
          placeholder={t.search}
          sortLabel={t.sort}
          sortOptions={[
            { value: "all", label: `🌟 ${t.all}` },
            { value: "-createdAt", label: `✨ ${t.newest}` },
            { value: "price", label: `💵 ${t.priceLowHigh}` },
            { value: "-price", label: `💎 ${t.priceHighLow}` },
          ]}
        />
      </motion.div>

      {/* 🏷️ Phase 2: Category Navigation (Labels Removed) */}
      <div className="space-y-4">
        <ScrollArea className="w-full whitespace-nowrap rounded-none pb-4">
          <div className="flex w-max gap-6 px-2">
            {/* ♾️ Universal Node */}
            <CategoryButton
              isSelected={filters.category === "all"}
              onClick={() => handleCategoryUpdate("all", "All Collections")}
              label={t.all}
              icon={<LayoutGrid size={18} />}
            />

            {/* ✨ Featured Node */}
            <CategoryButton
              isSelected={filters.category === "isFeatured"}
              onClick={() => handleCategoryUpdate("isFeatured", "Featured")}
              label={t.featured}
              icon={<Sparkles size={18} className="text-amber-400" />}
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

      {/* 🔗 Phase 3: Sub-Collections (Labels Removed) */}
      {filteredSubcategories.length > 0 && (
        <div className="space-y-4">
           <ScrollArea className="w-full whitespace-nowrap pb-2">
             <div className="flex w-max gap-3 px-2">
                {filteredSubcategories.map((sub) => (
                  <button
                    key={sub._id}
                    onClick={() => setSubcategory(filters.subcategory === sub.slug ? null : sub.slug)}
                    className={cn(
                      "px-5 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all duration-300",
                      filters.subcategory === sub.slug
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                        : "bg-background border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary"
                    )}
                  >
                    {sub.name}
                  </button>
                ))}
             </div>
             <ScrollBar orientation="horizontal" className="h-1" />
           </ScrollArea>
        </div>
      )}
    </div>
  );
}

function CategoryButton({ isSelected, onClick, label, icon, image }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-5 p-2.5 pr-12 rounded-[2.5rem] border transition-all duration-500 group overflow-hidden shadow-sm",
        isSelected
          ? "bg-foreground border-foreground shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] z-10"
          : "bg-card/40 backdrop-blur-md border-border/80 hover:border-accent-secondary hover:bg-card/80 hover:shadow-xl hover:shadow-accent-secondary/10"
      )}
    >
      {/* Visual Identity */}
      <div className={cn(
        "w-12 h-12 rounded-full overflow-hidden flex items-center justify-center transition-all duration-700 shadow-inner",
        isSelected ? "bg-background/20 ring-2 ring-background/10" : "bg-accent/40 ring-1 ring-border/5"
      )}>
        {image ? (
          <Image
            src={image}
            alt={label}
            width={48}
            height={48}
            className={cn(
              "w-full h-full object-cover transition-all duration-700",
              isSelected ? "scale-110 grayscale-0" : "grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-125"
            )}
          />
        ) : (
          <div className={cn(
            "transition-all duration-500",
            isSelected ? "text-background scale-110" : "text-muted-foreground group-hover:text-accent-secondary group-hover:scale-110"
          )}>
            {icon || <Sparkles size={18} />}
          </div>
        )}
      </div>

      {/* Label Matrix */}
      <div className="flex flex-col items-start gap-1">
        <span className={cn(
          "text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500",
          isSelected ? "text-background" : "text-foreground/80 group-hover:text-foreground"
        )}>
          {label}
        </span>
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="h-0.5 bg-accent-secondary rounded-full"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Decoration */}
      <div className={cn(
        "absolute top-0 right-0 h-full w-3 flex items-center justify-center transition-all duration-500",
        isSelected ? "bg-accent-secondary opacity-100" : "bg-accent/20 opacity-0 group-hover:opacity-100"
      )}>
         <ChevronRight size={10} className={isSelected ? "text-white" : "text-accent-secondary"} />
      </div>
    </motion.button>
  );
}
