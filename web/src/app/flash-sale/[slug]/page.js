import FlashSaleDetailsPage from "@/modules/client/flash-sale-details/pages/FlashSaleDetailsPage";
import { getSettings } from "@/lib/settings";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clothing-e-commerce-web.vercel.app";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const [res, settings] = await Promise.all([
      fetch(`${API_URL}/flash-sales/slug/${slug}`, { next: { revalidate: 3600 } }),
      getSettings()
    ]);

    if (!res.ok) throw new Error("Flash sale not found");
    const sale = await res.json();
    const siteName = settings?.branding?.siteName || "Store";

    const imageUrl = sale.banner?.startsWith("http")
      ? sale.banner
      : `${SITE_URL}${sale.banner}`;

    return {
      title: `${sale.name} | Flash Sale | ${siteName}`,
      description:
        sale.description ||
        `Exclusive flash sale event: ${sale.name}. Limited time offers at ${siteName}.`,
      openGraph: {
        title: sale.name,
        description: sale.description,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: sale.name }],
        type: "website",
        url: `${SITE_URL}/flash-sale/${slug}`,
        siteName: siteName
      },
      twitter: {
        card: "summary_large_image",
        title: sale.name,
        description: sale.description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `${SITE_URL}/flash-sale/${slug}`,
      },
    };
  } catch (error) {
    const settings = await getSettings();
    return {
      title: `Flash Sale | ${settings?.branding?.siteName || "Store"}`,
    };
  }
}

export default function FlashSaleDetailsRoute({ params }) {
  return <FlashSaleDetailsPage params={params} />;
}
