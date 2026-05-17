// src/components/admin/AdminProductFilter.jsx
"use client";

import { useRef, useState, useEffect } from "react";
import { useAdminProducts } from "@/modules/admin/hooks/useAdminProducts";
import { useAdminCategories } from "@/modules/admin/hooks/useAdminCategories";
import { useSubcategories } from "@/modules/client/common/lib/useSubcategories";
import { getImageUrl } from "@/utils/imageUtils";
import FilterBar from "@/components/common/FilterBar";
import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterX, Search, Layers, Box, Eye, CircleDollarSign } from "lucide-react";

export default function AdminProductFilter() {
  const { 
    filters, 
    setSearch, 
    setSort, 
    setCategory, 
    setSubcategory,
    setStockStatus,
    setIsActive,
    setPriceRange 
  } = useAdminProducts();
  
  const { categories } = useAdminCategories();
  const { subcategories } = useSubcategories();

  // Local state for debounced price inputs
  const [localMin, setLocalMin] = useState(filters.minPrice || "");
  const [localMax, setLocalMax] = useState(filters.maxPrice || "");

  useEffect(() => {
    setLocalMin(filters.minPrice || "");
    setLocalMax(filters.maxPrice || "");
  }, [filters.minPrice, filters.maxPrice]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localMin !== filters.minPrice || localMax !== filters.maxPrice) {
        setPriceRange(localMin, localMax);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [localMin, localMax, setPriceRange, filters.minPrice, filters.maxPrice]);

  // Drag-to-scroll for category buttons
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const filteredSubcategories = subcategories?.filter(sub => {
    if (filters.category === "all") return true;
    const cat = categories?.find(c => c.slug === filters.category);
    return sub.category?._id === cat?._id || sub.category === cat?._id;
  }) || [];

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

  const clearFilters = () => {
    setSearch("");
    setSort("all");
    setCategory("all");
    setSubcategory("all");
    setStockStatus("all");
    setIsActive("all");
    setPriceRange("", "");
  };

  return (
    <div className="space-y-8">
      {/* 1. Main Search & Sort */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
        <div className="flex-1 w-full">
           <FilterBar
            search={filters.search}
            onSearchChange={setSearch}
            sort={filters.sort}
            onSortChange={setSort}
            sortOptions={[
              { value: "all", label: "🌟 Default Sequence" },
              { value: "-createdAt", label: "✨ Latest Deployments" },
              { value: "price", label: "💵 Economy Class" },
              { value: "-price", label: "💎 Premium Class" },
              { value: "stockHigh", label: "📈 Maximum Density" },
              { value: "stockLow", label: "📉 Minimum Density" },
            ]}
          />
        </div>
        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="h-20 px-8 rounded-full border-dashed border-muted-foreground/30 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all gap-3"
        >
          <FilterX size={16} />
          Reset All
        </Button>
      </div>

      {/* 2. Tactical Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Subcategory Filter */}
        <div className="space-y-2">
           <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-4 flex items-center gap-2">
             <Layers size={10} /> Sub-Sector
           </label>
           <Select value={filters.subcategory} onValueChange={setSubcategory}>
             <SelectTrigger className="h-14 bg-background/50 rounded-full border-border/50 text-[10px] font-bold uppercase px-6">
               <SelectValue placeholder="All Subcategories" />
             </SelectTrigger>
             <SelectContent className="rounded-[1.5rem] border-border bg-card">
               <SelectItem value="all" className="text-[10px] font-bold uppercase">All Sub-Sectors</SelectItem>
               {filteredSubcategories.map(sub => (
                 <SelectItem key={sub._id} value={sub._id} className="text-[10px] font-bold uppercase">
                   {sub.name}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
        </div>

        {/* Stock Status Filter */}
        <div className="space-y-2">
           <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-4 flex items-center gap-2">
             <Box size={10} /> Inventory Status
           </label>
           <Select value={filters.stockStatus} onValueChange={setStockStatus}>
             <SelectTrigger className="h-14 bg-background/50 rounded-full border-border/50 text-[10px] font-bold uppercase px-6">
               <SelectValue placeholder="All Stock Levels" />
             </SelectTrigger>
             <SelectContent className="rounded-[1.5rem] border-border bg-card">
               <SelectItem value="all" className="text-[10px] font-bold uppercase">Full Inventory</SelectItem>
               <SelectItem value="inStock" className="text-[10px] font-bold uppercase text-emerald-500">In Stock</SelectItem>
               <SelectItem value="lowStock" className="text-[10px] font-bold uppercase text-amber-500">Low Stock</SelectItem>
               <SelectItem value="outOfStock" className="text-[10px] font-bold uppercase text-destructive">Depleted</SelectItem>
             </SelectContent>
           </Select>
        </div>

        {/* Visibility Filter */}
        <div className="space-y-2">
           <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-4 flex items-center gap-2">
             <Eye size={10} /> Visibility Status
           </label>
           <Select value={filters.isActive} onValueChange={setIsActive}>
             <SelectTrigger className="h-14 bg-background/50 rounded-full border-border/50 text-[10px] font-bold uppercase px-6">
               <SelectValue placeholder="All States" />
             </SelectTrigger>
             <SelectContent className="rounded-[1.5rem] border-border bg-card">
               <SelectItem value="all" className="text-[10px] font-bold uppercase">All States</SelectItem>
               <SelectItem value="true" className="text-[10px] font-bold uppercase text-emerald-500">Public Protocol</SelectItem>
               <SelectItem value="false" className="text-[10px] font-bold uppercase text-muted-foreground">Shadow Protocol</SelectItem>
             </SelectContent>
           </Select>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-2">
           <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-4 flex items-center gap-2">
             <CircleDollarSign size={10} /> Price Magnitude
           </label>
           <div className="flex items-center gap-2">
             <Input 
                type="number" 
                placeholder="MIN" 
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="h-14 bg-background/50 rounded-l-full border-border/50 text-[10px] font-black uppercase text-center focus:ring-primary/20"
             />
             <div className="h-[2px] w-4 bg-muted shrink-0" />
             <Input 
                type="number" 
                placeholder="MAX" 
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="h-14 bg-background/50 rounded-r-full border-border/50 text-[10px] font-black uppercase text-center focus:ring-primary/20"
             />
           </div>
        </div>
      </div>

      {/* 3. Category Carousel */}
      <div className="space-y-3">
        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-4">
          Sector Classification
        </label>
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={cn(
            "flex overflow-x-auto w-full no-scrollbar gap-4 pb-4 px-1 snap-x snap-mandatory scroll-smooth touch-pan-x transition-all",
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
    </div>
  );
}
