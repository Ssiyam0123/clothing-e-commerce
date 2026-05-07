"use client";

import ProductFilter from "./ProductFilter";
import ProductList from "./ProductList";

export default function ProductsClient({ initialData, initialCategories }) {
  return (
    <div className="w-full">
      <div className="mb-10">
        <ProductFilter initialCategories={initialCategories} />
      </div>
      <ProductList initialData={initialData} />
    </div>
  );
}
