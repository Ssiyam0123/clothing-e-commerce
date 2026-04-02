// src/components/products/ProductList.jsx
'use client';

import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/common/ProductCard';
import { ProductCardSkeleton } from '@/components/common/Skeletons';
import Pagination from '@/components/common/Pagination';

export default function ProductList() {
  const { products, pagination, isLoading, isFetching, setPage } = useProducts();

  // লোডিং অবস্থায় স্কেলিটন গ্রিড
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={`transition-opacity duration-300 ${isFetching ? 'opacity-40' : 'opacity-100'}`}>
      
      {/* 🚀 Grid: Mobile 2 columns, Desktop 4 columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-16">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
      
      {/* ফেইজড আউট বা এম্পটি স্টেট হ্যান্ডলিং */}
      {products.length === 0 && !isFetching && (
        <div className="py-24 text-center">
           <span className="text-5xl block mb-4 grayscale opacity-20">📦</span>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">No artifacts matched your query.</p>
        </div>
      )}

      {/* Pagination Protocol */}
      <Pagination 
        page={pagination.page} 
        totalPages={pagination.pages} 
        onPageChange={setPage} 
      />
    </div>
  );
}