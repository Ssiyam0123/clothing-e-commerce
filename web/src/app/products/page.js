import { Suspense } from "react";
import ProductsClient from "@/components/products/ProductsClient";
import { FilterSkeleton, GridSkeleton } from "@/components/common/Skeletons";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://clothing-e-commerce-web.vercel.app";

export async function generateMetadata({ searchParams }) {
  const { category, subcategory, search } = await searchParams;

  let title = "The Collection | Vanguard";
  let description =
    "Browse our complete collection of premium streetwear. Sustainable fabrics, bold silhouettes.";

  if (category) {
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (res.ok) {
        const categories = await res.json();
        const cat = categories.find((c) => c.slug === category);
        if (cat) {
          title = `${cat.name} | Vanguard Collection`;
          description = `Explore our ${cat.name} collection. Premium urban apparel designed for the modern trendsetter.`;
        }
      }
    } catch (e) {
      console.error("Failed to fetch category for metadata");
    }
  } else if (search) {
    title = `Search results for "${search}" | Vanguard`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    alternates: {
      canonical: `${SITE_URL}/products`,
    },
  };
}

const ProductsPageSkeleton = () => (
  <div className="space-y-12">
    <FilterSkeleton />
    <GridSkeleton count={12} />
  </div>
);

async function getInitialProducts(searchParams) {
  const params = new URLSearchParams(searchParams);
  // Default values to match hook's initial state
  if (!params.has("page")) params.set("page", "1");
  if (!params.has("limit")) params.set("limit", "12");
  if (!params.has("category")) params.set("category", "all");

  const apiParams = new URLSearchParams();
  if (params.get("page")) apiParams.set("page", params.get("page"));
  if (params.get("limit")) apiParams.set("limit", params.get("limit"));
  if (params.get("search")) apiParams.set("search", params.get("search"));
  if (params.get("sort")) apiParams.set("sort", params.get("sort"));
  if (params.get("category") && params.get("category") !== "all") {
    apiParams.set("category", params.get("category"));
  }

  // Optimize data transfer
  apiParams.set(
    "fields",
    "name,slug,price,discount,images,category,averageRating",
  );

  try {
    const res = await fetch(`${API_URL}/products?${apiParams.toString()}`, {
      next: { revalidate: 60 }, // Revalidate every minute
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("Initial products fetch failed:", e);
    return null;
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("Categories fetch failed:", e);
    return [];
  }
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const [initialData, categories] = await Promise.all([
    getInitialProducts(params),
    getCategories(),
  ]);

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
    <main className="min-h-screen bg-page pt-24 pb-20 transition-colors duration-700">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-20 text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter text-gradient leading-none">
            {params.search ? `Search: ${params.search}` : "The Collection"}
          </h1>
          <div className="flex items-center justify-center gap-4">
             <div className="h-px w-12 bg-border-medium/30" />
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-secondary">
               Curated Vanguard Artifacts
             </p>
             <div className="h-px w-12 bg-border-medium/30" />
          </div>
        </div>
        <Suspense fallback={<ProductsPageSkeleton />}>
          <ProductsClient initialData={initialData} initialCategories={categories} />
        </Suspense>
      </div>
    </main>
  );
}
