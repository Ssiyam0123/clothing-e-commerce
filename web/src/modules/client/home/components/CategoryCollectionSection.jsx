import ProductSection from "@/modules/client/common/components/ProductSection";
import ViewMoreButton from "./ViewMoreButton";
import { getSectionData } from "@/modules/client/home/lib/homeApi";

export default async function CategoryCollectionSection({ lang, t, section }) {
  const config = section.config;
  if (!config?.categoryId && !config?.slug && !config?.subcategoryId) return null;

  const query = config.subcategoryId ? `subcategory=${config.subcategoryId}` : `category=${config.categoryId || config.slug}`;
  const data = await getSectionData(`/products?${query}&limit=12`, ['products']);
  const products = data?.products || [];

  if (products.length === 0) return null;

  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <ProductSection products={products} showLoadMore={false} lang={lang} ui={t} />
      <ViewMoreButton 
        href={config.subcategoryId ? `/products?subcategory=${config.slug}` : `/products?category=${config.slug}`}
        label={t.viewMore || "View Collection"} 
      />
    </section>
  );
}
