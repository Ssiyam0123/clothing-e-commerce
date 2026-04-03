"use client";

import React, { memo } from "react";
import Link from "next/link";
import OptimizedImage from "@/components/common/OptimizedImage";
import StarRating from "../store/StarRating";
import { motion } from "framer-motion";
import WishlistButton from "./WishlistButton"; // 👈 নতুন ইমপোর্ট

const ProductCard = memo(({ product, lang = "en" }) => {
  if (!product) return null;

  const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
  const isBn = lang === "bn";

  return (
    <Link href={`/products/${product._id}`} className="group block h-full">
      <motion.div
        whileHover={{ y: -5 }}
        className="relative flex flex-col h-full bg-surface rounded-[1.25rem] md:rounded-[2rem] border border-zinc-100 dark:border-zinc-800/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-50 dark:border-zinc-800/50">
          <OptimizedImage
            src={product.images?.[0]}
            alt={product.name}
            sizes="(max-width: 768px) 50vw, 25vw"
            className="grayscale-[10%] group-hover:grayscale-0 transition-transform duration-1000 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* 🚀 ফাস্টার উইশলিস্ট বাটন */}
          <WishlistButton product={product} lang={lang} />

          {product.discount > 0 && (
            <div className="absolute top-4 left-4 bg-zinc-900 text-white text-[7px] md:text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-lg">
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Text Content Area */}
        <div className="p-4 md:p-6 flex flex-col flex-1">
          <div className="flex items-center gap-1.5 mb-2">
            <StarRating rating={product.averageRating || 0} size="small" />
          </div>

          <h3 className={`text-sm md:text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight line-clamp-2 min-h-[2.5rem] mb-2 ${isBn ? "font-sans" : "uppercase"}`}>
            {product.name}
          </h3>

          <div className="mt-auto flex items-end gap-2">
            <span className="text-lg md:text-2xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">
              ৳{discountedPrice.toFixed(0)}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";
export default ProductCard;