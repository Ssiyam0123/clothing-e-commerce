"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { useProducts } from "@/app/_common/lib/useProducts";
import { useSubcategories } from "@/app/_common/lib/useSubcategories";
import CategoryItem from "@/app/products/components/CategoryItem";
import { getImageUrl } from "@/utils/imageUtils";
import FilterBar from "@/components/common/FilterBar";
import { useTrackingStore } from "@/store/trackingStore";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, LayoutGrid, ChevronRight, Hash } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { getTranslation } from "@/utils/typography/handler";
import { useMemo } from "react";
import { useCategories } from "@/app/_common/lib/useCategories";

export default function ProductFilter({ initialCategories }) {
  const { lang } = useAppStore();
  const t = useMemo(() => getTranslation('products', lang), [lang]);

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
    <div className="mb-12 space-y-8" aria-label="Product discovery">
      {/* 🔍 Search & Sort Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
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
            { value: "all", label: `${t.all}` },
            { value: "-createdAt", label: `${t.newest}` },
            { value: "price", label: `${t.priceLowHigh}` },
            { value: "-price", label: `${t.priceHighLow}` },
          ]}
        />
      </motion.div>

      {/* 🏷️ Main Category Navigation */}
      <div className="space-y-6">
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex w-max gap-4 px-2">
            <CategoryItem
              isSelected={filters.category === "all"}
              onClick={() => handleCategoryUpdate("all", "All Collections")}
              label={t.all}
              icon={<LayoutGrid size={20} />}
            />

            <CategoryItem
              isSelected={filters.category === "isFeatured"}
              onClick={() => handleCategoryUpdate("isFeatured", "Featured")}
              label={t.featured}
              icon={<Sparkles size={20} className="text-amber-500" />}
            />

            {categories?.map((cat) => (
              <CategoryItem
                key={cat._id}
                isSelected={filters.category === cat.slug}
                onClick={() => handleCategoryUpdate(cat.slug, cat.name)}
                label={cat.name}
                image={cat.slug === 'on-sale' ? "/images/sale-banner.png" : getImageUrl(cat.image, 200, 200)}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-1" />
        </ScrollArea>
      </div>

      {/* 🔗 Sub-Category Section */}
      <AnimatePresence mode="wait">
        {filteredSubcategories.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >

            
            <ScrollArea className="w-full whitespace-nowrap pb-2">
              <div className="flex w-max gap-3 px-2">
                {filteredSubcategories.map((sub) => {
                  const isSubSelected = filters.subcategory === sub.slug;
                  return (
                    <button
                      key={sub._id}
                      onClick={() => setSubcategory(isSubSelected ? null : sub.slug)}
                      className={cn(
                        "group flex items-center gap-3 pl-2 pr-6 py-2 rounded-2xl border transition-all duration-500",
                        isSubSelected
                          ? "bg-foreground border-foreground text-background shadow-lg scale-105"
                          : "bg-card/30 border-border/5 text-muted-foreground hover:border-primary/30 hover:bg-card/50 hover:text-foreground"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-500",
                        isSubSelected ? "bg-background/20" : "bg-secondary/80 group-hover:bg-primary/10"
                      )}>
                        {sub.image ? (
                          <Image
                            src={getImageUrl(sub.image, 64, 64)}
                            alt={sub.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Hash size={12} className={cn("transition-colors", isSubSelected ? "text-background" : "text-muted-foreground group-hover:text-primary")} />
                        )}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {sub.name}
                      </span>
                      {isSubSelected && (
                        <motion.div
                          layoutId="sub-check"
                          className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" className="h-1" />
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

