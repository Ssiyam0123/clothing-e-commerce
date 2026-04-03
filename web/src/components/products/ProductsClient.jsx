'use client';

import ProductFilter from './ProductFilter';
import ProductList from './ProductList';
import { motion } from 'framer-motion';

export default function ProductsClient() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-full">
      <div className="mb-10">
        <ProductFilter />
      </div>
      <ProductList />
    </motion.div>
  );
}