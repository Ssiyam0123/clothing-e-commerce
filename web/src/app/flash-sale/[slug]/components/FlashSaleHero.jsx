"use client";

import { motion } from "framer-motion";
import FlashSaleBanner from "@/components/common/FlashSaleBanner";

export default function FlashSaleHero({ sale }) {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-12 mb-12 sm:mb-24">
      <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <FlashSaleBanner flashSale={sale} />
      </motion.div>
    </div>
  );
}
