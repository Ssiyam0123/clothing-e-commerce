"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/common/ProductCard";

export default function FlashSaleProductGrid({ products }) {
  return (
    <div className="space-y-12 sm:space-y-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10 lg:gap-12">
        {products?.map((product, idx) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: idx * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductCard product={product} isFlashSale={true} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
