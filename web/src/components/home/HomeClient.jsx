'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import { DICTIONARY } from '@/app/homeDictionary';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useFlashSales } from '@/hooks/useFlashSale';
import { useActiveBannerCampaign } from '@/hooks/useActiveBannerCampaign';
import { motion } from 'framer-motion';

import HeroSection from './HeroSection';
import UspSection from './UspSection';
import FlashSaleTeaser from './FlashSaleTeaser';
import CategoryGrid from './CategoryGrid';
import ProductSection from './ProductSection';
import Newsletter from './Newsletter';
import { GridSkeleton, HeroSkeleton } from '../common/Skeletons';

// 🚀 Premium Animation Variants for Sections
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 80, damping: 20, delay: 0.1 } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

// 💎 Reusable Premium Section Header
const SectionHeader = ({ title, subtitle }) => (
  <div className="flex flex-col mb-16 gap-3">
    <h2 className="text-4xl md:text-6xl font-blackuppercase italic tracking-tighter text-gray-900 dark:text-white uppercase">
      {title}
    </h2>
    <div className="h-1.5 w-20 bg-rose-600 rounded-full" />
    {subtitle && (
      <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.3em] pt-1">
        {subtitle}
      </p>
    )}
  </div>
);

export default function HomeClient() {
  const { lang, isMounted } = useAppStore();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY['en'], [lang]);

  const { products, isLoading: productsLoading } = useProducts({ limit: 8 });
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { flashSaleProducts, isLoading: flashSaleLoading } = useFlashSales();
  const { activeCampaign, isLoading: bannerLoading } = useActiveBannerCampaign();

  const featuredProducts = useMemo(() => products?.filter(p => p.isFeatured) || [], [products]);
  const newArrivals = useMemo(() => products || [], [products]);

  return (
    <motion.main 
      initial="hidden" 
      animate="visible" 
      variants={staggerContainer} 
      className="w-full bg-white dark:bg-[#050505] transition-colors duration-700"
    >
      {/* 1. Hero Section - Seamless Transition */}
      {bannerLoading ? (
        <HeroSkeleton />
      ) : (
        <motion.div variants={sectionVariants}>
          <HeroSection 
            slides={activeCampaign?.slides?.sort((a, b) => a.order - b.order) || []} 
            ui={ui} 
            lang={lang} 
          />
        </motion.div>
      )}

      {/* 2. USP Section - Subtle Highlight */}
      <motion.div variants={sectionVariants} whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        <UspSection ui={ui} />
      </motion.div>

      {/* Main Content Area - Dynamic Grid & Spacing */}
      <div className="space-y-28 md:space-y-36 pb-36 px-4 sm:px-8 lg:px-12 max-w-[1700px] mx-auto">
        
        {/* 3. Flash Sale Teaser - High Energy */}
        {flashSaleLoading ? (
          <div className="py-16"><GridSkeleton count={4} /></div>
        ) : flashSaleProducts?.flashSale && (
          <motion.div variants={sectionVariants} whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <FlashSaleTeaser 
              activeSale={flashSaleProducts.flashSale} 
              flashSaleProducts={flashSaleProducts} 
              ui={ui} 
              lang={lang} 
            />
          </motion.div>
        )}

        {/* 4. Category Grid - Premium Drag/Swiper */}
        <motion.div variants={sectionVariants} whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <CategoryGrid categories={categories} ui={ui} isLoading={categoriesLoading} />
        </motion.div>
        
        {/* 5. Featured Artifacts - Minimalist Grid */}
        <motion.section 
          variants={sectionVariants} 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-16"
        >
          <SectionHeader title={ui.featTitle} subtitle="Curated VANGUARD Selections" />
          
          {productsLoading ? (
            <GridSkeleton count={4} />
          ) : (
            <div className="bg-surface py-5  md:p-12 rounded-[2.5rem] border border-zinc-100 dark:border-white/5 shadow-inner">
               <ProductSection products={featuredProducts} lang={lang} ui={ui} />
            </div>
          )}
        </motion.section>

        {/* 6. New Arrivals - Dynamic Loading */}
        <motion.section 
          variants={sectionVariants} 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-16"
        >
          <SectionHeader title={ui.newTitle} subtitle="Fresh from the Foundry" />
          
          {productsLoading ? (
            <GridSkeleton count={4} />
          ) : (
             <ProductSection products={newArrivals} lang={lang} showLoadMore={true} ui={ui} />
          )}
        </motion.section>
        
        {/* 7. Newsletter - Final Cinematic Touch */}
        <motion.div variants={sectionVariants} whileInView="visible" viewport={{ once: true }}>
          <Newsletter ui={ui} lang={lang} />
        </motion.div>
      </div>

      {/* Performance Hider for Hydration */}
      {!isMounted && <div className="fixed inset-0 bg-white dark:bg-[#050505] z-[9999] pointer-events-none opacity-0" />}
    </motion.main>
  );
}