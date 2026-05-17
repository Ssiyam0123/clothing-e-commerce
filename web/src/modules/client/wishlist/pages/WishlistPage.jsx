"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/utils/imageUtils";
import { useProductStore } from "@/modules/client/common/lib/productStore";
import { swalToast, swalError } from "@/utils/swal";
import { useAppStore } from "@/store/appStore";
import { useTrackingStore } from "@/store/trackingStore";
import { ShoppingBag, X, Info } from "lucide-react";
import { useAuthStore } from "@/modules/client/auth/lib/authStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getTranslation } from "@/utils/typography/handler";
import { motion, AnimatePresence } from "framer-motion";
import WishlistCard from "@/modules/client/wishlist/components/WishlistCard";

export default function WishlistPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { lang, isMounted } = useAppStore();
  
  const t = useMemo(() => getTranslation('wishlist', lang), [lang]);

  const trackAddToCart = useTrackingStore((state) => state.trackAddToCart);
  const wishlistItems = useProductStore((state) => state.wishlistItems);
  const toggleWishlist = useProductStore((state) => state.toggleWishlist);
  const addToCart = useProductStore((state) => state.addToCart);

  const handleMoveToCart = (product) => {
    const availableSizes = product.sizes?.filter((s) => s.stock > 0);
    if (!availableSizes?.length)
      return swalError(lang === 'bn' ? "স্টক নেই" : "Out of Stock", lang === 'bn' ? "পণ্যটি এখন পাওয়া যাচ্ছে না।" : "Item unavailable.");

    const sizeId = availableSizes[0].size._id || availableSizes[0].size;
    const discountedPrice =
      product.price - (product.price * (product.discount || 0)) / 100;

    addToCart(product, sizeId, 1, isAuthenticated);
    toggleWishlist(product, isAuthenticated);

    trackAddToCart(product._id, discountedPrice, 1);
    swalToast(t.movedToBag, "success");
  };

  const handleRemove = (product) => {
    toggleWishlist(product, isAuthenticated);
    swalToast(t.removedFromVault, "success");
  };

  if (!isMounted || authLoading) {
    return (
      <div className="min-h-screen bg-background pt-32 px-4 sm:px-10 space-y-20">
        <div className="space-y-6">
          <Skeleton className="h-24 w-2/3 rounded-3xl" />
          <Skeleton className="h-4 w-1/4 rounded-full" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-6">
              <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
              <div className="space-y-3 px-2">
                <Skeleton className="h-6 w-3/4 rounded-xl" />
                <Skeleton className="h-4 w-1/2 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-32 pb-24 sm:pb-32 relative overflow-hidden">
      {/* 🔮 Background Aura */}
      <div
        className="absolute top-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-accent-secondary/5 blur-[100px] sm:blur-[150px] -z-10"
        aria-hidden="true"
      />

      <div className="max-w-[1700px] mx-auto px-4 sm:px-10">
        {/* 🏛️ Header Section */}
        <header className="mb-12 sm:mb-20 border-b border-border/10 pb-8 sm:pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[0.8] text-gradient">
                {t.title}
              </h1>
              <p className="text-muted-foreground uppercase text-[9px] sm:text-[10px] font-black tracking-[0.4em] sm:tracking-[0.5em]">
                {t.sub}
              </p>
            </div>

            {/* Guest Sync Banner */}
            {!isAuthenticated && wishlistItems.length > 0 && (
              <Link
                href="/login?redirect=/wishlist"
                className="group flex items-center gap-4 bg-accent/20 backdrop-blur-xl px-6 py-4 rounded-2xl border border-border/10 hover:border-accent-secondary/30 transition-all shadow-xl"
                aria-label="Log in to sync your wishlist"
              >
                <Info size={18} className="text-accent-secondary group-hover:scale-110 transition-transform" aria-hidden="true" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-foreground/80">
                  {t.syncTip}
                </span>
              </Link>
            )}
          </div>
        </header>

        {/* 💎 Wishlist Grid */}
        <AnimatePresence mode="popLayout">
          {!wishlistItems.length ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-40 text-center space-y-12"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] sm:rounded-[3rem] glass flex items-center justify-center mx-auto opacity-20">
                 <ShoppingBag size={48} className="sm:w-16 sm:h-16" />
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-muted-foreground/20 leading-none">
                {t.empty}
              </h2>
              <Button
                asChild
                variant="outline"
                className="rounded-full px-12 h-14 font-black uppercase tracking-[0.3em] text-[10px] border-border/20 hover:bg-accent-secondary hover:text-white transition-all shadow-2xl"
              >
                <Link href="/products">
                  {t.browse}
                </Link>
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10">
              {wishlistItems.map((product) => (
                <WishlistCard
                  key={product._id}
                  product={product}
                  onRemove={handleRemove}
                  onMoveToCart={handleMoveToCart}
                  t={t}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
