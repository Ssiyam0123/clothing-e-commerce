"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { useProducts } from "@/app/products/lib/useProducts";
import { useSubcategories } from "@/app/products/lib/useSubcategories";
import { useCategories } from "@/app/products/lib/useCategories";
import CategoryItem from "@/app/products/components/CategoryItem";
import { getImageUrl } from "@/utils/imageUtils";
import FilterBar from "@/components/common/FilterBar";
import { useTrackingStore } from "@/store/trackingStore";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import { getTranslation } from "@/utils/typography/handler";
import { Button } from "@/components/ui/button";
import {
  BadgePercent,
  DollarSign,
  Grid2X2,
  Hash,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Tag,
} from "lucide-react";

export default function ProductFilter({ initialCategories }) {
  const { lang } = useAppStore();
  const t = useMemo(() => getTranslation("products", lang), [lang]);
  const {
    filters,
    setSearch,
    setSort,
    setCategory,
    setSubcategory,
    setPriceRange,
  } = useProducts();
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice || "");
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice || "");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const { categories } = useCategories(initialCategories);
  const { subcategories } = useSubcategories();
  const trackSearch = useTrackingStore((state) => state.trackSearch);

  const selectedCategory = categories?.find((cat) => cat.slug === filters.category);
  const filteredSubcategories =
    subcategories?.filter((sub) => {
      if (!selectedCategory) return true;
      const catId = sub.category?._id || sub.category;
      return String(catId) === String(selectedCategory._id);
    }) || [];

  const activeFilterCount = [
    filters.search,
    filters.category !== "all" ? filters.category : "",
    filters.subcategory,
    filters.minPrice || filters.maxPrice,
    filters.sort && filters.sort !== "all" ? filters.sort : "",
  ].filter(Boolean).length;

  const handleSearchSubmit = useCallback(
    (value) => {
      const query = value?.trim();
      if (query && query.length > 1) {
        trackSearch(query, filters.category !== "all" ? filters.category : null);
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

  const applyPriceRange = useCallback(() => {
    setPriceRange(
      localMinPrice ? Number(localMinPrice) : null,
      localMaxPrice ? Number(localMaxPrice) : null,
    );
  }, [localMinPrice, localMaxPrice, setPriceRange]);

  const clearPriceRange = useCallback(() => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    setPriceRange(null, null);
  }, [setPriceRange]);

  return (
    <section
      className="mb-8 lg:mb-12 rounded-[24px] border border-border/60 bg-card/80 p-3 shadow-sm backdrop-blur-xl sm:p-4 lg:p-5"
      aria-label="Product filters"
    >
      <div className="mb-4 flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-2xl bg-foreground text-background">
            <SlidersHorizontal size={16} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-foreground">
              {t.filters || "Filters"}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">
              {activeFilterCount
                ? `${activeFilterCount} ${t.active || "active"}`
                : t.refine || "Refine your collection"}
            </p>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setSort("");
              setCategory("all");
              clearPriceRange();
            }}
            className="h-9 rounded-xl px-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-destructive"
          >
            <RotateCcw size={13} />
            {t.clear || "Clear"}
          </Button>
        )}
      </div>

      <div className="relative z-40 mb-4 flex gap-2">
        <div className="min-w-0 flex-1">
          <FilterBar
            search={filters.search}
            onSearchChange={setSearch}
            onSearchSubmit={handleSearchSubmit}
            searchPlaceholder={t.search || "Search products"}
          />
        </div>
        <Button
          type="button"
          onClick={() => setIsFilterPanelOpen((open) => !open)}
          aria-expanded={isFilterPanelOpen}
          className="h-auto min-h-[64px] w-16 shrink-0 rounded-3xl p-0 sm:w-20"
        >
          <span className="relative flex flex-col items-center gap-1">
            <SlidersHorizontal size={18} />
            <span className="text-[9px] font-black uppercase tracking-wider">
              {t.sort || "Sort"}
            </span>
            {(filters.sort || filters.minPrice || filters.maxPrice) && (
              <span className="absolute -right-2 -top-2 size-2 rounded-full bg-red-500" />
            )}
          </span>
        </Button>
      </div>

      <div className="space-y-4">
        {isFilterPanelOpen && (
          <div className="rounded-[22px] border border-border bg-background/80 p-3 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                  {t.sort || "Sort"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "all", label: t.newest || t.all || "Newest" },
                    { value: "price", label: t.priceLowHigh || "Price low to high" },
                    { value: "-price", label: t.priceHighLow || "Price high to low" },
                  ].map((option) => {
                    const isSelected = (filters.sort || "all") === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSort(option.value === "all" ? "" : option.value)}
                        className={cn(
                          "h-11 rounded-2xl border px-4 text-[10px] font-black uppercase tracking-wider transition",
                          isSelected
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-card text-foreground hover:border-foreground/30",
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-end">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                    {t.price || "Price"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:min-w-[260px]">
                  <label className="space-y-1">
                    <span className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      {t.minPrice || "Min"}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={localMinPrice}
                      onChange={(event) => setLocalMinPrice(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") applyPriceRange();
                      }}
                      placeholder="0"
                      className="h-11 w-full rounded-2xl border border-border bg-card px-3 text-sm font-bold outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-foreground/5"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      {t.maxPrice || "Max"}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={localMaxPrice}
                      onChange={(event) => setLocalMaxPrice(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") applyPriceRange();
                      }}
                      placeholder="99999"
                      className="h-11 w-full rounded-2xl border border-border bg-card px-3 text-sm font-bold outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-foreground/5"
                    />
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={applyPriceRange}
                    className="h-11 flex-1 rounded-2xl px-5 text-[10px] font-black uppercase tracking-wider sm:flex-none"
                  >
                    {t.apply || "Apply"}
                  </Button>
                  {(filters.minPrice || filters.maxPrice) && (
                    <Button
                      type="button"
                      onClick={clearPriceRange}
                      variant="outline"
                      className="h-11 rounded-2xl px-4 text-[10px] font-black uppercase tracking-wider"
                    >
                      {t.clear || "Clear"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
              {t.categories || "Categories"}
            </p>
          </div>
          <div className="-mx-3 overflow-x-auto px-3 pb-2 scrollbar-none">
            <div className="flex w-max gap-2 sm:gap-3">
              <CategoryItem
                isSelected={filters.category === "all"}
                onClick={() => handleCategoryUpdate("all", "All Collections")}
                label={t.all || "All"}
                icon={<Grid2X2 size={18} />}
              />
              <CategoryItem
                isSelected={filters.category === "isFeatured"}
                onClick={() => handleCategoryUpdate("isFeatured", "Featured")}
                label={t.featured || "Featured"}
                icon={<Sparkles size={18} className="text-amber-500" />}
              />
              <CategoryItem
                isSelected={filters.category === "on-sale"}
                onClick={() => handleCategoryUpdate("on-sale", "On Sale")}
                label={t.onSale || "Sale"}
                icon={<BadgePercent size={18} className="text-red-500" />}
              />
              {categories?.map((cat) => (
                <CategoryItem
                  key={cat._id}
                  isSelected={filters.category === cat.slug}
                  onClick={() => handleCategoryUpdate(cat.slug, cat.name)}
                  label={cat.name}
                  image={getImageUrl(cat.image, 180, 180)}
                />
              ))}
            </div>
          </div>
        </div>

        {filteredSubcategories.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2 px-1">
              <Tag size={13} className="text-muted-foreground" />
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                {t.subcategories || "Subcategories"}
              </p>
            </div>
            <div className="-mx-3 overflow-x-auto px-3 pb-1 scrollbar-none">
              <div className="flex w-max gap-2">
                {filteredSubcategories.map((sub) => {
                  const isSelected = filters.subcategory === sub.slug;
                  return (
                    <button
                      key={sub._id}
                      type="button"
                      onClick={() => setSubcategory(isSelected ? null : sub.slug)}
                      className={cn(
                        "flex h-11 items-center gap-2 rounded-2xl border px-2.5 pr-4 text-left transition-all",
                        isSelected
                          ? "border-foreground bg-foreground text-background shadow-md"
                          : "border-border bg-background text-foreground hover:border-foreground/30",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-xl",
                          isSelected ? "bg-background/15" : "bg-muted",
                        )}
                      >
                        {sub.image ? (
                          <Image
                            src={getImageUrl(sub.image, 64, 64)}
                            alt={sub.name}
                            width={28}
                            height={28}
                            className="size-full object-cover"
                          />
                        ) : (
                          <Hash size={12} />
                        )}
                      </span>
                      <span className="max-w-[130px] truncate text-[10px] font-black uppercase tracking-wider">
                        {sub.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
