"use client";

import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import FlashSaleBanner from "@/components/common/FlashSaleBanner";
import ProductCard from "@/components/common/ProductCard";

export default function ActiveSalesSection({ activeSales, upcomingSalesLength, ui }) {
  return (
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
      ) : upcomingSalesLength === 0 ? (
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
  );
}
