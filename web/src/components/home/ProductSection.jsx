import Link from "next/link";
import ProductCard from "@/components/common/ProductCard";
import { Plus } from "lucide-react";

export default function ProductSection({
  products,
  lang,
  showLoadMore = false,
  ui,
}) {
  if (!products || products.length === 0) return null;

  return (
    <div className="w-full">
      {/* Product Grid – no JS animation, renders instantly */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
        {products.map((p) => (
          <div key={p._id}>
            <ProductCard product={p} lang={lang} />
          </div>
        ))}
      </div>

      {/* Load More Button – CSS only hover effects */}
      {showLoadMore && (
        <div className="mt-20 md:mt-24 text-center">
          <Link
            href="/products"
            className="relative inline-flex items-center gap-3 overflow-hidden bg-accent-primary text-primary  px-12 py-5 rounded-theme text-[11px] font-black uppercase tracking-[0.25em] hover:scale-105 active:scale-95 transition-all group shadow-2xl"
            aria-label={
              ui?.loadMore ||
              (lang === "bn" ? "আরও দেখুন" : "Load more products")
            }
          >
            <Plus
              size={16}
              className="group-hover:rotate-90 transition-transform duration-500"
            />
            {ui?.loadMore || (lang === "bn" ? "আরও দেখুন" : "Load Artifacts")}

            {/* Hover overlay – pure CSS, no JS */}
            <div className="absolute inset-0 bg-accent-secondary translate-y-full group-hover:translate-y-0 transition-transform duration-500 -z-10" />
          </Link>
        </div>
      )}
    </div>
  );
}
