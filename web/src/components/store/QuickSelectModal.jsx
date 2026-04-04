"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingCart, Zap, PackageCheck, AlertCircle } from "lucide-react";
import { useProductCondition } from "@/store/productStore";
import { swalToast } from "@/utils/swal";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getImageUrl } from "@/utils/imageUtils";

export default function QuickSelectModal({ isOpen, onClose, product, lang }) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // 🛰️ Global Stores - Using selectors for better stability
  const addToCart = useProductCondition((state) => state.addToCart);
  const initiateBuyNow = useProductCondition((state) => state.initiateBuyNow);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isBn = lang === "bn";

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedSize(null);
      setQuantity(1);
    }
  }, [isOpen]);

  const discountedPrice = useMemo(() => {
    if (!product) return 0;
    return product.price - (product.price * (product.discount || 0)) / 100;
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAction = async (type) => {
    if (!selectedSize) {
      return swalToast(
        isBn ? "অনুগ্রহ করে সাইজ নির্বাচন করুন" : "Operational Error: Select Size",
        "error"
      );
    }

    // 🛡️ Safety Check: Ensure initiateBuyNow exists before calling
    if (type === "buy") {
      if (typeof initiateBuyNow === "function") {
        initiateBuyNow(product, selectedSize._id, quantity);
        router.push("/cart?type=direct");
        onClose();
      } else {
        console.error("Store Error: initiateBuyNow is not defined.");
        swalToast("System Error: Please refresh", "error");
      }
    } else {
      if (typeof addToCart === "function") {
        addToCart(product, selectedSize._id, quantity, isAuthenticated);
        swalToast(isBn ? "ব্যাগে যোগ করা হয়েছে" : "Artifact Secured in Bag", "success");
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window: Responsive Bottom Sheet for Mobile, Centered for Desktop */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-full max-w-xl bg-white dark:bg-[#0a0a0a] rounded-t-[2.5rem] sm:rounded-[3.5rem] shadow-2xl border-t dark:border-white/5 flex flex-col max-h-[90vh] sm:max-h-auto"
        >
          {/* Mobile Drag Indicator */}
          <div className="w-12 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mt-4 mb-2 sm:hidden" />

          {/* Close Trigger (Desktop hidden, Mobile visible as X) */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-rose-500 transition-all bg-zinc-100 dark:bg-white/5 rounded-full z-20"
          >
            <X size={20} />
          </button>

          <div className="p-6 sm:p-10 md:p-12 overflow-y-auto no-scrollbar">
            {/* Header Info */}
            <div className="flex gap-6 sm:gap-8 mb-8">
              <div className="w-20 h-28 sm:w-28 sm:h-36 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border dark:border-white/5 shrink-0 shadow-lg">
                <img
                  src={getImageUrl(product.images?.[0])}
                  className="w-full h-full object-cover"
                  alt={product.name}
                />
              </div>
              <div className="flex flex-col justify-center gap-1 sm:gap-2">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-600">
                  {product.category?.name || "Premium Collection"}
                </span>
                <h4 className="font-black text-xl sm:text-3xl uppercase tracking-tighter dark:text-white leading-none">
                  {product.name}
                </h4>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-zinc-900 dark:text-white font-black text-2xl sm:text-3xl tracking-tighter">
                    ৳{discountedPrice.toFixed(0)}
                  </p>
                  {product.discount > 0 && (
                    <p className="text-zinc-400 font-bold text-xs sm:text-sm line-through">
                      ৳{product.price}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Size Matrix */}
            <div className="mb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4 ml-1">
                {isBn ? "সাইজ নির্বাচন করুন" : "Template Configuration"}
              </p>
              <div className="grid grid-cols-3 xs:grid-cols-4 gap-2.5">
                {product.sizes?.map((item, index) => {
                  const isPopulated = item.size && typeof item.size === "object";
                  const sizeName = isPopulated ? item.size.name : (item.name || "N/A");
                  const sizeId = isPopulated ? item.size._id : item.size;
                  const outOfStock = item.stock <= 0;

                  return (
                    <button
                      key={sizeId || index}
                      disabled={outOfStock}
                      onClick={() => setSelectedSize({ _id: sizeId, name: sizeName })}
                      className={`relative py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border-2 ${
                        selectedSize?._id === sizeId
                          ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xl scale-[1.03]"
                          : outOfStock 
                            ? "bg-zinc-50 dark:bg-[#0d0d0d] text-zinc-300 dark:text-zinc-800 border-transparent opacity-50 cursor-not-allowed"
                            : "bg-zinc-50 dark:bg-[#0d0d0d] text-zinc-500 border-transparent hover:border-zinc-300"
                      }`}
                    >
                      {sizeName}
                      {outOfStock && <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl"><div className="w-full h-px bg-zinc-300 dark:bg-zinc-700 -rotate-45"></div></div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interaction Console */}
            <div className="flex items-center justify-between mb-10 bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-[2rem] border dark:border-white/5 shadow-inner">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                {isBn ? "পরিমাণ" : "Qty Sync"}
              </p>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl shadow-sm border dark:border-white/5 active:scale-90 transition-transform"
                >
                  <Minus size={16} />
                </button>
                <span className="font-black text-xl w-6 text-center dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl shadow-sm border dark:border-white/5 active:scale-90 transition-transform"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Authorized Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleAction("cart")}
                className="group bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-black text-[11px] uppercase tracking-[0.2em] py-5 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all"
              >
                <ShoppingCart size={16} /> {isBn ? "ব্যাগে নিন" : "Authorize Bag"}
              </button>
              <button
                onClick={() => handleAction("buy")}
                className="bg-black dark:bg-white text-white dark:text-black font-black text-[11px] uppercase tracking-[0.2em] py-5 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white shadow-2xl transition-all"
              >
                <Zap size={16} fill="currentColor" /> {isBn ? "অর্ডার দিন" : "Secure Checkout"}
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-3 opacity-30">
               <PackageCheck size={14} className="dark:text-white" />
               <p className="text-[8px] font-black uppercase tracking-[0.4em] dark:text-white text-center">Vanguard Secure Settlement Protocol Active</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}