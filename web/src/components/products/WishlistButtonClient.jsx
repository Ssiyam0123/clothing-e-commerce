"use client";

import { useMemo } from "react";
import { Heart } from "lucide-react";
import { useProductStore } from "@/store/productStore";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export default function WishlistButtonClient({ product, className }) {
  const { isAuthenticated } = useAuthStore();
  const { toggleWishlist, wishlistItems } = useProductStore();

  const inWishlist = useMemo(
    () =>
      wishlistItems?.some((p) => String(p._id) === String(product?._id)) ||
      false,
    [wishlistItems, product?._id],
  );

  return (
    <button
      onClick={() => toggleWishlist(product, isAuthenticated)}
      className={cn(
        "p-2.5 rounded-full transition-all shadow-xl bg-background/90 backdrop-blur-md border border-border/20 hover:scale-110 active:scale-95",
        inWishlist 
          ? "text-rose-500 shadow-rose-500/20" 
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart size={20} fill={inWishlist ? "currentColor" : "none"} className="transition-transform" />
    </button>
  );
}
