import ProductCard from '@/components/common/ProductCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getRelatedProducts(categoryId) {
  try {
    const res = await fetch(`${API_URL}/products?category=${categoryId}&limit=5`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error('Related products fetch failed:', error);
    return [];
  }
}

export default async function RelatedProducts({ categoryId, currentProductId, title }) {
  const products = await getRelatedProducts(categoryId);
  const filteredProducts = products.filter(p => p._id !== currentProductId).slice(0, 4);

  if (filteredProducts.length === 0) return null;

  return (
    <div className="space-y-16">
      <div className="text-center">
        <h2 className="text-[14vw] md:text-8xl font-black uppercase italic tracking-tighter dark:text-white leading-[0.8]">
          {title}
        </h2>
        <div className="mt-8 h-px w-full max-w-[100px] bg-rose-600 mx-auto" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-10">
        {filteredProducts.map(p => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
