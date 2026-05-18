import ProductSection from "@/components/common/ProductSection";
import { getSectionData } from "@/app/_lib/homeApi";

export default async function CustomProductsSection({ lang, t, section }) {
  const productIds = section.config?.productIds || [];
  if (productIds.length === 0) return null;

  const data = await getSectionData(`/products?ids=${productIds.join(',')}`, ['products']);
  const products = data?.products || [];

  if (products.length === 0) return null;

  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <ProductSection products={products} lang={lang} />
    </section>
  );
}
