"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/utils/imageUtils";
import Loader from "@/components/common/Loader";
import { useProductStore } from "@/store/productStore";
import { swalToast, swalError } from "@/utils/swal";
import { useAppStore } from "@/store/appStore";
import { useTrackingStore } from "@/store/trackingStore";
import { ShoppingBag, X, ArrowRight, Info, Zap, Heart } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const DICTIONARY = {
  en: {
    title: "The Vault",
    sub: "Your curated artifacts.",
    empty: "The Vault is Empty",
    browse: "Explore Collection",
    add: "Move to Bag",
    remove: "Remove",
    syncTip: "Log in to sync your vault across all devices.",
  },
  bn: {
    title: "সংরক্ষিত ভল্ট",
    sub: "আপনার বাছাইকৃত পণ্যসমূহ।",
    empty: "ভল্টটি খালি",
    browse: "কালেকশন দেখুন",
    add: "ব্যাগে নিন",
    remove: "সরিয়ে ফেলুন",
    syncTip: "সব ডিভাইসে আপনার ভল্ট সিঙ্ক করতে লগইন করুন।",
  },
};

export default function WishlistPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { lang, isMounted } = useAppStore();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY.en, [lang]);

  const trackAddToCart = useTrackingStore((state) => state.trackAddToCart);
  const wishlistItems = useProductStore((state) => state.wishlistItems);
  const toggleWishlist = useProductStore((state) => state.toggleWishlist);
  const addToCart = useProductStore((state) => state.addToCart);

  const handleMoveToCart = (product) => {
    const availableSizes = product.sizes?.filter((s) => s.stock > 0);
    if (!availableSizes?.length)
      return swalError("Out of Stock", "Item unavailable.");

    const sizeId = availableSizes[0].size._id || availableSizes[0].size;
    const discountedPrice =
      product.price - (product.price * (product.discount || 0)) / 100;

    addToCart(product, sizeId, 1, isAuthenticated);
    toggleWishlist(product, isAuthenticated);

    trackAddToCart(product._id, discountedPrice, 1);
    swalToast(
      lang === "bn" ? "ব্যাগে মুভ করা হয়েছে" : "Moved to Bag",
      "success",
    );
  };

  const handleRemove = (product) => {
    toggleWishlist(product, isAuthenticated);
    swalToast(
      lang === "bn" ? "ভল্ট থেকে সরানো হয়েছে" : "Removed from vault",
      "success",
    );
  };

  if (!isMounted || authLoading) {
    return (
      <div className="min-h-screen bg-background pt-32 px-4 sm:px-10 space-y-20">
        <div className="space-y-6">
          <Skeleton className="h-32 w-2/3 rounded-3xl" />
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
              <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter uppercase italic leading-[0.8] text-gradient">
                The Vault
              </h1>
              <p className="text-muted-foreground uppercase text-[9px] sm:text-[10px] font-black tracking-[0.4em] sm:tracking-[0.5em]">
                {ui.sub}
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
                  {ui.syncTip}
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
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-muted-foreground/20 leading-none">
                {ui.empty}
              </h2>
              <Button
                asChild
                variant="outline"
                className="rounded-full px-12 h-14 font-black uppercase tracking-[0.3em] text-[10px] border-border/20 hover:bg-accent-secondary hover:text-white transition-all shadow-2xl"
              >
                <Link href="/products">
                  {ui.browse}
                </Link>
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10">
              {wishlistItems.map((product) => (
                <motion.div
                  layout
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group relative bg-accent/10 backdrop-blur-md rounded-[2rem] sm:rounded-[2.5rem] border border-border/10 overflow-hidden hover:border-accent-secondary/30 transition-all duration-700 shadow-2xl hover:shadow-accent-secondary/10"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={getImageUrl(product.images?.[0], 400, 80)}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <Button
                      size="icon"
                      onClick={() => handleRemove(product)}
                      className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md text-foreground hover:text-destructive hover:bg-background transition-all shadow-xl"
                      aria-label={ui.remove}
                    >
                      <X size={18} aria-hidden="true" />
                    </Button>
                  </div>

                  <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
                    <div className="space-y-1 sm:space-y-2">
                      <p className="text-[8px] sm:text-[9px] font-black text-accent-secondary uppercase tracking-widest">
                        {product.category?.name || "Premium Drop"}
                      </p>
                      <h3 className="text-base sm:text-xl font-black uppercase tracking-tighter italic leading-none line-clamp-1">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl sm:text-3xl font-black tracking-tighter">
                        ৳{(product.price - (product.price * (product.discount || 0)) / 100).toFixed(0)}
                      </span>
                    </div>

                    <Button
                      onClick={() => handleMoveToCart(product)}
                      className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:bg-accent-secondary hover:text-white transition-all duration-500 group/btn"
                      aria-label={ui.add}
                    >
                      <ShoppingBag size={14} className="mr-2 group-hover/btn:scale-110 transition-transform" aria-hidden="true" />
                      {ui.add}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
