import { Suspense } from 'react';
import ProductsClient from '@/components/products/ProductsClient';
import { FilterSkeleton, GridSkeleton } from '@/components/common/Skeletons';

export const metadata = {
  title: 'The Collection | Vanguard',
  description: 'Browse our complete collection of premium streetwear and artifacts.',
};

const ProductsPageSkeleton = () => (
  <div className="space-y-12">
    <FilterSkeleton />
    <GridSkeleton count={12} />
  </div>
);

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] pt-24 pb-20 transition-colors duration-700">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-zinc-900 dark:text-white leading-none">
            The Collection
          </h1>
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
            Curated Vanguard Artifacts
          </p>
        </div>

        {/* 🚀 Streaming Section: ক্লায়েন্ট কম্পোনেন্ট লোড হওয়ার সময় স্কেলিটন দেখাবে */}
        <Suspense fallback={<ProductsPageSkeleton />}>
          <ProductsClient />
        </Suspense>
        
      </div>
    </main>
  );
}