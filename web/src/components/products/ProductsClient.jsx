// src/components/products/ProductsClient.jsx
'use client';

import ProductFilter from './ProductFilter';
import ProductList from './ProductList';
import { motion } from 'framer-motion';

export default function ProductsClient() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* ফিক্সড ফিল্টার বার */}
      <div className="mb-10">
        <ProductFilter />
      </div>

      {/* ডাইনামিক প্রোডাক্ট লিস্ট */}
      <ProductList />
    </motion.div>
  );
}