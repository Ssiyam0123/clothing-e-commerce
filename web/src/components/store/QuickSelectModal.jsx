"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { useProductCondition } from "@/store/productCondition";
import { swalToast } from "@/utils/swal";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function QuickSelectModal({ isOpen, onClose, product, lang }) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  //  Store Actions
  const { addToCart, initiateBuyNow } = useProductCondition();
  const { isAuthenticated } = useAuthStore();

  if (!isOpen) return null;

  const handleAction = (type) => {
    if (!selectedSize)
      return swalToast(
        lang === "bn" ? "সাইজ বেছে নিন" : "Select Size",
        "error",
      );

    if (type === "buy") {
      initiateBuyNow(product, selectedSize._id, quantity);
      router.push("/cart"); 
    } else {
      addToCart(product, selectedSize._id, quantity, isAuthenticated);
      swalToast(lang === "bn" ? "ব্যাগে যোগ হয়েছে" : "Added to Bag", "success");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          className="relative w-full max-w-lg bg-white dark:bg-zinc-950 rounded-t-[2.5rem] sm:rounded-[3rem] p-8 shadow-2xl overflow-hidden border-t dark:border-white/5"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-zinc-400 hover:text-black dark:hover:text-white"
          >
            <X />
          </button>

          {/* Header */}
          <div className="flex gap-6 mb-10 border-b dark:border-white/5 pb-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border dark:border-white/5 shrink-0">
              <img
                src={product.images?.[0]}
                className="w-full h-full object-cover"
                alt=""
              />
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="font-black text-xl uppercase tracking-tighter dark:text-white leading-tight mb-2">
                {product.name}
              </h4>
              <p className="text-rose-600 font-black text-2xl tracking-tighter">
                ৳
                {(
                  product.price -
                  (product.price * (product.discount || 0)) / 100
                ).toFixed(0)}
              </p>
            </div>
          </div>

          {/* Size Selector */}
          <div className="mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-5">
              {lang === "bn" ? "সাইজ" : "Select Architecture"}
            </p>
            <div className="flex flex-wrap gap-3">
              {product.sizes?.map((item, index) => {
                const isPopulated = item.size && typeof item.size === "object";
                const sizeName = isPopulated
                  ? item.size.name
                  : typeof item.size === "string"
                    ? "Size " + (index + 1)
                    : "N/A";
                const sizeId = isPopulated ? item.size._id : item.size;

                return (
                  <button
                    key={sizeId || index}
                    type="button"
                    onClick={() =>
                      setSelectedSize({
                        _id: sizeId,
                        name: isPopulated ? item.size.name : sizeName,
                      })
                    }
                    className={`px-6 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all border-2 ${
                      selectedSize?._id === sizeId
                        ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white scale-105 shadow-xl"
                        : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border-transparent hover:border-zinc-300"
                    }`}
                  >
                    {sizeName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between mb-12 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-[2rem] border dark:border-white/5 shadow-inner">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              {lang === "bn" ? "পরিমাণ" : "Quantity"}
            </p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-800 rounded-xl shadow-md"
              >
                <Minus size={16} />
              </button>
              <span className="font-black text-lg w-4 text-center dark:text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-800 rounded-xl shadow-md"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAction("cart")}
              className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-black text-[10px] uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all"
            >
              <ShoppingCart size={16} />{" "}
              {lang === "bn" ? "ব্যাগে নিন" : "Add to Bag"}
            </button>
            <button
              onClick={() => handleAction("buy")}
              className="bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-700 shadow-xl shadow-rose-600/20 transition-all"
            >
              <Zap size={16} fill="currentColor" />{" "}
              {lang === "bn" ? "কিনুন" : "Initiate Checkout"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
