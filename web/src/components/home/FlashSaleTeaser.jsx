"use client";

import Link from "next/link";
import FlashSaleProductCard from "@/components/store/FlashSaleProductCard";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

export default function FlashSaleTeaser({
  activeSale,
  flashSaleProducts,
  ui,
  lang,
}) {
  if (!activeSale || !flashSaleProducts?.products?.length) return null;

  const isBn = lang === "bn";

  return (
    <section className="relative py-12 overflow-hidden bg-white dark:bg-[#050505]">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-600/5 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-indigo-600/5 blur-[80px] rounded-full -z-10" />

      <div className="max-w-[1700px] mx-auto px-4 sm:px-10">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <div className="space-y-6 w-full">
            {/* Live Badge */}
           <div className="flex justify-between w-100%">

             <div className="flex items-center gap-2.5 bg-rose-600/10 dark:bg-rose-600/20 w-fit px-4 py-2 rounded-full border border-rose-600/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <p className="text-rose-600 dark:text-rose-400 font-black text-[10px] uppercase tracking-[0.4em]">
                {isBn ? "লাইভ ড্রপ" : "Live Drop"}
              </p>
            </div>
 {/* Action Link */}
          <div className="flex flex-col items-start md:items-end gap-2">
            <Link
              href="/flash-sale"
              className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/5 px-8 py-5 rounded-2xl hover:bg-rose-600 hover:text-white transition-all duration-500"
            >
              {isBn ? "সবগুলো দেখুন" : "See More"}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-2 transition-transform"
              />
            </Link>
          </div>
           </div>
            {/* Title with Outline Effect */}
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic text-gray-900 dark:text-white leading-[0.8] transition-all">
              Flash Sale
              <br />
          
            </h2>
          </div>

         
        </div>

        {/* --- Product Grid --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10"
        >
          {flashSaleProducts.products.slice(0, 4).map((p, idx) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
            >
              <FlashSaleProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
