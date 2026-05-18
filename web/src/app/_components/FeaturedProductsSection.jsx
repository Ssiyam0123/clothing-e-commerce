import ProductSection from "@/components/common/ProductSection";
import ViewMoreButton from "@/app/_components/ViewMoreButton";
import { getSectionData } from "@/app/_lib/homeApi";

export default async function FeaturedProductsSection({ lang, t }) {
  const data = await getSectionData('/products?isFeatured=true&limit=4', ['products']);
  const products = data?.products || [];
  if (products.length === 0) return null;

  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <ProductSection products={products} lang={lang} />
      <ViewMoreButton href="/products?category=isFeatured" label={t.viewMore || "View Featured Collection"} />
    </section>
  );
}
