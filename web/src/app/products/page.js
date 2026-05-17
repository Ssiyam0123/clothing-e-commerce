import { Suspense } from "react";
import ProductFilter from "@/app/products/components/ProductFilter";
import ProductList from "@/app/products/components/ProductList";
import { FilterSkeleton, GridSkeleton } from "@/components/common/Skeletons";
import { getInitialProducts } from "@/app/products/lib/productsApi";
import { getCategories } from "@/app/categories/lib/categoryApi";
import { getSettings } from "@/lib/settings";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clothing-e-commerce-web.vercel.app";



export async function generateMetadata({ searchParams }) {
  const { category, search, subcategory } = await searchParams;
  const settings = await getSettings();
  const siteName = settings?.branding?.siteName || "Store";

  let title = `Premium Collection | ${siteName}`;
  let description = `Explore the latest high-end apparel at ${siteName}. Discover our curated collection of sustainable and modern fashion.`;

  try {
    if (search) {
      title = `Results for "${search}" | ${siteName} Search`;
      description = `Browsing search results for "${search}" in our premium catalog at ${siteName}. Find your style today.`;
    } else if (category) {
      const categories = await getCategories();
      const cat = categories.find((c) => c.slug === category);
      if (cat) {
        if (subcategory) {
          const sub = (cat.subcategories || []).find(s => s.slug === subcategory);
          if (sub) {
            title = `${sub.name} - ${cat.name} | ${siteName}`;
            description = `Shop our exclusive ${sub.name} range within the ${cat.name} collection at ${siteName}. Premium quality guaranteed.`;
          }
        } else {
          title = `${cat.name} Collection | ${siteName}`;
          description = `Discover the ${cat.name} collection at ${siteName}. Premium urban apparel designed for the modern trendsetter.`;
        }
      }
    }
  } catch (err) {
    console.error("Metadata generation error:", err);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/products`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}





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



