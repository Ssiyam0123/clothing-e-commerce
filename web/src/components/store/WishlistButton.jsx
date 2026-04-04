"use client";

import React, { memo, useCallback } from "react";
import { useProductCondition } from "@/store/productCondition";
import  useAuth  from "@/hooks/useAuth";
import { swalToast } from "@/utils/swal";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

const WishlistButton = memo(({ product, lang }) => {
  const { isAuthenticated } = useAuth();
  
  // 🚀 INDUSTRY STANDARD: এই সিলেক্টরটি নিশ্চিত করে যে অন্য প্রোডাক্টের জন্য 
  // এই বাটন রি-রেন্ডার হবে না।
  const inWishlist = useProductCondition(
    useCallback((state) => 
      state.wishlistItems.some((p) => String(p._id) === String(product?._id)), 
    [product?._id])
  );
  
  const toggleWishlist = useProductCondition((state) => state.toggleWishlist);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // ১. ক্লিক করার সাথে সাথে স্টেট আপডেট (ইন্সট্যান্ট)
    toggleWishlist(product, isAuthenticated);

    // ২. মেসেজ (টোস্ট মেসেজ ব্রাউজারের থ্রেড কিছুটা ব্লক করে, তাই এটি অপশনাল রাখতে পারিস)
    const isBn = lang === "bn";
    swalToast(
      inWishlist ? (isBn ? "সরানো হয়েছে" : "Removed") : (isBn ? "যোগ হয়েছে" : "Added"), 
      "success"
    );
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      onClick={handleToggle}
      className={`absolute top-4 right-4 z-20 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 ${
        inWishlist
          ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40"
          : "bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-zinc-100"
      }`}
    >
      <Heart 
        size={16} 
        fill={inWishlist ? "currentColor" : "none"} 
        strokeWidth={inWishlist ? 0 : 2} 
      />
    </motion.button>
  );
});

WishlistButton.displayName = "WishlistButton";
export default WishlistButton;