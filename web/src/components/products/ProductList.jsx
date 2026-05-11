"use client";

import { useProducts } from "@/hooks/client/useProducts";
import { ProductCardSkeleton } from "@/components/common/Skeletons";
import ProductCard from "../common/ProductCard";
import Pagination from "@/components/common/Pagination";

export default function ProductList({ initialData, t }) {
  const { products, pagination, setPage, isLoading, isFetching } = useProducts(
    { limit: 30 },
    initialData,
  );

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
    <div
      className={`transition-all duration-500 ${isFetching ? "opacity-40" : "opacity-100"}`}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 mb-16">
        {products.map((p, idx) => (
          <ProductCard key={p._id} product={p} index={idx} />
        ))}
      </div>

      {products.length > 0 && (
        <div className="mt-12 mb-24">
          <Pagination
            page={pagination.page}
            totalPages={pagination.pages}
            onPageChange={setPage}
            t={t}
          />
        </div>
      )}

      {products.length === 0 && !isFetching && (
        <div className="py-24 text-center">
          <span
            className="text-5xl block mb-4 grayscale opacity-20"
            aria-hidden="true"
          >
            📦
          </span>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">
            {t.noResults}
          </p>
        </div>
      )}
    </div>
  );
}
