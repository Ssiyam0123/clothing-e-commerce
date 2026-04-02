// src/components/products/ProductsClient.jsx
'use client';

import ProductFilter from './ProductFilter';
import ProductList from './ProductList';

export default function ProductsClient() {
  return (
    <div className="animate-in fade-in duration-700">
      <ProductFilter />
      <ProductList />
    </div>
  );
}