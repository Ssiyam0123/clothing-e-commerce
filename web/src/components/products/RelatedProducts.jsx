import ProductCard from "@/components/common/ProductCard";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getRelatedProducts(categoryId) {
  try {
    const res = await fetch(
      `${API_URL}/products?category=${categoryId}&limit=5`,
      {
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error("Related products fetch failed:", error);
    return [];
  }
}

export default async function RelatedProducts({
  categoryId,
  currentProductId,
  title,
}) {
  const products = await getRelatedProducts(categoryId);
  const filteredProducts = products
    .filter((p) => p._id !== currentProductId)
    .slice(0, 4);

  if (filteredProducts.length === 0) return null;

  return (
    <div className="space-y-24">
      <div className="text-center relative py-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-secondary/5 to-transparent blur-3xl -z-10" />
        <h2 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-none text-gradient">
          {title}
        </h2>
        <div className="mt-8 flex items-center justify-center gap-4">
           <div className="h-px w-24 bg-border/30" />
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-secondary">Parallel Archetypes</p>
           <div className="h-px w-24 bg-border/30" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
        {filteredProducts.map((p, idx) => (
          <div 
            key={p._id} 
            className="animate-in fade-in slide-in-from-bottom-8 duration-1000"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
