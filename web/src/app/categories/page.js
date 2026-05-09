"use client";

import { useCategories } from "@/hooks/client/useCategories";
import { getImageUrl } from "@/utils/imageUtils";
import Link from "next/link";
import { ChevronRight, LayoutGrid, Loader2, BadgePercent } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

const DICTIONARY = {
  en: {
    title: "The Collections",
    subtitle: "Navigate through our premium archival categories.",
    explore: "Explore Collection",
    loading: "Retrieving Archive...",
    empty: "No categories found in the matrix.",
  },
  bn: {
    title: "কালেকশন সমূহ",
    subtitle: "আমাদের প্রিমিয়াম আর্কাইভাল ক্যাটাগরিগুলি দেখুন।",
    explore: "কালেকশন দেখুন",
    loading: "আর্কাইভ খোঁজা হচ্ছে...",
    empty: "ম্যাট্রিক্সে কোনো ক্যাটাগরি পাওয়া যায়নি।",
  },
};

export default function CategoriesPage() {
  const { categories, isLoading } = useCategories();
  const { lang } = useAppStore();

  const ui = DICTIONARY[lang] || DICTIONARY["en"];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-page">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" strokeWidth={1} />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse">
          {ui.loading}
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-page pb-32 pt-20 transition-colors duration-700">
      <div className="container mx-auto px-4 md:px-10">
        {/* 🏔️ Strategic Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                <LayoutGrid size={16} className="text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Vanguard Hub</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-foreground tracking-tighter uppercase italic leading-[0.85] drop-shadow-sm">
              {ui.title}
            </h1>
            <p className="text-[11px] md:text-xs font-bold text-muted-foreground uppercase tracking-[0.25em] max-w-md leading-relaxed opacity-70">
              {ui.subtitle}
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Artifact Clusters</p>
            <p className="text-4xl font-black text-foreground tracking-tighter leading-none mt-1">
              {categories.length.toString().padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* 📦 Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
          {categories.map((category, idx) => {
            const isSale = category.slug === "on-sale";
            
            return (
              <Link
                key={category._id}
                href={`/products?category=${category.slug}&page=1`}
                className={cn(
                  "group relative h-[220px] md:h-[550px] rounded-3xl md:rounded-[2.5rem] overflow-hidden border transition-all duration-700 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-12 fill-mode-both",
                  isSale 
                    ? "border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40 hover:shadow-rose-500/5" 
                    : "border-border/10 bg-card/5 hover:border-primary/20 hover:shadow-primary/5"
                )}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Image Layer */}
                <div className="absolute inset-0 z-0">
                  {isSale ? (
                    <div className="absolute inset-0 bg-rose-600/10">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500/20 via-transparent to-transparent opacity-60" />
                    </div>
                  ) : (
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                    />
                  )}
                  {/* Gradient Overlay */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90",
                    isSale && "from-rose-950/20"
                  )} />
                  {!isSale && <div className="absolute inset-0 bg-primary/5 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay" />}
                </div>

                {/* Content Layer */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-10 z-10 space-y-2 md:space-y-4">
                  <div className="space-y-0.5 md:space-y-1">
                    <p className={cn(
                      "text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]",
                      isSale ? "text-rose-500" : "text-primary"
                    )}>
                      {isSale ? "Limited" : "Discovery"}
                    </p>
                    <h3 className="text-xl md:text-3xl font-black text-foreground uppercase tracking-tighter italic leading-none">
                      {category.name}
                    </h3>
                  </div>
                  
                  {category.description && (
                    <p className="hidden md:block text-[10px] font-bold text-muted-foreground uppercase tracking-widest line-clamp-2 leading-relaxed opacity-70">
                      {category.description}
                    </p>
                  )}

                  <div className="pt-2 md:pt-4 flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
                    <span className={cn(
                      "border-b-2 pb-0.5 md:pb-1",
                      isSale ? "border-rose-500/40" : "border-primary/40"
                    )}>
                      {ui.explore}
                    </span>
                    <ChevronRight size={12} className={cn(
                      "transition-transform group-hover:translate-x-1",
                      isSale ? "text-rose-500" : "text-primary"
                    )} />
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className={cn(
                  "absolute top-4 right-4 md:top-8 md:right-8 w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl border flex items-center justify-center backdrop-blur-xl",
                  isSale ? "border-rose-500/20 bg-rose-500/10" : "border-white/10 bg-white/5"
                )}>
                  {isSale ? (
                    <BadgePercent className="size-4 md:size-5 text-rose-500" />
                  ) : (
                    <LayoutGrid className="size-4 md:size-5 text-white" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
