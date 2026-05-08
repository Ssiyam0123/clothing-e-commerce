"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/appStore";
import { useFlashSales } from "@/hooks/useFlashSale";
import FlashSaleBanner from "@/components/store/FlashSaleBanner";
import CountdownTimer from "@/components/store/CountdownTimer";
import ProductCard from "@/components/common/ProductCard";
import { Clock, Zap, ArrowRight, Timer, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DICTIONARY = {
  en: {
    emptyTitle: "The Vault is Closed",
    explore: "Explore Collection",
    activeTitle: "Live Drops Active",
    upcomingTitle: "Upcoming Sequences",
    viewDetails: "Inspect Drop",
    liveNow: "Protocol Live",
    startsOn: "Sequence Initiation",
  },
  bn: {
    emptyTitle: "কালেকশনটি বন্ধ আছে",
    explore: "কালেকশন দেখুন",
    activeTitle: "অফারটি চলছে",
    upcomingTitle: "শীঘ্রই আসছে",
    viewDetails: "ড্রপ দেখুন",
    liveNow: "লাইভ চলছে",
    startsOn: "শুরু হবে",
  },
};

export default function FlashSaleClient() {
  const { lang } = useAppStore();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY.en, [lang]);
  const { allActiveSales, isLoading } = useFlashSales();
  const now = useMemo(() => new Date(), []);

  const { activeSales, upcomingSales } = useMemo(() => {
    if (!allActiveSales || !Array.isArray(allActiveSales))
      return { activeSales: [], upcomingSales: [] };
    const active = allActiveSales.filter((s) => new Date(s.startDate) <= now && new Date(s.endDate) > now);
    const upcoming = allActiveSales.filter((s) => new Date(s.startDate) > now);
    return { activeSales: active, upcomingSales: upcoming };
  }, [allActiveSales, now]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-40 space-y-24">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-12 space-y-12">
          <Skeleton className="h-[400px] w-full rounded-[4rem] bg-accent/10" />
          <div className="space-y-4">
            <Skeleton className="h-20 w-3/4 rounded-2xl" />
            <Skeleton className="h-4 w-1/4 rounded-full" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[400px] w-full rounded-3xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 sm:pb-40 pt-20 sm:pt-32 space-y-20 sm:space-y-40">
      {/* 🔥 ACTIVE DROPS SECTION */}
      {activeSales.length > 0 ? (
        activeSales.map((sale) => (
          <section key={sale._id} className="max-w-screen-2xl mx-auto px-4 sm:px-12 space-y-12 sm:space-y-20">
            <FlashSaleBanner flashSale={sale} />
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-border/10 pb-12">
              <div className="space-y-2 text-center md:text-left">
                <Badge variant="outline" className="px-4 py-1.5 rounded-full border-accent-secondary/30 text-accent-secondary font-black text-[9px] uppercase tracking-[0.2em] bg-accent-secondary/5">
                   {ui.liveNow}
                </Badge>
                <h2 className="text-3xl sm:text-6xl lg:text-7xl font-black uppercase italic tracking-tighter leading-none">
                  {sale.name}
                </h2>
              </div>
              
              <Link href={`/flash-sale/${sale.slug}`} passHref className="w-full md:w-auto">
                <Button className="group w-full md:w-auto rounded-[2rem] bg-foreground text-background font-black uppercase tracking-widest text-[10px] sm:text-xs h-14 sm:h-16 px-8 sm:px-12 shadow-2xl hover:bg-accent-secondary hover:text-white transition-all duration-500">
                  {ui.viewDetails}
                  <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={16} />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10">
              {sale.products?.slice(0, 8).map((p) => (
                <ProductCard key={p._id} product={p} isFlashSale={true} />
              ))}
            </div>
          </section>
        ))
      ) : upcomingSales.length === 0 ? (
        <section className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6">
           <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl sm:rounded-[2rem] glass flex items-center justify-center mb-8 sm:mb-12">
              <Sparkles className="text-muted-foreground opacity-20" size={32} />
           </div>
           <h2 className="text-4xl sm:text-7xl md:text-8xl font-black uppercase italic tracking-tighter mb-8 opacity-20 leading-none">
              {ui.emptyTitle}
           </h2>
           <Link href="/products">
              <Button variant="outline" className="rounded-full px-10 h-12 sm:px-12 sm:h-14 font-black uppercase tracking-[0.3em] text-[9px] sm:text-[10px]">
                 {ui.explore}
              </Button>
           </Link>
        </section>
      ) : null}

      {/* ⏳ UPCOMING DROPS SECTION */}
      {upcomingSales.length > 0 && (
        <section className="relative py-24 sm:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-accent/5 -z-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border/10 to-transparent" />
          
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-12">
            <div className="flex flex-col items-center text-center gap-4 sm:gap-6 mb-16 sm:mb-24">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl glass flex items-center justify-center text-accent-secondary shadow-xl">
                 <Clock size={28} className="sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-3xl sm:text-6xl font-black uppercase tracking-tighter italic leading-none">
                {ui.upcomingTitle}
              </h3>
              <div className="h-1 w-16 sm:w-20 bg-accent-secondary/20 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16">
              {upcomingSales.map((sale) => (
                <Card
                  key={sale._id}
                  className="group relative h-[380px] sm:h-[450px] rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden border border-border/10 hover:border-accent-secondary/40 transition-all duration-1000 shadow-2xl bg-transparent"
                >
                  <Link href={`/flash-sale/${sale?.slug}`} className="absolute inset-0 z-20" />
                  
                  {/* Background Image Effect */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={sale.bannerImage || "/api/placeholder/800/400"}
                      className="w-full h-full object-cover grayscale opacity-30 sm:opacity-40 group-hover:opacity-60 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[3s]"
                      alt={sale.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 sm:via-background/40 to-transparent" />
                  </div>

                  <CardContent className="absolute inset-0 p-6 sm:p-16 flex flex-col justify-end z-10">
                    <div className="space-y-4 sm:space-y-6">
                      <div className="flex items-center gap-4">
                         <Badge className="bg-accent-secondary/10 text-accent-secondary border-none font-black text-[8px] uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">
                            {ui.startsOn}
                         </Badge>
                         <div className="h-px flex-1 bg-border/10" />
                      </div>
                      
                      <CardTitle className="text-3xl sm:text-6xl font-black text-foreground uppercase italic leading-none group-hover:translate-x-4 transition-transform duration-700">
                        {sale.name}
                      </CardTitle>

                      <div className="pt-2 sm:pt-4 group-hover:scale-105 transition-transform duration-700 origin-left overflow-x-auto no-scrollbar">
                        <CountdownTimer
                          targetDate={sale.startDate}
                          label={null}
                          className="!items-start"
                        />
                      </div>

                      <CardFooter className="p-0 flex items-center gap-3 pt-6 sm:pt-8 border-t border-border/10">
                        <Timer size={12} className="text-accent-secondary" />
                        <p className="text-muted-foreground text-[8px] sm:text-[10px] font-black uppercase tracking-widest">
                          {new Date(sale.startDate).toLocaleDateString(
                            lang === "bn" ? "bn-BD" : "en-US",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </p>
                      </CardFooter>
                    </div>
                  </CardContent>

                  <div className="absolute top-6 right-6 sm:top-12 sm:right-12 w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.5rem] glass flex items-center justify-center text-foreground group-hover:bg-accent-secondary group-hover:text-white transition-all duration-500 shadow-2xl z-30">
                    <Zap size={20} className="sm:w-6 sm:h-6" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border/10 to-transparent" />
        </section>
      )}
    </div>
  );
}
