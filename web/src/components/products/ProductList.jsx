'use client';

import { useProducts } from '@/hooks/useProducts';
import { ProductCardSkeleton } from '@/components/common/Skeletons';
import Pagination from '@/components/common/Pagination';
import ProductCard from '../common/ProductCard';

export default function ProductList({ initialData }) {
  const { products, pagination, isLoading, isFetching, setPage } = useProducts({}, initialData);

  // If we have initialData, we are not loading even if the hook hasn't run yet
  const showLoading = isLoading && !initialData;

  if (showLoading) {
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-16">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {products.length === 0 && !isFetching && (
        <div className="py-24 text-center">
          <span className="text-5xl block mb-4 grayscale opacity-20" aria-hidden="true">📦</span>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            No artifacts found.
          </p>
        </div>
      )}

      <Pagination 
        page={pagination.page} 
        totalPages={pagination.pages} 
        onPageChange={setPage} 
      />
    </div>
  );
}