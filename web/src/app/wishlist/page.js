'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { getImageUrl } from '@/utils/imageUtils';
import Loader from '@/components/common/Loader';
import { useProductCondition } from '@/store/productCondition';
import { swalToast, swalError } from '@/utils/swal';
import { useAppStore } from '@/store/appStore';
import { useTrackingStore } from '@/store/trackingStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, ArrowRight, Info } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const DICTIONARY = {
  en: {
    title: 'The Vault', sub: 'Your curated artifacts.',
    empty: 'The Vault is Empty', browse: 'Explore Collection',
    add: 'Move to Bag', remove: 'Remove',
    syncTip: 'Log in to sync your vault across all devices.'
  },
  bn: {
    title: 'সংরক্ষিত ভল্ট', sub: 'আপনার বাছাইকৃত পণ্যসমূহ।',
    empty: 'ভল্টটি খালি', browse: 'কালেকশন দেখুন',
    add: 'ব্যাগে নিন', remove: 'সরিয়ে ফেলুন',
    syncTip: 'সব ডিভাইসে আপনার ভল্ট সিঙ্ক করতে লগইন করুন।'
  }
};

export default function WishlistPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { lang, isMounted } = useAppStore();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY['en'], [lang]);

  const trackAddToCart = useTrackingStore((state) => state.trackAddToCart);
  const wishlistItems = useProductCondition((state) => state.wishlistItems);
  const toggleWishlist = useProductCondition((state) => state.toggleWishlist);
  const addToCart = useProductCondition((state) => state.addToCart);

  const handleMoveToCart = (product) => {
    const availableSizes = product.sizes?.filter(s => s.stock > 0);
    if (!availableSizes?.length) return swalError('Out of Stock', 'Item unavailable.');
    
    const sizeId = availableSizes[0].size._id || availableSizes[0].size;
    const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);

    // 🚀 Instant store update (Handles both Guest & Auth via isAuthenticated flag)
    addToCart(product, sizeId, 1, isAuthenticated);
    toggleWishlist(product, isAuthenticated);

    trackAddToCart(product._id, discountedPrice, 1);
    swalToast(lang === 'bn' ? 'ব্যাগে মুভ করা হয়েছে' : 'Moved to Bag', 'success');
  };

  const handleRemove = (product) => {
    toggleWishlist(product, isAuthenticated);
    swalToast(lang === 'bn' ? 'ভল্ট থেকে সরানো হয়েছে' : 'Removed from vault', 'success');
  };

  if (!isMounted || authLoading) return <div className="min-h-screen flex items-center justify-center dark:bg-[#050505]"><Loader /></div>;

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] py-12 lg:py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/5 blur-[120px] -z-10" />

      <div className="max-w-[1700px] mx-auto px-4 md:px-10">
        
        {/* --- Header Section --- */}
        <header className="mb-16 border-b border-zinc-100 dark:border-white/5 pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-9xl font-black tracking-tighter uppercase italic dark:text-white leading-[0.8]">
                The <span className="text-transparent stroke-black dark:stroke-white" style={{ WebkitTextStroke: '1.5px currentColor' }}>Vault</span>
              </h1>
              <p className="mt-6 text-zinc-400 uppercase text-[10px] font-black tracking-[0.5em]">{ui.sub}</p>
            </div>

            {/* 🚀 Guest Sync Banner: Only shown to logged-out users */}
            {!isAuthenticated && wishlistItems.length > 0 && (
              <Link href="/login?redirect=/wishlist" className="flex items-center gap-3 bg-zinc-50 dark:bg-white/5 px-6 py-4 rounded-2xl border border-zinc-100 dark:border-white/10 hover:border-rose-500/30 transition-all">
                <Info size={16} className="text-rose-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  {ui.syncTip}
                </span>
              </Link>
            )}
          </div>
        </header>

        <AnimatePresence mode="popLayout">
          {!wishlistItems.length ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-40 text-center">
               <h2 className="text-2xl font-black uppercase text-zinc-300 dark:text-zinc-800 tracking-widest mb-8">{ui.empty}</h2>
               <Link href="/products" className="group flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest dark:text-white">
                 {ui.browse} <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
               </Link>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10"
            >
              {wishlistItems.map((product) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  key={product._id} 
                  className="group relative bg-zinc-50 dark:bg-white/5 rounded-[2.5rem] border border-zinc-100 dark:border-white/5 overflow-hidden"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img src={getImageUrl(product.images?.[0])} alt={product.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                    <button 
                      onClick={() => handleRemove(product)} 
                      className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-rose-600 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="min-h-[60px]">
                      <h3 className="text-lg font-black uppercase tracking-tight dark:text-white line-clamp-1">{product.name}</h3>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{product.category?.name}</p>
                    </div>

                    <div className="flex items-center justify-between">
                       <span className="text-2xl font-black dark:text-white tracking-tighter">৳{(product.price - (product.price * (product.discount || 0) / 100)).toFixed(0)}</span>
                    </div>

                    <button 
                      onClick={() => handleMoveToCart(product)}
                      className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-600 hover:text-white transition-all duration-300"
                    >
                      <ShoppingBag size={14} />
                      {ui.add}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}