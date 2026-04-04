'use client';

import Link from 'next/link';
import { useProductCondition } from '@/store/productCondition'; // সরাসরি স্টোর ব্যবহার
import  useAuth  from '@/hooks/useAuth'; // অথেনটিকেশন চেক করার জন্য
import { swalToast } from '@/utils/swal';
import OptimizedImage from '@/components/common/OptimizedImage'; 
import StarRating from '../store/StarRating';
import { Heart } from 'lucide-react'; // আইকনের জন্য

export default function ProductCard({ product, lang = 'en' }) {
  // স্টোর থেকে সরাসরি স্টেট এবং ফাংশন নেওয়া
  const { wishlistItems, toggleWishlist } = useProductCondition();
  const { isAuthenticated } = useAuth();

  if (!product) return null;

  // চেক করা প্রোডাক্টটি উইশলিস্টে আছে কি না
  const inWishlist = wishlistItems.some((p) => String(p._id) === String(product._id));
  
  const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);

  const handleWishlist = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    // ১. সাথে সাথে UI আপডেট (No await)
    toggleWishlist(product, isAuthenticated);

    // ২. ইউজারকে ফিডব্যাক দেওয়া (অপশনাল, তবে ভালো)
    const message = inWishlist 
      ? (lang === 'bn' ? 'সরানো হয়েছে' : 'Removed') 
      : (lang === 'bn' ? 'যোগ করা হয়েছে' : 'Added to Vault');
    
    swalToast(message, 'success');
  };

  return (
    <div className="group relative flex flex-col h-full bg-white dark:bg-[#0a0a0a] rounded-[2rem] border border-zinc-100 dark:border-zinc-800/60 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-sm hover:shadow-2xl">
      <Link href={`/products/${product._id}`} className="absolute inset-0 z-10" />

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50 dark:bg-zinc-900 pointer-events-none">
        <OptimizedImage
          src={product.images?.[0]} // প্রথম ইমেজ ফিক্সড রাখা ভালো
          alt={product.name}
          className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
        />
      </div>

      {/* 🚀 Wishlist Button: Instant feedback */}
      <button 
        onClick={handleWishlist}
        className={`absolute top-5 right-5 z-20 p-3 rounded-full backdrop-blur-md transition-all duration-300 active:scale-75 ${
          inWishlist 
            ? 'bg-rose-500 text-white shadow-rose-500/40 shadow-lg scale-110' 
            : 'bg-white/80 dark:bg-black/40 text-zinc-900 dark:text-white border border-black/5 hover:bg-white'
        }`}
      >
        <Heart size={18} fill={inWishlist ? "currentColor" : "none"} strokeWidth={2.5} />
      </button>

      {/* Content */}
      <div className="p-6 mt-auto">
        <h3 className="font-black text-lg tracking-tight line-clamp-1 dark:text-white">{product.name}</h3>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-2xl font-black dark:text-white">৳{discountedPrice.toFixed(0)}</span>
          {product.discount > 0 && (
            <span className="text-sm font-bold text-zinc-400 line-through">৳{product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}