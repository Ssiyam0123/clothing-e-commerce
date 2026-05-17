"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import FlashSaleBanner from "@/app/_common/components/FlashSaleBanner";

export default function UpcomingSalesSection({ upcomingSales, ui }) {
  if (upcomingSales.length === 0) return null;

  return (
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
          {upcomingSales.map((sale) => (
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
  );
}
