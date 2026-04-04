"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingCart, Zap, PackageCheck } from "lucide-react";
import { useProductCondition } from "@/store/productCondition";
import { swalToast } from "@/utils/swal";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getImageUrl } from "@/utils/imageUtils";

export default function QuickSelectModal({ isOpen, onClose, product, lang }) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // 🛰️ Global Stores
  const { addToCart, initiateBuyNow } = useProductCondition();
  const { isAuthenticated } = useAuthStore();

  const isBn = lang === "bn";

  // Calculate Price logic
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

    if (type === "buy") {
      // 🚀 ১. স্টোরে ডাটা সেট করো (ডিরেক্ট বাই প্রোটোকল)
      initiateBuyNow(product, selectedSize._id, quantity);
      
      // 🚀 ২. কার্ট পেজে রিডাইরেক্ট (Direct Buy ফিক্স)
      router.push("/cart?type=direct");
      onClose();
    } else {
      // ৩. নরমাল অ্যাড টু কার্ট
      addToCart(product, selectedSize._id, quantity, isAuthenticated);
      swalToast(isBn ? "সফলভাবে ব্যাগে যোগ করা হয়েছে" : "Artifact Secured in Bag", "success");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-xl bg-white dark:bg-zinc-950 rounded-t-[2.5rem] sm:rounded-[3.5rem] p-8 md:p-12 shadow-2xl border-t dark:border-white/5"
        >
          {/* Close Trigger */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-2 text-zinc-400 hover:text-rose-500 dark:hover:text-white transition-all bg-zinc-50 dark:bg-white/5 rounded-full"
          >
            <X size={20} />
          </button>

          {/* Header Info */}
          <div className="flex gap-8 mb-10 border-b dark:border-white/5 pb-8">
            <div className="w-24 h-32 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border dark:border-white/5 shrink-0 shadow-lg">
              <img
                src={getImageUrl(product.images?.[0])}
                className="w-full h-full object-cover grayscale-[20%]"
                alt={product.name}
              />
            </div>
            <div className="flex flex-col justify-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-600">
                {product.category?.name || "Vanguard artifacts"}
              </span>
              <h4 className="font-black text-2xl md:text-3xl uppercase tracking-tighter dark:text-white leading-tight">
                {product.name}
              </h4>
              <div className="flex items-center gap-3">
                <p className="text-zinc-900 dark:text-white font-black text-3xl tracking-tighter leading-none">
                  ৳{discountedPrice.toFixed(0)}
                </p>
                {product.discount > 0 && (
                  <p className="text-zinc-400 font-bold text-sm line-through decoration-rose-500/50">
                    ৳{product.price}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Size Matrix */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                 {isBn ? "সাইজ নির্বাচন করুন" : "Select Architecture"}
               </p>
               {selectedSize && (
                 <span className="text-[9px] font-black uppercase text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full animate-in fade-in">
                   {isBn ? "বাছাই করা হয়েছে" : "Template Active"}
                 </span>
               )}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
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
                    className={`relative py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border-2 ${
                      selectedSize?._id === sizeId
                        ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xl scale-[1.02]"
                        : outOfStock 
                          ? "bg-zinc-50 dark:bg-zinc-900 text-zinc-300 dark:text-zinc-700 border-transparent opacity-50 cursor-not-allowed"
                          : "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    {sizeName}
                    {outOfStock && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-px bg-zinc-400 -rotate-12 opacity-50"></div></div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interaction Console */}
          <div className="flex items-center justify-between mb-12 bg-zinc-50 dark:bg-[#0d0d0d] p-6 rounded-[2rem] border dark:border-white/5 shadow-inner">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              {isBn ? "পরিমাণ" : "Quantity Sync"}
            </p>
            <div className="flex items-center gap-8">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl shadow-sm hover:scale-110 active:scale-90 transition-all border dark:border-white/5"
              >
                <Minus size={18} />
              </button>
              <span className="font-black text-2xl w-6 text-center dark:text-white tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl shadow-sm hover:scale-110 active:scale-90 transition-all border dark:border-white/5"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Authorized Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleAction("cart")}
              className="group bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-black text-[11px] uppercase tracking-[0.2em] py-6 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-zinc-200 dark:hover:bg-white dark:hover:text-black transition-all active:scale-95"
            >
              <ShoppingCart size={16} className="group-hover:-rotate-12 transition-transform" />{" "}
              {isBn ? "ব্যাগে নিন" : "Authorize Bag"}
            </button>
            <button
              onClick={() => handleAction("buy")}
              className="bg-black dark:bg-white text-white dark:text-black font-black text-[11px] uppercase tracking-[0.2em] py-6 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white shadow-2xl shadow-black/20 dark:shadow-white/5 transition-all active:scale-95"
            >
              <Zap size={16} fill="currentColor" />{" "}
              {isBn ? "অর্ডার দিন" : "Secure Checkout"}
            </button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-3 opacity-30">
             <PackageCheck size={14} className="dark:text-white" />
             <p className="text-[8px] font-black uppercase tracking-[0.4em] dark:text-white text-center">Vanguard Secure Settlement Protocol Active</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}