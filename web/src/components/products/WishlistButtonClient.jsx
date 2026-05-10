"use client";

import { useMemo } from "react";
import { Heart } from "lucide-react";
import { useProductStore } from "@/store/productStore";
import { useAuthStore } from "@/store/authStore";

export default function WishlistButtonClient({ product }) {
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
      className={`p-3 rounded-full transition-all ${inWishlist ? "text-accent-secondary scale-110" : "text-muted dark:text-secondary"}`}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart size={24} fill={inWishlist ? "currentColor" : "none"} />
    </button>
  );
}
