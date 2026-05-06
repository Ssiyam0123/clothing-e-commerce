'use client';

import { useEffect, useRef } from 'react';
import { useInfiniteProducts } from '@/hooks/useInfiniteProducts';
import { useSearchParams } from 'next/navigation';
import { ProductCardSkeleton } from '@/components/common/Skeletons';
import ProductCard from '../common/ProductCard';

export default function ProductList({ initialData }) {
  const searchParams = useSearchParams();
  const loadMoreRef = useRef(null);

  const filters = {
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '',
    category: searchParams.get('category') || 'all',
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteProducts(filters, initialData);

  // Setup intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Combine and deduplicate products using a Map
  const allProducts = data?.pages.flatMap((page) => page.products) || [];
  const uniqueProducts = Array.from(new Map(allProducts.map(p => [p._id, p])).values());

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
    <div className={`transition-opacity duration-300 ${isFetching && !isFetchingNextPage ? 'opacity-40' : 'opacity-100'}`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 mb-16">
        {uniqueProducts.map((p, idx) => (
          <ProductCard key={p._id} product={p} index={idx} />
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {isFetchingNextPage && (
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-rose-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-rose-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-rose-600 rounded-full animate-bounce" />
          </div>
        )}
      </div>

      {uniqueProducts.length === 0 && !isFetching && (
        <div className="py-24 text-center">
          <span className="text-5xl block mb-4 grayscale opacity-20" aria-hidden="true">📦</span>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            No artifacts found.
          </p>
        </div>
      )}
    </div>
  );
}