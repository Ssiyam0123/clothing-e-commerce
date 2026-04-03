'use client';

import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { getImageUrl } from '@/utils/imageUtils';
import Loader from '@/components/common/Loader';
import { useProductCondition } from '@/store/productCondition';
import { swalToast, swalConfirm, swalError } from '@/utils/swal';
import { useAppStore } from '@/store/appStore';
import { useTrackingStore } from '@/store/trackingStore';
import { motion, AnimatePresence } from 'framer-motion';

const DICTIONARY = {
  en: {
    title: 'The Vault',
    sub: 'Your curated selection of premium aesthetics.',
    empty: 'The Vault is Empty',
    browse: 'Explore Collection',
    add: 'Add to Bag',
    remove: 'Remove',
    restricted: 'Access Restricted',
    restrictedSub: 'Please sign in to access your saved vault.',
    join: 'Sign In / Join',
  },
  bn: {
    title: 'সংরক্ষিত ভল্ট',
    sub: 'আপনার বাছাইকৃত প্রিমিয়াম কালেকশন।',
    empty: 'ভল্টটি বর্তমানে খালি',
    browse: 'কালেকশন দেখুন',
    add: 'ব্যাগে যোগ করুন',
    remove: 'সরিয়ে ফেলুন',
    restricted: 'অ্যাক্সেস সীমিত',
    restrictedSub: 'আপনার ভল্ট দেখতে দয়া করে লগইন করুন।',
    join: 'লগইন / যোগ দিন',
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUpCard = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

export default function WishlistPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { lang, isMounted } = useAppStore();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY['en'], [lang]);
  const isBn = lang === 'bn';

  const trackAddToCart = useTrackingStore((state) => state.trackAddToCart);
  
  // Use the store
  const wishlistItems = useProductCondition((state) => state.wishlistItems);
  const toggleWishlist = useProductCondition((state) => state.toggleWishlist);
  const addToCart = useProductCondition((state) => state.addToCart);

  const handleAddToCart = async (e, product) => {
    e.preventDefault(); e.stopPropagation();
    const availableSizes = product.sizes?.filter(s => s.stock > 0);
    if (!availableSizes?.length) return swalError('Out of Stock', 'This item is currently unavailable.');
    const sizeId = availableSizes[0].size._id || availableSizes[0].size;
    try {
      await addToCart(product, sizeId, 1);
      await toggleWishlist(product); // remove from wishlist after adding to cart
      const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);
      trackAddToCart(product._id, discountedPrice, 1);
      swalToast(isBn ? 'ব্যাগে যোগ করা হয়েছে' : 'Moved to Bag', 'success');
    } catch (error) {
      swalError('Failed', 'Could not move item to cart.');
    }
  };

  const handleRemove = async (e, productId) => {
    e.preventDefault(); e.stopPropagation();
    const product = wishlistItems.find(p => p._id === productId);
    if (!product) return;
    const confirmed = await swalConfirm(isBn ? 'মুছে ফেলতে চান?' : 'Remove from Vault?', isBn ? 'এই পণ্যটি আপনার তালিকা থেকে সরিয়ে ফেলা হবে।' : 'This item will be removed from your collection.');
    if (confirmed) {
      await toggleWishlist(product);
      swalToast(isBn ? 'সরিয়ে ফেলা হয়েছে' : 'Removed from vault', 'success');
    }
  };

  // Loader states
  if (!isMounted || authLoading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-[#050505]"><Loader /></div>;
  }

  if (!user) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="min-h-[80vh] flex flex-col items-center justify-center bg-[#fcfcfc] dark:bg-[#050505] px-6 text-center transition-colors duration-500">
        <span className="text-7xl mb-8 grayscale opacity-20 drop-shadow-lg">🔒</span>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-zinc-900 dark:text-white">{ui.restricted}</h1>
        <p className="text-zinc-500 mb-10">{ui.restrictedSub}</p>
        <Link href="/login" className="bg-zinc-900 dark:bg-white text-white dark:text-black px-12 py-5 rounded-full font-black uppercase text-[11px] tracking-widest">
          {ui.join}
        </Link>
      </motion.div>
    );
  }

  // Empty vault
  if (!wishlistItems.length) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="min-h-[80vh] flex flex-col items-center justify-center bg-[#fcfcfc] dark:bg-[#050505] px-6 text-center transition-colors duration-500">
        <span className="text-7xl mb-8 grayscale opacity-20 drop-shadow-lg">🖤</span>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-zinc-900 dark:text-white">{ui.empty}</h1>
        <Link href="/products" className="text-zinc-400 border-b-2 border-zinc-200 dark:border-white/10 pb-2 hover:text-black dark:hover:text-white transition-all uppercase text-[10px] font-black tracking-[0.4em]">
          {ui.browse}
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] py-12 lg:py-24 transition-colors duration-700 overflow-x-hidden relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-20 border-b border-zinc-100 dark:border-white/5 pb-10">
          <h1 className={`text-5xl md:text-8xl font-black tracking-tighter uppercase mb-4 leading-none text-zinc-900 dark:text-white ${isBn ? 'font-sans' : ''}`}>{ui.title}</h1>
          <p className="text-zinc-400 uppercase text-[10px] font-black tracking-[0.4em]">{ui.sub}</p>
        </motion.header>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {wishlistItems.map((product) => {
              const discPrice = product.price - (product.price * (product.discount || 0) / 100);
              return (
                <motion.div layout variants={fadeUpCard} key={product._id} whileHover={{ y: -8 }} className="group relative flex flex-col bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-100 dark:border-white/5 transition-shadow duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_40px_80px_-20px_rgba(255,255,255,0.05)] overflow-hidden">
                  <div className="relative aspect-[3/4] overflow-hidden bg-zinc-50 dark:bg-[#111] border-b border-zinc-100 dark:border-white/5">
                    <Link href={`/products/${product._id}`} className="block w-full h-full">
                      <img src={getImageUrl(product.images?.[0])} alt={product.name} className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                    </Link>
                    {product.discount > 0 && (<div className="absolute top-5 left-5 bg-zinc-900 text-white dark:bg-white dark:text-black px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl z-10">-{product.discount}%</div>)}
                    <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={(e) => handleRemove(e, product._id)} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-zinc-200 dark:border-white/10 text-zinc-400 hover:text-rose-500 hover:border-rose-500/30 transition-colors flex items-center justify-center z-10 shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </motion.button>
                  </div>
                  <div className="p-6 flex flex-col flex-1 relative z-10">
                    <div className="mb-4">
                      <h3 className={`text-base font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight truncate mb-1 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors ${isBn ? 'font-sans' : ''}`}>{product.name}</h3>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{product.category?.name || 'Vanguard Collection'}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-4">
                      <div className="flex flex-col"><span className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">৳{discPrice.toFixed(2)}</span>{product.discount > 0 && (<span className="text-[10px] font-bold text-zinc-400 line-through tracking-tighter">৳{product.price.toFixed(2)}</span>)}</div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded-md bg-zinc-50 dark:bg-zinc-900">In Stock</span>
                    </div>
                    <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-white/5">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={(e) => handleAddToCart(e, product)} className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:shadow-black/20 dark:hover:shadow-white/10 transition-shadow">{ui.add}</motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}