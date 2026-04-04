'use client';

import Link from 'next/link';
import ProductCard from '@/components/common/ProductCard';
import { motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';

export default function ProductSection({ title, subTitle, products, lang, isDarkBg = false, showLoadMore = false, ui }) {
  if (!products || products.length === 0) return null;

  // 🚀 Animation Variants for Staggered Entry
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 100, damping: 20 } 
    },
  };

  return (
    <section className={`md:py-36 transition-colors duration-700 ${
      isDarkBg ? 'bg-zinc-50 dark:bg-[#080808]' : 'bg-transparent'
    }`}>
      <div className="max-w-[1700px] mx-auto px-4 md:px-10">
        
       

        {/* --- Product Grid with Motion --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10"
        >
          {products.map((p) => (
            <motion.div key={p._id} variants={itemVariants}>
              <ProductCard product={p} lang={lang} />
            </motion.div>
          ))}
        </motion.div>

        {/* --- Load More Button --- */}
        {showLoadMore && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 md:mt-24 text-center"
          >
            <Link 
              href="/products" 
              className="relative inline-flex items-center gap-3 overflow-hidden bg-black dark:bg-white text-white dark:text-black px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] hover:scale-105 active:scale-95 transition-all group shadow-2xl"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
              {ui?.loadMore || (lang === 'bn' ? 'আরও দেখুন' : 'Load Artifacts')}
              
              {/* Subtle hover overlay */}
              <div className="absolute inset-0 bg-rose-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 -z-10" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}