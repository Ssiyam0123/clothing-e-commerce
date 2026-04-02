'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppStore } from '@/store/appStore';
import { useFlashSales } from '@/hooks/useFlashSale';
import FlashSaleBanner from '@/components/store/FlashSaleBanner';
import FlashSaleProductCard from '@/components/store/FlashSaleProductCard';
import { FlashBannerSkeleton, GridSkeleton } from '@/components/common/Skeletons';

const DICTIONARY = {
  en: {
    emptyTitle: 'The Vault is Closed',
    emptySub: 'Our exclusive drops are currently paused. Check back later.',
    explore: 'Explore Collection',
    liveDeals: 'Live Drops Active',
    saleTitle: 'Flash Sale',
    comingSoon: 'Coming Soon',
  },
  bn: {
    emptyTitle: 'ক্যাম্পেইন বন্ধ আছে',
    emptySub: 'আমাদের এক্সক্লুসিভ অফারগুলো বর্তমানে বন্ধ রয়েছে।',
    explore: 'কালেকশন দেখুন',
    liveDeals: 'লাইভ অফার চলছে',
    saleTitle: 'ফ্ল্যাশ সেল',
    comingSoon: 'শীঘ্রই আসছে',
  }
};

export default function FlashSaleClient() {
  const { lang, isMounted } = useAppStore();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY['en'], [lang]);

  const { flashSaleProducts, isLoading } = useFlashSales();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <FlashBannerSkeleton />
        <div className="mt-12">
          <GridSkeleton count={8} />
        </div>
      </div>
    );
  }

  const activeSale = flashSaleProducts?.flashSale;
  const products = flashSaleProducts?.products || [];

  if (!activeSale) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <span className="text-8xl mb-8 grayscale opacity-20">⏳</span>
        <h2 className="text-4xl font-black uppercase dark:text-white mb-4">{ui.emptyTitle}</h2>
        <p className="text-zinc-500 mb-10">{ui.emptySub}</p>
        <Link href="/products" className="bg-zinc-900 dark:bg-white text-white dark:text-black px-12 py-5 rounded-full font-black uppercase text-[11px] tracking-widest">{ui.explore}</Link>
      </div>
    );
  }

  return (
    <div className="pb-32 font-sans overflow-x-hidden relative pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-20">
        <FlashSaleBanner flashSale={activeSale} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-end mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <div>
            <p className="text-rose-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              {ui.liveDeals}
            </p>
            <h2 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none">
              {activeSale.name}
            </h2>
          </div>
        </div>

        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {products.map((p) => (
            <motion.div key={p._id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <FlashSaleProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}