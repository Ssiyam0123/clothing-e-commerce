'use client';

import Link from 'next/link';
import { getImageUrl } from '@/utils/imageUtils';
import { useProductCondition } from '@/store/productCondition';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/appStore';
import { motion } from 'framer-motion';
import StarRating from './StarRating';
import { Heart, Zap } from 'lucide-react';
import { swalToast, swalError } from '@/utils/swal';

export default function FlashSaleProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const { lang } = useAppStore();
  const isBn = lang === 'bn';

  // 🚀 SENIOR FIX: Selector pattern to prevent wishlist glitch
  const toggleWishlist = useProductCondition((state) => state.toggleWishlist);
  const inWishlist = useProductCondition((state) =>
    state.wishlistItems.some((p) => String(p._id) === String(product?._id))
  );

  if (!product) return null;

  const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // 👈 কার্ডের লিঙ্কে ক্লিক হওয়া আটকাবে
    try {
      await toggleWishlist(product, isAuthenticated);
      swalToast(
        inWishlist 
          ? (isBn ? 'ইচ্ছেতালিকা থেকে সরানো হয়েছে' : 'Removed from Vault') 
          : (isBn ? 'ইচ্ছেতালিকায় যোগ করা হয়েছে' : 'Added to Vault'), 
        'success'
      );
    } catch (err) {
      swalError(isBn ? 'ত্রুটি' : 'Sync Error', 'Could not update vault.');
    }
  };

  return (
    <Link href={`/products/${product._id}`} className="group block h-full outline-none">
      <motion.div
        whileHover={{ y: -8, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative flex flex-col h-full bg-white dark:bg-[#050505] rounded-[1.25rem] md:rounded-[2rem] border border-rose-100 dark:border-rose-900/20 overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.15)] transition-all duration-500"
      >
        {/* Flash Sale Badge */}
        <div className="absolute top-0 left-0 z-20 bg-rose-600 text-white px-3 py-1.5 rounded-br-2xl flex items-center gap-1 shadow-md">
          <Zap size={10} fill="white" />
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">
            {product.discount}% OFF
          </span>
        </div>

        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50 dark:bg-zinc-900 border-b border-rose-50 dark:border-rose-900/10">
          <motion.img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-1000 ease-out"
            whileHover={{ scale: 1.1 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-rose-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* 🚀 Wishlist Button: No White Border, Turns Red on Active */}
          <button
            type="button"
            onClick={handleWishlist}
            className={`absolute top-3 right-3 md:top-5 md:right-5 z-20 p-2 md:p-2.5 rounded-full backdrop-blur-md transition-all duration-300 active:scale-75 ${
              inWishlist 
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40' 
                : 'bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-zinc-100'
            }`}
          >
            <Heart 
              size={16} 
              fill={inWishlist ? "currentColor" : "none"} 
              strokeWidth={inWishlist ? 0 : 2.5}
            />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={product.averageRating || 0} size="small" />
            {product.totalReviews > 0 && (
              <span className="text-[8px] font-bold text-zinc-400">({product.totalReviews})</span>
            )}
          </div>

          <h3 className={`text-sm md:text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight line-clamp-2 min-h-[2.5rem] md:min-h-[3.5rem] mb-2 group-hover:text-rose-600 transition-colors ${isBn ? 'font-sans leading-relaxed' : 'uppercase leading-tight'}`}>
            {product.name}
          </h3>
          
          <div className="mt-auto flex flex-wrap items-center gap-2 md:gap-3 pt-2">
            <span className="text-xl md:text-3xl font-black text-rose-600 dark:text-rose-500 tracking-tighter leading-none">
              ৳{discountedPrice.toFixed(0)}
            </span>
            <span className="text-[10px] md:text-sm font-bold text-zinc-400 line-through tracking-tight">
              ৳{product.price.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Stock Progress Bar */}
        <div className="h-1 w-full bg-rose-100 dark:bg-rose-950/20">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '75%' }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-rose-600 rounded-r-full shadow-[0_0_8px_rgba(225,29,72,0.5)]" 
          />
        </div>
      </motion.div>
    </Link>
  );
}