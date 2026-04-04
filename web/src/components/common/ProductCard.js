'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProductCondition } from '@/store/productStore';
import OptimizedImage from '@/components/common/OptimizedImage'; 
import { Heart, ShoppingBag, Zap, Star } from 'lucide-react';
import QuickSelectModal from '../store/QuickSelectModal';
import { useAuthStore } from '@/store/authStore';

export default function ProductCard({ product, lang = 'en' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { wishlistItems, toggleWishlist } = useProductCondition();
  const { user } = useAuthStore(); // God store updated version logic

  if (!product) return null;

  const inWishlist = wishlistItems.some((p) => String(p._id) === String(product._id));
  const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);

  return (
    <div className="group relative flex flex-col h-full bg-white dark:bg-[#0a0a0a] rounded-[1.5rem] md:rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/60 transition-all duration-500 hover:shadow-2xl overflow-hidden">
      
      {/* --- Image Section (Aspect 4:5 for Premium Fashion Look) --- */}
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50 dark:bg-zinc-900">
        <Link href={`/products/${product._id}`} className="absolute inset-0 z-10" />
        <OptimizedImage
          src={product.images?.[0]}
          alt={product.name}
          className="transition-all duration-1000 group-hover:scale-110 object-cover"
        />
        
        {/* ⭐ Premium Floating Rating */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10">
          <Star size={10} className="fill-amber-400 text-amber-400" />
          <span className="text-[9px] font-black text-white">{product.averageRating || '4.8'}</span>
        </div>

        {/* ❤️ Wishlist Trigger */}
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product, !!user); }}
          className={`absolute top-3 right-3 z-20 p-2.5 rounded-full backdrop-blur-md transition-all active:scale-75 ${
            inWishlist 
              ? 'bg-rose-500 text-white shadow-lg' 
              : 'bg-white/80 dark:bg-black/40 text-zinc-900 dark:text-zinc-100 border border-black/5'
          }`}
        >
          <Heart size={15} fill={inWishlist ? "currentColor" : "none"} strokeWidth={2.5} />
        </button>
      </div>

      {/* --- Content Section --- */}
      <div className="p-4 md:p-6 flex flex-col flex-1">
        {/* Category Badge */}
        <p className="text-[8px] md:text-[10px] font-black text-rose-600 uppercase tracking-[0.3em] mb-1">
          {product.category?.name || 'Artifact'}
        </p>

        {/* Title: Clamp fixed to 1 line for visual consistency */}
        <h3 className="font-black text-sm md:text-lg tracking-tighter uppercase italic dark:text-white line-clamp-1 mb-2">
          {product.name}
        </h3>

        {/* Pricing Architecture */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg md:text-2xl font-black dark:text-white leading-none">
            ৳{discountedPrice.toFixed(0)}
          </span>
          {product.discount > 0 && (
            <span className="text-[10px] md:text-sm font-bold text-zinc-400 line-through tracking-tighter">
              ৳{product.price}
            </span>
          )}
        </div>

        {/* 🚀 HARD COATED ACTION BAR (The "Savior" Style) */}
        <div className="mt-auto flex items-center gap-1.5">
          {/* Cart Icon - Direct Logic */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-11 h-11 md:w-14 md:h-14 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-zinc-200 transition-all active:scale-90 shrink-0 border border-transparent dark:border-white/5"
          >
            <ShoppingBag size={18} />
          </button>

          {/* Checkout Button - Bold Typography */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 bg-black dark:bg-white text-white dark:text-black font-black h-11 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-600 dark:hover:bg-rose-600 hover:text-white transition-all active:scale-[0.98] shadow-lg shadow-black/10 dark:shadow-none"
          >
            <Zap size={12} fill="currentColor" className="hidden xs:block" />
            <span className="text-[10px] md:text-xs uppercase tracking-widest px-1">
              {lang === 'bn' ? 'অর্ডার দিন' : 'Order Now'}
            </span>
          </button>
        </div>
      </div>

      {/* Persistence Modal */}
      <QuickSelectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={product} 
        lang={lang} 
      />
    </div>
  );
}