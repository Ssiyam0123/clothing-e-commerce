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
import { ShoppingBag, X, ArrowRight, Info } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

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
      <div className="min-h-screen flex items-center justify-center dark:bg-[#050505]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-[#050505] py-12 lg:py-24 relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-secondary/5 blur-[120px] -z-10"
        aria-hidden="true"
      />

      <div className="max-w-[1700px] mx-auto px-4 md:px-10">
        {/* Header Section */}
        <header className="mb-16 border-b border-light pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-9xl font-black tracking-tighter uppercase italic  leading-[0.8]">
                The{" "}
                <span
                  className="text-transparent stroke-black dark:stroke-white"
                  style={{ WebkitTextStroke: "1.5px currentColor" }}
                >
                  Vault
                </span>
              </h1>
              <p className="mt-6 text-muted uppercase text-[10px] font-black tracking-[0.5em]">
                {ui.sub}
              </p>
            </div>

            {/* Guest Sync Banner */}
            {!isAuthenticated && wishlistItems.length > 0 && (
              <Link
                href="/login?redirect=/wishlist"
                className="flex items-center gap-3 bg-surface-alt px-6 py-4 rounded-2xl border border-light hover:border-rose-500/30 transition-all"
                aria-label="Log in to sync your wishlist"
              >
                <Info size={16} className="text-rose-500" aria-hidden="true" />
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary">
                  {ui.syncTip}
                </span>
              </Link>
            )}
          </div>
        </header>

        {/* Wishlist Items */}
        {!wishlistItems.length ? (
          <div className="py-40 text-center">
            <h2 className="text-2xl font-black uppercase text-muted dark:text-primary tracking-widest mb-8">
              {ui.empty}
            </h2>
            <Link
              href="/products"
              className="group flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest "
              aria-label={ui.browse}
            >
              {ui.browse}{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-2 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {wishlistItems.map((product) => (
              <div
                key={product._id}
                className="group relative bg-surface-alt rounded-[2.5rem] border border-light overflow-hidden"
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
                  <button
                    onClick={() => handleRemove(product)}
                    className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-surface backdrop-blur-md flex items-center justify-center text-muted hover:text-rose-600 transition-colors"
                    aria-label={ui.remove}
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="min-h-[60px]">
                    <h3 className="text-lg font-black uppercase tracking-tight  line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-[9px] font-bold text-muted uppercase tracking-widest">
                      {product.category?.name}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black  tracking-tighter">
                      ৳
                      {(
                        product.price -
                        (product.price * (product.discount || 0)) / 100
                      ).toFixed(0)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full flex items-center justify-center gap-2 bg-accent-primary text-primary  py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-accent-secondary hover:text-primary transition-all duration-300"
                    aria-label={ui.add}
                  >
                    <ShoppingBag size={14} aria-hidden="true" />
                    {ui.add}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
