import ProductSection from "@/app/_common/components/ProductSection";
import ViewMoreButton from "@/app/_components/ViewMoreButton";
import { getSectionData } from "@/app/_lib/homeApi";

export default async function NewArrivalsSection({ lang, t }) {
  const data = await getSectionData('/products?sort=-createdAt&limit=12', ['products']);
  const products = data?.products || [];
  if (products.length === 0) return null;

  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <ProductSection products={products} showLoadMore={false} lang={lang} ui={t} />
      <ViewMoreButton href="/products" label={t.viewMore || "View All New Arrivals"} />
    </section>
  );
}
