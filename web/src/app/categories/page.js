import CategoryPage from "@/modules/client/category/pages/CategoryPage";
import { getSettings } from "@/lib/settings";

export async function generateMetadata() {
  const settings = await getSettings();
  const branding = settings?.branding || {};
  const siteName = branding.siteName || "Store";

  return {
    title: `Categories | ${siteName}`,
    description: "Explore our curated collections of premium artifacts and apparel.",
    openGraph: {
      title: `Categories - ${siteName}`,
      description: "Explore our curated collections of premium artifacts and apparel.",
    }
  };
}

export default function CategoriesRoute() {
  return <CategoryPage />;
}
