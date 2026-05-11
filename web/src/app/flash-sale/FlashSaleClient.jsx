"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/appStore";
import { useFlashSales } from "@/hooks/client/useFlashSale";
import FlashSaleBanner from "@/components/store/FlashSaleBanner";
import ProductCard from "@/components/common/ProductCard";
import { Clock, Zap, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const DICTIONARY = {
  en: {
    emptyTitle: "The Vault is Closed",
    explore: "Explore Collection",
    activeTitle: "Live Drops Active",
    upcomingTitle: "Upcoming Sequences",
    viewDetails: "Inspect Drop",
    liveNow: "Live",
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
    setNow(new Date());
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
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 space-y-12">
          <Skeleton className="h-[400px] sm:h-[600px] w-full rounded-[4rem] bg-accent/10" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
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
                <Link href={`/flash-sale/${sale.slug}`} className="block group">
                   <FlashSaleBanner flashSale={sale} />
                </Link>
 
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-10 lg:gap-12">
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

            <div className="space-y-20 sm:space-y-40">
              {upcomingSales.map((sale, idx) => (
                <motion.div
                  key={sale._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                   <Link href={`/flash-sale/${sale.slug}`} className="block group">
                      <FlashSaleBanner flashSale={sale} />
                   </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
