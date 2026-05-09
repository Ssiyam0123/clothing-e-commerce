"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/appStore";
import { useFlashSales } from "@/hooks/client/useFlashSale";
import FlashSaleBanner from "@/components/store/FlashSaleBanner";
import CountdownTimer from "@/components/store/CountdownTimer";
import ProductCard from "@/components/common/ProductCard";
import { Clock, Zap, ArrowRight, Timer, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
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
    allArtifacts: "All Artifacts",
  },
  bn: {
    emptyTitle: "কালেকশনটি বন্ধ আছে",
    explore: "কালেকশন দেখুন",
    activeTitle: "অফারটি চলছে",
    upcomingTitle: "শীঘ্রই আসছে",
    viewDetails: "ড্রপ দেখুন",
    liveNow: "লাইভ চলছে",
    startsOn: "শুরু হবে",
    allArtifacts: "সব প্রোডাক্ট",
  },
};

export default function FlashSaleClient({ initialData }) {
  const { lang } = useAppStore();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY.en, [lang]);
  const { allActiveSales, isLoading } = useFlashSales();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sales = allActiveSales?.length > 0 ? allActiveSales : initialData;

  const { activeSales, upcomingSales } = useMemo(() => {
    if (!sales || !Array.isArray(sales))
      return { activeSales: [], upcomingSales: [] };
    const active = sales.filter((s) => new Date(s.startDate) <= now && new Date(s.endDate) > now);
    const upcoming = sales.filter((s) => new Date(s.startDate) > now);
    return { activeSales: active, upcomingSales: upcoming };
  }, [sales, now]);

  if (isLoading && !initialData) {
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
    <div className="pb-24 sm:pb-40 pt-20 sm:pt-32 space-y-20 sm:space-y-40 overflow-hidden">
      {/* 🔥 ACTIVE DROPS SECTION */}
      <AnimatePresence mode="wait">
        {activeSales.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-20 sm:space-y-40"
          >
            {activeSales.map((sale, index) => (
              <motion.section 
                key={sale._id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="max-w-screen-2xl mx-auto px-4 sm:px-12 space-y-12 sm:space-y-20"
              >
                <FlashSaleBanner flashSale={sale} />
 
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-10">
                  {sale.products?.slice(0, 8).map((p, idx) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                      <ProductCard product={p} isFlashSale={true} />
                    </motion.div>
                  ))}
                </div>

                {sale.products?.length > 8 && (
                  <div className="flex justify-center pt-10">
                     <Link href={`/flash-sale/${sale.slug}`}>
                       <Button variant="outline" className="rounded-full px-12 h-14 font-black uppercase tracking-widest text-[10px] border-border hover:bg-foreground hover:text-background transition-all">
                         {ui.allArtifacts} <ChevronRight size={14} className="ml-2" />
                       </Button>
                     </Link>
                  </div>
                )}
              </motion.section>
            ))}
          </motion.div>
        ) : upcomingSales.length === 0 ? (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6"
          >
             <div className="relative mb-12">
                <div className="absolute inset-0 bg-accent-secondary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-[2.5rem] glass flex items-center justify-center border border-white/10">
                   <Sparkles className="text-accent-secondary animate-bounce" size={48} />
                </div>
             </div>
             <h2 className="text-5xl sm:text-8xl md:text-9xl font-black uppercase italic tracking-tighter mb-10 opacity-10 leading-none select-none">
                {ui.emptyTitle}
             </h2>
             <Link href="/products">
                <Button className="rounded-full px-14 h-16 bg-foreground text-background hover:bg-accent-secondary hover:text-white font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs shadow-2xl transition-all active:scale-95">
                   {ui.explore}
                </Button>
             </Link>
          </motion.section>
        ) : null}
      </AnimatePresence>

      {/* ⏳ UPCOMING DROPS SECTION */}
      {upcomingSales.length > 0 && (
        <section className="relative py-24 sm:py-48 overflow-hidden">
          <div className="absolute inset-0 bg-accent/5 -z-10" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/20 to-transparent" />
          
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center gap-6 sm:gap-8 mb-20 sm:mb-32"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] glass flex items-center justify-center text-accent-secondary shadow-2xl border border-white/5">
                 <Clock size={32} className="sm:w-10 sm:h-10" />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl sm:text-7xl font-black uppercase tracking-tighter italic leading-none">
                  {ui.upcomingTitle}
                </h3>
                <div className="flex items-center justify-center gap-4">
                   <div className="h-px w-12 bg-accent-secondary/30" />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Protocol Queued</span>
                   <div className="h-px w-12 bg-accent-secondary/30" />
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-20">
              {upcomingSales.map((sale, idx) => (
                <motion.div
                  key={sale._id}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <Card
                    className="group relative h-[400px] sm:h-[550px] rounded-[3rem] sm:rounded-[5rem] overflow-hidden border border-border/10 hover:border-accent-secondary/40 transition-all duration-1000 shadow-2xl bg-black"
                  >
                    <Link href={`/flash-sale/${sale?.slug}`} className="absolute inset-0 z-20" />
                    
                    {/* Background Image Effect */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={sale.bannerImage || "/api/placeholder/800/400"}
                        className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-70 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[4s] ease-out"
                        alt={sale.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    </div>

                    <CardContent className="absolute inset-0 p-8 sm:p-20 flex flex-col justify-end z-10">
                      <div className="space-y-6 sm:space-y-10">
                        <div className="flex items-center gap-4">
                           <Badge className="bg-accent-secondary text-white border-none font-black text-[9px] uppercase tracking-[0.3em] px-5 py-2 rounded-full shadow-xl shadow-accent-secondary/20">
                              {ui.startsOn}
                           </Badge>
                           <div className="h-px flex-1 bg-white/10" />
                        </div>
                        
                        <CardTitle className="text-4xl sm:text-7xl lg:text-8xl font-black text-white uppercase italic leading-none group-hover:translate-x-6 transition-transform duration-700 tracking-tighter">
                          {sale.name}
                        </CardTitle>

                        <div className="pt-2 sm:pt-4 group-hover:scale-105 transition-transform duration-700 origin-left">
                          <CountdownTimer
                            targetDate={sale.startDate}
                            label={null}
                            className="!items-start !text-white"
                          />
                        </div>

                        <CardFooter className="p-0 flex items-center gap-4 pt-8 sm:pt-12 border-t border-white/10">
                          <Timer size={14} className="text-accent-secondary" />
                          <p className="text-white/60 text-[9px] sm:text-[11px] font-black uppercase tracking-widest">
                            {new Date(sale.startDate).toLocaleDateString(
                              lang === "bn" ? "bn-BD" : "en-US",
                              { day: "numeric", month: "long", year: "numeric" },
                            )}
                          </p>
                        </CardFooter>
                      </div>
                    </CardContent>

                    <div className="absolute top-8 right-8 sm:top-14 sm:right-14 w-12 h-12 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2rem] glass flex items-center justify-center text-white group-hover:bg-accent-secondary group-hover:text-white transition-all duration-500 shadow-2xl z-30 border border-white/10">
                      <Zap size={24} className="sm:w-8 sm:h-8 fill-current" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/20 to-transparent" />
        </section>
      )}
    </div>
  );
}
