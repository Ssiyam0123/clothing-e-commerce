// src/components/products/ProductList.jsx
'use client';

import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/common/ProductCard';
import { ProductCardSkeleton } from '@/components/common/Skeletons';
import Pagination from '@/components/common/Pagination';

export default function ProductList() {
  const { products, pagination, isLoading, isFetching, setPage } = useProducts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className={`transition-opacity duration-300 ${isFetching ? 'opacity-40' : 'opacity-100'}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
      
      <Pagination 
        page={pagination.page} 
        totalPages={pagination.pages} 
        onPageChange={setPage} 
      />
    </div>
  );
}