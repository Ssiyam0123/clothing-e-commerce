'use client';

import { useState, memo } from 'react';
import Link from 'next/link';
import { useProductStore } from '@/store/productStore';
import OptimizedImage from '@/components/common/OptimizedImage'; 
import PrefetchLink from '@/components/common/PrefetchLink';
import { Heart, ShoppingBag, Zap, Star } from 'lucide-react';
import QuickSelectModal from '../store/QuickSelectModal';
import { useAuthStore } from '@/store/authStore';

const ProductCard = memo(({ product, lang = 'en' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();
  
  const wishlistItems = useProductStore((state) => state.wishlistItems);
  const toggleWishlist = useProductStore((state) => state.toggleWishlist);

  if (!product) return null;

  const inWishlist = wishlistItems.some((p) => String(p._id) === String(product._id));
  const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);

  return (
    <div className="group relative flex flex-col h-full bg-white dark:bg-[#0a0a0a] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      
      {/* Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <PrefetchLink 
          href={`/products/${product.slug}`} 
          queryKey={['product', product.slug]}
          queryFn={() => fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/details/${product.slug}`).then(res => res.json())}
          className="absolute inset-0 z-10"
          aria-label={`View details of ${product.name}`}
        />
        <OptimizedImage
          src={product.images?.[0]}
          alt={product.name}
          className="transition-transform duration-500 group-hover:scale-105 object-cover w-full h-full"
          loading="lazy"
        />
        
        {/* Rating Overlay - accessible contrast */}
        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
          <Star size={8} className="fill-amber-400 text-amber-400" aria-hidden="true" />
          <span className="text-[8px] font-bold text-white">{product.averageRating?.toFixed(1) || '4.8'}</span>
        </div>

        {/* Wishlist Button - larger touch target */}
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product, !!user); }}
          className={`absolute top-2 right-2 z-20 p-2.5 rounded-full backdrop-blur-sm transition-all active:scale-90 ${
            inWishlist 
              ? 'bg-rose-500 text-white shadow-md' 
              : 'bg-white/70 dark:bg-black/50 text-zinc-800 dark:text-zinc-200'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={14} fill={inWishlist ? "currentColor" : "none"} strokeWidth={2} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-3 md:p-5 flex flex-col flex-1">
        {/* Category Badge - improved contrast */}
        <p className="text-[9px] md:text-[10px] font-black text-rose-700 dark:text-rose-400 uppercase tracking-wider mb-1">
          {product.category?.name || 'Artifact'}
        </p>

        {/* Title */}
        <h3 className="font-black text-sm md:text-base tracking-tight uppercase dark:text-white line-clamp-1 mb-1">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-1 mb-3">
          <span className="text-base md:text-xl font-black dark:text-white">
            ৳{discountedPrice.toFixed(0)}
          </span>
          {product.discount > 0 && (
            <span className="text-[9px] md:text-xs font-bold text-zinc-400 line-through">
              ৳{product.price}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex items-center gap-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-10 h-10 md:w-12 md:h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-95"
            aria-label="Quick add to cart"
          >
            <ShoppingBag size={16} className="md:w-5 md:h-5" aria-hidden="true" />
          </button>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 bg-black dark:bg-white text-white dark:text-black font-bold h-10 md:h-12 rounded-xl flex items-center justify-center gap-1.5 hover:bg-rose-600 hover:text-white transition-all active:scale-95 shadow-md"
            aria-label={lang === 'bn' ? 'অর্ডার করুন' : 'Buy now'}
          >
            <Zap size={12} className="fill-current hidden sm:block" aria-hidden="true" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wide">
              {lang === 'bn' ? 'অর্ডার' : 'Buy Now'}
            </span>
          </button>
        </div>
      </div>

      <QuickSelectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={product} 
        lang={lang} 
      />
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;