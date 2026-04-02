'use client';

import Link from 'next/link';
import FlashSaleProductCard from '@/components/store/FlashSaleProductCard';
import { motion } from 'framer-motion';

export default function FlashSaleTeaser({ activeSale, flashSaleProducts, ui, lang }) {
  // 🛡️ Guard Clause
  if (!activeSale || !flashSaleProducts?.products?.length) return null;

  // ফ্রেমার মোশন ভ্যারিয়েন্ট
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-rose-500/[0.02] border-b border-zinc-100 dark:border-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Area */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <p className="text-rose-500 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.4em]">
                Live Now
              </p>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-zinc-900 dark:text-white leading-none">
              Flash <span className="text-rose-600 italic">Sale</span>
            </h2>
          </div>
          
          <Link 
            href="/flash-sale" 
            className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-rose-500 transition-colors border-b border-zinc-200 dark:border-zinc-800 pb-1"
          >
            {lang === 'en' ? 'View All' : 'সব দেখুন'} →
          </Link>
        </div>

        {/* 🚀 Grid: Mobile 2 cols, Desktop 4 cols */}
        {/* gap-4 for mobile, gap-8 for desktop */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
        >
          {flashSaleProducts.products.slice(0, 4).map((p) => (
            <motion.div key={p._id} variants={itemVariants}>
              <FlashSaleProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
        
      </div>
    </section>
  );
}