"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { X, Minus, Plus, ShoppingCart, Zap, PackageCheck } from "lucide-react";
import { useProductStore } from "@/store/productStore";
import { notify } from "@/utils/swal";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useTrackingStore } from "@/store/trackingStore";
import { getImageUrl } from "@/utils/imageUtils";
import { useAppStore } from "@/store/appStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function QuickSelectModal({ isOpen, onClose, product, lang, mode = "quick-view" }) {
  const { settings } = useAppStore();
  const siteName = settings?.branding?.siteName || "Store";
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const addToCart = useProductStore((state) => state.addToCart);
  const initiateBuyNow = useProductStore((state) => state.initiateBuyNow);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const trackAddToCart = useTrackingStore((state) => state.trackAddToCart);

  const isBn = lang === "bn";

  useEffect(() => {
    if (isOpen && product) {
      const availableSize = product.sizes?.find((s) => s.stock > 0);
      if (availableSize) {
        const sizeId = availableSize.size?._id || availableSize.size;
        const sizeName =
          availableSize.size?.name || availableSize.name || "Standard";
        setSelectedSize({ _id: sizeId, name: sizeName });
      } else {
        setSelectedSize(null);
      }
      setQuantity(1);
    } else {
      setSelectedSize(null);
      setQuantity(1);
    }
  }, [isOpen, product]);

  const discountedPrice = useMemo(() => {
    if (!product) return 0;
    return product.price - (product.price * (product.discount || 0)) / 100;
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAction = async (type) => {
    if (!selectedSize) {
      return notify.error(
        isBn
          ? "অনুগ্রহ করে সাইজ নির্বাচন করুন"
          : "Please select a size"
      );
    }

    if (type === "buy") {
      if (typeof initiateBuyNow === "function") {
        initiateBuyNow(product, selectedSize._id, quantity);
        router.push("/cart?type=direct");
        onClose();
      } else {
        console.error("Store Error: initiateBuyNow is not defined.");
        notify.error("System Error", "Please refresh");
      }
    } else {
      if (typeof addToCart === "function") {
        addToCart(product, selectedSize._id, quantity, isAuthenticated);
        trackAddToCart(product._id, discountedPrice, quantity);
        notify.success(
          isBn ? "ব্যাগে যোগ করা হয়েছে" : "Added to Bag"
        );
        onClose();
      }
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-2 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div
            className="relative w-full max-w-[95%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 
                        bg-background dark:bg-[#0a0a0a] rounded-2xl sm:rounded-3xl md:rounded-[3rem] 
                        shadow-2xl border border-border/10 flex flex-col 
                        h-[85vh] sm:max-h-[85vh]    /* Fixed height on mobile, flexible on desktop */
                        animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-500 overflow-hidden"
          >
            {/* Mobile Drag Indicator */}
            <div className="w-12 h-1.5 bg-muted/30 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 sm:p-2.5 text-muted-foreground hover:text-foreground transition-all bg-accent/70 hover:bg-accent/90 rounded-full z-30 backdrop-blur-md shadow-md"
              aria-label="Close modal"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* Header Info */}
            <div className="p-5 pb-3 sm:p-6 md:p-8 lg:p-10 lg:pb-6 shrink-0 border-b border-border/5 bg-gradient-to-b from-accent/5 to-transparent">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-start">
                <div className="relative w-24 h-32 xs:w-28 xs:h-36 sm:w-32 sm:h-44 md:w-36 md:h-48 rounded-2xl sm:rounded-3xl overflow-hidden bg-accent/10 border border-border/10 shrink-0 shadow-xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500 mx-auto sm:mx-0">
                  <Image
                    src={getImageUrl(product.images?.[0], 300, 120)}
                    alt={product.name}
                    fill
                    className="object-cover scale-110"
                    sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 144px"
                  />
                  <div className="absolute inset-0 bg-black/5" />
                </div>

                <div className="flex flex-col gap-1 sm:gap-2 flex-1 w-full text-center sm:text-left">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-accent-secondary inline-block">
                    {product.category?.name || (isBn ? "ক্যাটাগরি" : "Category")}
                  </span>
                  <h4 className="font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase tracking-tighter leading-[1.1] italic break-words">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 mt-1 flex-wrap">
                    <p className="text-foreground font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tighter">
                      ৳{discountedPrice.toFixed(0)}
                    </p>
                    {product.discount > 0 && (
                      <p className="text-muted-foreground font-bold text-sm sm:text-base line-through opacity-50">
                        ৳{product.price}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content with Horizontal Scroll for Sizes on Mobile */}
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-5 sm:p-6 md:p-8 lg:p-10 pt-3 sm:pt-4">
                {/* Size Section */}
                <div className="mb-8 sm:mb-10">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4 sm:mb-6 flex items-center gap-3">
                    <span className="w-6 sm:w-8 h-px bg-muted-foreground/20" />
                    {isBn ? "সাইজ নির্বাচন করুন" : "Select Size"}
                  </p>

                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {product.sizes?.map((item, index) => {
                      const isPopulated = item.size && typeof item.size === "object";
                      const sizeName = isPopulated ? item.size.name : item.name || "N/A";
                      const sizeId = isPopulated ? item.size._id : item.size;
                      const outOfStock = item.stock <= 0;
                      const isSelected = selectedSize?._id === sizeId;

                      return (
                        <button
                          key={sizeId || index}
                          disabled={outOfStock}
                          onClick={() => setSelectedSize({ _id: sizeId, name: sizeName })}
                          className={`relative px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-[1.2rem] text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 border-2 ${
                            isSelected
                              ? "bg-foreground text-background border-foreground shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] scale-[1.02]"
                              : outOfStock
                              ? "bg-accent/5 text-muted-foreground border-transparent opacity-40 cursor-not-allowed"
                              : "bg-accent/5 text-foreground border-transparent hover:border-accent-secondary/50 hover:bg-accent/10"
                          }`}
                        >
                          {sizeName}
                          {outOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl sm:rounded-[1.2rem]">
                              <div className="w-full h-px bg-muted-foreground/30 -rotate-45"></div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex flex-col xs:flex-row items-center justify-between gap-4 xs:gap-6 mb-8 sm:mb-10 bg-accent/5 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-border/10 shadow-inner">
                  <div className="space-y-1 text-center xs:text-left">
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                      {isBn ? "পরিমাণ" : "Quantity"}
                    </p>
                    <p className="text-[7px] sm:text-[8px] font-bold text-accent-secondary uppercase tracking-wider italic">
                      {isBn ? "স্টক এভেইলেবল" : "In Stock"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-8">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-background text-foreground rounded-xl sm:rounded-2xl shadow-xl border border-border/10 active:scale-90 transition-all hover:bg-foreground hover:text-background"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                    <span className="font-black text-xl sm:text-2xl w-6 sm:w-8 text-center tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-background text-foreground rounded-xl sm:rounded-2xl shadow-xl border border-border/10 active:scale-90 transition-all hover:bg-foreground hover:text-background"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className={cn(
                  "grid gap-3 sm:gap-5 mb-6 sm:mb-8",
                  mode === "quick-view" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
                )}>
                  {(mode === "quick-view" || mode === "cart") && (
                    <button
                      onClick={() => handleAction("cart")}
                      className="group bg-accent/10 text-foreground font-black text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] py-4 sm:py-6 rounded-xl sm:rounded-[2rem] flex items-center justify-center gap-2 sm:gap-3 hover:bg-foreground hover:text-background transition-all duration-500 shadow-md"
                    >
                      <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" />{" "}
                      {isBn ? "কার্টে যোগ করুন" : "Add to Cart"}
                    </button>
                  )}
                  {(mode === "quick-view" || mode === "buy-now") && (
                    <button
                      onClick={() => handleAction("buy")}
                      className="bg-accent-secondary text-white font-black text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] py-4 sm:py-6 rounded-xl sm:rounded-[2rem] flex items-center justify-center gap-2 sm:gap-3 hover:bg-foreground hover:text-background shadow-[0_20px_40px_-10px_rgba(var(--accent-secondary),0.4)] transition-all duration-500"
                    >
                      <Zap size={16} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" />{" "}
                      {isBn ? "এখনই কিনুন" : "Buy Now"}
                    </button>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-2 pb-1 flex items-center justify-center gap-2 sm:gap-4 opacity-40">
                  <PackageCheck size={12} className="sm:w-4 sm:h-4 text-accent-secondary" />
                  <p className="text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-center italic">
                    {isBn ? "নিরাপদ চেকআউট" : "Secure Checkout"}
                  </p>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </>
  );
}