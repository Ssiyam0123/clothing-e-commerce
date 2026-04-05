'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/utils/imageUtils';
import { useProductStore } from '@/store/productStore';
import { useAppStore } from '@/store/appStore';
import { Heart, Zap, ShoppingBag, Star } from 'lucide-react';
import { swalError } from '@/utils/swal';
import QuickSelectModal from './QuickSelectModal';
import { useAuthStore } from '@/store/authStore';

export default function FlashSaleProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { lang } = useAppStore();
  const isBn = lang === 'bn';

  const toggleWishlist = useProductStore((state) => state.toggleWishlist);
  const wishlistItems = useProductStore((state) => state.wishlistItems);
  
  const inWishlist = wishlistItems?.some((p) => String(p._id || p.id) === String(product?._id));

  if (!product) return null;

  const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);
  const stockPercentage = Math.min(82, (product.totalStock / (product.totalStock + 10)) * 100) || 82; // fallback to 82%

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleWishlist(product, isAuthenticated);
    } catch (err) {
      swalError(isBn ? 'ত্রুটি' : 'Sync Error', 'Could not update vault.');
    }
  };

  return (
    <div className="group relative flex flex-col h-full bg-white dark:bg-[#0a0a0a] rounded-[1.5rem] md:rounded-[2.5rem] border border-rose-100 dark:border-rose-900/20 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.15)] overflow-hidden">
      
      {/* Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50 dark:bg-zinc-900">
        <Link href={`/products/${product.slug}`} className="absolute inset-0 z-10" aria-label={`View ${product.name}`} />
        
        <Image
          src={getImageUrl(product.images?.[0], 400, 75)}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-1000 ease-out group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Flash Sale Zap Badge */}
        <div className="absolute top-0 left-0 z-20 bg-rose-600 text-white px-3 py-1.5 rounded-br-2xl flex items-center gap-1 shadow-lg border-r border-b border-white/10">
          <Zap size={12} fill="white" className="animate-pulse" />
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">
            {product.discount}% OFF
          </span>
        </div>

        {/* Rating Overlay */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10">
          <Star size={10} className="fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-black text-white">{product.averageRating || '4.9'}</span>
        </div>

        {/* Wishlist Trigger */}
        <button 
          onClick={handleWishlist}
          className={`absolute top-3 right-3 md:top-5 md:right-5 z-20 p-2.5 md:p-3 rounded-full backdrop-blur-md transition-all active:scale-75 ${
            inWishlist 
              ? 'bg-rose-500 text-white shadow-lg' 
              : 'bg-white/80 dark:bg-black/40 text-zinc-900 dark:text-zinc-100 border border-black/5 hover:bg-white'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={inWishlist ? "currentColor" : "none"} strokeWidth={2.5} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 md:p-6 flex flex-col flex-1">
        <p className="text-[8px] md:text-[9px] font-black text-rose-600 uppercase tracking-[0.4em] mb-1 opacity-80">
          {isBn ? 'ফ্ল্যাশ ড্রপ' : 'Limited Artifact'}
        </p>

        <h3 className={`text-sm md:text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase italic line-clamp-1 mb-2 group-hover:text-rose-600 transition-colors ${isBn ? 'font-sans' : ''}`}>
          {product.name}
        </h3>

        {/* Pricing Structure */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg md:text-2xl font-black text-rose-600 dark:text-rose-500 tracking-tighter leading-none">
            ৳{discountedPrice.toFixed(0)}
          </span>
          <span className="text-[10px] md:text-sm font-bold text-zinc-400 line-through tracking-tight">
            ৳{product.price.toFixed(0)}
          </span>
        </div>

        {/* Action Bar */}
        <div className="mt-auto flex items-center gap-1.5">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-11 h-11 md:w-14 md:h-14 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all active:scale-90 shrink-0 border border-transparent dark:border-white/5"
            aria-label="Add to bag"
          >
            <ShoppingBag size={18} />
          </button>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 bg-black dark:bg-white text-white dark:text-black font-black h-11 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-600 dark:hover:bg-rose-600 hover:text-white transition-all active:scale-[0.98] shadow-lg border border-transparent dark:border-white/10"
            aria-label="Buy now"
          >
            <Zap size={14} fill="currentColor" className="hidden xs:block" />
            <span className="text-[9px] md:text-[10px] uppercase tracking-widest px-1">
              {isBn ? 'অর্ডার দিন' : 'Claim Now'}
            </span>
          </button>
        </div>
      </div>

      {/* Stock Progress Bar – CSS only, no JS animation */}
      <div className="h-1.5 w-full bg-zinc-100 dark:bg-rose-950/20 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-r-full shadow-[0_0_10px_rgba(225,29,72,0.4)] transition-all duration-1000 ease-out"
          style={{ width: `${stockPercentage}%` }}
        />
      </div>

      {/* Modal Integration */}
      <QuickSelectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={product} 
        lang={lang} 
      />
    </div>
  );
}