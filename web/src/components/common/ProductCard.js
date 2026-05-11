"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/utils/imageUtils";
import { cn } from "@/lib/utils";
import WishlistButtonClient from "@/components/products/WishlistButtonClient";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import { getTranslation } from "@/utils/typography/handler";

const SizeSelectionModal = dynamic(() => import("@/components/products/SizeSelectionModal"), {
  ssr: false
});

export default function ProductCard({ product, className }) {
  const { isAuthenticated } = useAuthStore();
  const { lang } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("cart");

  const t = useMemo(() => getTranslation('product_details', lang), [lang]);

  if (!product) return null;

  const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
  const hasDiscount = product.discount > 0;

  const triggerModal = (e, mode) => {
    e.preventDefault();
    e.stopPropagation();
    setModalMode(mode);
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className={cn(
          "group relative flex flex-col w-full bg-card rounded-xl border border-border/40 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md",
          className
        )}
      >
        {/* Image Section */}
        <div className="relative aspect-square w-full overflow-hidden bg-accent/5">
          <Link href={`/products/${product.slug}`} className="absolute inset-0 z-10">
            <Image
              src={getImageUrl(product.images?.[0], 600, 75)}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
            {hasDiscount && (
              <Badge className="bg-red-600 text-white border-none px-2 py-0.5 text-[10px] font-semibold rounded-sm shadow-sm">
                -{product.discount}%
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-amber-500 text-black border-none px-2 py-0.5 text-[10px] font-semibold rounded-sm shadow-sm">
                {t.featuredArtifact || "Featured"}
              </Badge>
            )}
            {product.isNew && (
              <Badge className="bg-emerald-700 text-white border-none px-2 py-0.5 text-[10px] font-semibold rounded-sm shadow-sm">
                {t.newArtifact || "New"}
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-2 right-2 z-20">
            <WishlistButtonClient product={product} />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          {/* Category */}
          {product.category?.name && (
            <span className="text-[10px] sm:text-xs text-muted-foreground tracking-wider truncate mb-1">
              {product.category.name}
            </span>
          )}

          {/* Name */}
          <Link href={`/products/${product.slug}`} className="mb-2">
            <h3 className="font-medium text-sm sm:text-base line-clamp-2 hover:text-primary transition-colors min-h-[2.5rem] sm:min-h-[3rem]">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          {(product.showReviews !== false) ? (
            <div className="flex items-center gap-1 mb-4">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium">
                {(product.averageRating || 5).toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({product.totalReviews || 0})
              </span>
            </div>
          ) : (
            <div className="h-4 mb-4" /> // Spacing for consistency
          )}

          {/* Price & Actions Row - Always sticks to bottom */}
          <div className="mt-auto flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-lg sm:text-xl font-bold tracking-tight">
                ৳{(discountedPrice || 0).toFixed(0)}
              </span>
              {hasDiscount && (
                <span className="text-xs sm:text-sm text-muted-foreground line-through">
                  ৳{product.price}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                onClick={(e) => triggerModal(e, "buy-now")}
                variant="outline"
                size="sm"
                className="h-8 px-2 sm:px-3 text-[10px] font-bold tracking-tight gap-1 rounded-md border-foreground/10 hover:bg-foreground hover:text-background"
                aria-label={`Buy ${product.name} now`}
              >
                <Zap size={12} className="fill-current" />
                <span className="hidden xs:inline">{t.buyNow || "Buy"}</span>
              </Button>
              <Button
                onClick={(e) => triggerModal(e, "cart")}
                size="sm"
                className="h-8 px-2 sm:px-3 text-[10px] font-bold tracking-tight gap-1 rounded-md"
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingCart size={12} />
                <span className="hidden xs:inline text-[9px]">{t.addToCart || "Add"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <SizeSelectionModal 
          product={product}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          mode={modalMode}
        />
      )}
    </>
  );
}