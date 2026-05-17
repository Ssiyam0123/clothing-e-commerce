import { Suspense } from "react";
import ProductFilter from "@/modules/client/products/components/ProductFilter";
import ProductList from "@/modules/client/products/components/ProductList";
import { FilterSkeleton, GridSkeleton } from "@/components/common/Skeletons";
import { getInitialProducts } from "@/modules/client/products/lib/productsApi";
import { getCategories } from "@/modules/client/category/lib/categoryApi";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clothing-e-commerce-web.vercel.app";

const ProductsPageSkeleton = () => (
  <div className="w-full">
    <div className="mb-10">
      <FilterSkeleton />
    </div>
    <GridSkeleton count={12} />
  </div>
);

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const productsPromise = getInitialProducts(params);
  const categoriesPromise = getCategories();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Collection",
        item: `${SITE_URL}/products`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-page pt-10 transition-colors duration-700">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container mx-auto px-4 md:px-6">
        <Suspense fallback={<ProductsPageSkeleton />}>
          <ProductsDataWrapper 
            productsPromise={productsPromise} 
            categoriesPromise={categoriesPromise} 
          />
        </Suspense>
      </div>
    </main>
  );
}

async function ProductsDataWrapper({ productsPromise, categoriesPromise }) {
  const [initialData, categories] = await Promise.all([
    productsPromise,
    categoriesPromise,
  ]);
  
  return (
    <div className="w-full">
      <div className="mb-10">
        <ProductFilter initialCategories={categories} />
      </div>
      <ProductList initialData={initialData} />
    </div>
  );
}
