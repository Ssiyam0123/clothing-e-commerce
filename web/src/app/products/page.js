import ProductsPage from "@/modules/client/products/pages/ProductsPage";
import { getSettings } from "@/lib/settings";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
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
      const res = await fetch(`${API_URL}/categories`);
      if (res.ok) {
        const categories = await res.json();
        const cat = categories.find((c) => c.slug === category);
        if (cat) {
          if (subcategory) {
            const subRes = await fetch(`${API_URL}/subcategories`);
            if (subRes.ok) {
              const subs = await subRes.json();
              const sub = subs.find(s => s.slug === subcategory);
              if (sub) {
                title = `${sub.name} - ${cat.name} | ${siteName}`;
                description = `Shop our exclusive ${sub.name} range within the ${cat.name} collection at ${siteName}. Premium quality guaranteed.`;
              }
            }
          } else {
            title = `${cat.name} Collection | ${siteName}`;
            description = `Discover the ${cat.name} collection at ${siteName}. Premium urban apparel designed for the modern trendsetter.`;
          }
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

export default function ProductsRoute({ searchParams }) {
  return <ProductsPage searchParams={searchParams} />;
}
