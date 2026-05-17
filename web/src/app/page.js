import HomePage from "@/modules/client/home/pages/HomePage";
import { getSettings } from "@/lib/settings";

export async function generateMetadata() {
  const settings = await getSettings();
  const branding = settings?.branding || {};
  const siteName = branding.siteName || "Store";
  const siteDescription = branding.siteDescription || "Welcome to our premium e-commerce store.";

  return {
    title: `Home | ${siteName}`,
    description: siteDescription,
    openGraph: {
      title: `Home - ${siteName}`,
      description: siteDescription,
    }
  };
}

export default function Page() {
  return <HomePage />;
}
