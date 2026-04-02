'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import { DICTIONARY } from '@/app/homeDictionary';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useFlashSales } from '@/hooks/useFlashSale';
import { useActiveBannerCampaign } from '@/hooks/useActiveBannerCampaign';

import HeroSection from './HeroSection';
import UspSection from './UspSection';
import FlashSaleTeaser from './FlashSaleTeaser';
import CategoryGrid from './CategoryGrid';
import ProductSection from './ProductSection';
import Newsletter from './Newsletter';
import { GridSkeleton, HeroSkeleton } from '../common/Skeletons';


export default function HomeClient() {
  // ১. হুকগুলো কল করলি
  const { lang, isMounted } = useAppStore();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY['en'], [lang]);

  const { products, isLoading: productsLoading } = useProducts({ limit: 8 });
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { flashSaleProducts, isLoading: flashSaleLoading } = useFlashSales();
  const { activeCampaign, isLoading: bannerLoading } = useActiveBannerCampaign();

  const featuredProducts = useMemo(() => products?.filter(p => p.isFeatured) || [], [products]);
  const newArrivals = useMemo(() => products || [], [products]);


  return (
    <div className="w-full">
      
      {bannerLoading ? (
        <HeroSkeleton />
      ) : (
        <HeroSection 
          slides={activeCampaign?.slides?.sort((a, b) => a.order - b.order) || []} 
          ui={ui} 
          lang={lang} 
        />
      )}

      <UspSection ui={ui} />

      <div className="space-y-24 pb-24 px-4 sm:px-6 lg:px-10 max-w-[1600px] mx-auto">
        
        {/* 2. Flash Sale */}
        {flashSaleLoading ? (
          <div className="py-10"><GridSkeleton count={4} /></div>
        ) : flashSaleProducts?.flashSale && (
          <FlashSaleTeaser 
            activeSale={flashSaleProducts.flashSale} 
            flashSaleProducts={flashSaleProducts} 
            ui={ui} 
            lang={lang} 
          />
        )}

        {/* 3. Category Grid */}
        <CategoryGrid categories={categories} ui={ui} isLoading={categoriesLoading} />
        
        {/* 4. Featured Section */}
        <div className="space-y-12">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-8">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase dark:text-white">{ui.featTitle}</h2>
          </div>
          {productsLoading ? <GridSkeleton count={4} /> : <ProductSection products={featuredProducts} lang={lang} ui={ui} />}
        </div>

        {/* 5. New Arrivals */}
        <div className="space-y-12">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-8">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase dark:text-white">{ui.newTitle}</h2>
          </div>
          {productsLoading ? <GridSkeleton count={4} /> : <ProductSection products={newArrivals} lang={lang} showLoadMore={true} ui={ui} />}
        </div>
        
        <Newsletter ui={ui} lang={lang} />
      </div>

      {/* 🛠️ Hydration Fix: ক্লায়েন্ট সাইডে ভাষা বা থিম সিঙ্ক হলে রি-রেন্ডার করবে */}
      {!isMounted && <div className="fixed inset-0 bg-[#fcfcfc] dark:bg-[#050505] z-[9999] pointer-events-none opacity-0" />}
    </div>
  );
}