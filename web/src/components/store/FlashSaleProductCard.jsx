'use client';

import Link from 'next/link';
import { getImageUrl } from '@/utils/imageUtils';
import { useWishlist } from '@/hooks/useWishlist';
import { useAppStore } from '@/store/appStore';
import { motion } from 'framer-motion';
import StarRating from './StarRating';
import { swalToast, swalError } from '@/utils/swal';

export default function ProductCard({ product }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { lang } = useAppStore(); 

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);
  const rating = product.averageRating || 0;
  const reviewCount = product.totalReviews || 0;

  const handleWishlist = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    try {
      if (inWishlist) {
        await removeFromWishlist(product._id);
        swalToast(lang === 'bn' ? 'ইচ্ছেতালিকা থেকে সরানো হয়েছে' : 'Removed from Wishlist', 'success');
      } else {
        await addToWishlist(product._id);
        swalToast(lang === 'bn' ? 'ইচ্ছেতালিকায় যোগ করা হয়েছে' : 'Added to Wishlist', 'success');
      }
    } catch (err) {
      swalError('Sync Error', 'Vault could not be updated.');
    }
  };

  return (
    <Link href={`/products/${product._id}`} className="block w-full outline-none">
      <motion.div 
        whileHover={{ y: -8, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="group relative flex flex-col h-full bg-white dark:bg-[#050505] rounded-[1.5rem] md:rounded-[2rem] border border-zinc-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_30px_60px_-15px_rgba(255,255,255,0.05)]"
      >
        
        {/* Image Container with Cinematic Gradient */}
        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-white/5">
          <motion.img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-1000 ease-out"
            whileHover={{ scale: 1.08 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <motion.button 
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className={`absolute top-4 right-4 md:top-5 md:right-5 z-20 p-2 md:p-2.5 rounded-full backdrop-blur-xl border transition-all duration-300 ${
              inWishlist 
                ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/30' 
                : 'bg-white/80 dark:bg-black/40 border-black/5 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-white hover:text-black'
            }`}
          >
            <svg className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </motion.button>

          {product.discount > 0 && (
            <div className="absolute bottom-4 left-4 md:bottom-5 md:left-5 bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-[8px] md:text-[9px] font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-6 flex flex-col flex-1 relative z-10">
          <div className="flex items-center gap-2 mb-2 md:mb-3">
             <StarRating rating={rating} size="small" />
             {reviewCount > 0 && <span className="text-[8px] md:text-[9px] font-bold text-zinc-400 uppercase tracking-widest">({reviewCount})</span>}
          </div>

          {/* 🚀 FIXED: Mobile Font & Clamping */}
          <h3 className={`text-sm md:text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight line-clamp-2 min-h-[2.5rem] md:min-h-[3.5rem] mb-1 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors ${lang === 'bn' ? 'font-sans leading-relaxed' : 'leading-tight'}`}>
            {product.name}
          </h3>
          
          <div className="mt-auto flex flex-wrap items-end gap-2 md:gap-3 pt-2">
            <span className="text-lg md:text-2xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">
              ৳{discountedPrice.toFixed(0)}
            </span>
            {product.discount > 0 && (
              <span className="text-[10px] md:text-sm font-bold text-zinc-400 line-through tracking-tight leading-none mb-0.5">
                ৳{product.price.toFixed(0)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}