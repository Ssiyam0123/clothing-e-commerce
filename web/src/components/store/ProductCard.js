'use client';

import Link from 'next/link';
import { useWishlist } from '@/hooks/useWishlist';
import { swalToast, swalError } from '@/utils/swal';
import OptimizedImage from '@/components/common/OptimizedImage'; 
import StarRating from '../store/StarRating';
import { motion } from 'framer-motion';

const getDynamicImageIndex = (productId, imagesLength) => {
  if (!imagesLength || imagesLength <= 1) return 0;
  const idSuffix = productId.slice(-3);
  const numericValue = parseInt(idSuffix, 16) || 0; 
  return numericValue % imagesLength;
};

export default function ProductCard({ product, lang = 'en' }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);
  const rating = product.averageRating || 0;
  const reviewCount = product.totalReviews || 0;
  const isBn = lang === 'bn';

  const displayImageIndex = getDynamicImageIndex(product._id, product.images?.length);

  const handleWishlist = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    try {
      if (inWishlist) {
        await removeFromWishlist(product._id);
        swalToast(isBn ? 'ইচ্ছেতালিকা থেকে সরানো হয়েছে' : 'Removed from Wishlist', 'success');
      } else {
        await addToWishlist(product._id);
        swalToast(isBn ? 'ইচ্ছেতালিকায় যোগ করা হয়েছে' : 'Added to Wishlist', 'success');
      }
    } catch (err) {
      swalError(isBn ? 'ত্রুটি' : 'Sync Error', isBn ? 'ভল্ট আপডেট করা যায়নি।' : 'Vault could not be updated.');
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative flex flex-col h-full bg-white dark:bg-[#0a0a0a] rounded-[1.5rem] md:rounded-[2rem] border border-zinc-100 dark:border-zinc-800/60 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-white/5"
    >
      <Link 
        href={`/products/${product._id}`} 
        className="absolute inset-0 z-10" 
        aria-label={product.name} 
      />
      
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800/60 pointer-events-none">
        <OptimizedImage
          src={product.images?.[displayImageIndex]}
          alt={product.name}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="grayscale-[15%] group-hover:grayscale-0 transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Wishlist Button */}
        <motion.button 
          whileTap={{ scale: 0.8 }}
          onClick={handleWishlist}
          className={`absolute top-3 right-3 md:top-5 md:right-5 z-20 p-2 md:p-2.5 rounded-full backdrop-blur-xl border transition-all duration-300 ${
            inWishlist 
              ? 'bg-rose-500 border-rose-500 text-white' 
              : 'bg-white/70 dark:bg-black/20 border-black/5 dark:border-white/10 text-zinc-900 dark:text-white'
          }`}
        >
          <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </motion.button>

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 md:top-5 md:left-5 z-20 bg-zinc-900 text-white dark:bg-white dark:text-black text-[8px] md:text-[9px] font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-widest shadow-lg">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 md:p-6 flex flex-col flex-1 relative z-20 pointer-events-none">
        <div className="flex items-center gap-1.5 mb-2">
           <StarRating rating={rating} size="small" />
           {reviewCount > 0 && <span className="text-[8px] md:text-[9px] font-bold text-zinc-400">({reviewCount})</span>}
        </div>

        {/* 🚀 FIXED: line-clamp-2 added for better text containment */}
        <h3 className={`text-sm md:text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight line-clamp-2 min-h-[2.5rem] md:min-h-[3.5rem] mb-1 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors ${isBn ? 'font-sans' : ''}`}>
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
  );
}