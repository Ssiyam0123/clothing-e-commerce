'use client';

import Link from 'next/link';
import { useWishlist } from '@/hooks/useWishlist';
import { swalToast, swalError } from '@/utils/swal';
import OptimizedImage from '@/components/common/OptimizedImage'; 
import StarRating from '../store/StarRating';

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

  const displayImageIndex = getDynamicImageIndex(product._id, product.images?.length);

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
      swalError(
        lang === 'bn' ? 'ত্রুটি' : 'Sync Error', 
        lang === 'bn' ? 'ভল্ট আপডেট করা যায়নি।' : 'Vault could not be updated.'
      );
    }
  };

  return (
    <div className="group relative flex flex-col h-full bg-white dark:bg-[#0a0a0a] rounded-[2rem] border border-zinc-100 dark:border-zinc-800/60 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.03)] overflow-hidden">
      <Link 
        href={`/products/${product._id}`} 
        className="absolute inset-0 z-10" 
        aria-label={`View details of ${product.name}`} 
      />

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800/60 pointer-events-none">
        <OptimizedImage
          src={product.images?.[displayImageIndex]}
          alt={product.name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="grayscale-[15%] group-hover:grayscale-0 transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      <button 
        onClick={handleWishlist}
        aria-label="Toggle Wishlist"
        className={`absolute top-5 right-5 z-20 p-2.5 rounded-full backdrop-blur-xl border transition-all duration-300 active:scale-90 ${
          inWishlist 
            ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20' 
            : 'bg-white/70 dark:bg-black/20 border-black/5 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-white hover:text-black'
        }`}
      >
        <svg className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-5 left-5 z-20 bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
          -{product.discount}%
        </div>
      )}

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1 relative z-20 pointer-events-none">
        <div className="flex items-center gap-2 mb-3">
           <StarRating rating={rating} size="small" />
           {reviewCount > 0 && <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">({reviewCount})</span>}
        </div>

        <h3 className={`text-base md:text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight line-clamp-1 mb-2 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors ${lang === 'bn' ? 'font-sans' : ''}`}>
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-end gap-3 pt-2">
          <span className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">
            ৳{discountedPrice.toFixed(2)}
          </span>
          {product.discount > 0 && (
            <span className="text-xs md:text-sm font-bold text-zinc-400 line-through tracking-tight leading-none mb-0.5">
              ৳{product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}