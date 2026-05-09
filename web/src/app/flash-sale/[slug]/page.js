import { notFound } from "next/navigation";
import FlashSaleDetailsClient from "./FlashSaleDetailsClient";

import { getSettings } from "@/lib/settings";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://clothing-e-commerce-web.vercel.app";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const [res, settings] = await Promise.all([
      fetch(`${API_URL}/flash-sales/slug/${slug}`, { next: { revalidate: 3600 } }),
      getSettings()
    ]);

    if (!res.ok) throw new Error("Flash sale not found");
    const sale = await res.json();
    const siteName = settings?.branding?.siteName || "VANGUARD";

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
      title: `Flash Sale | ${settings?.branding?.siteName || "VANGUARD"}`,
    };
  }
}

export default async function FlashSalePage({ params }) {
  const { slug } = await params;
  let sale = null;

  try {
    const res = await fetch(`${API_URL}/flash-sales/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      if (res.status === 404) notFound();
      throw new Error(`HTTP ${res.status}`);
    }
    sale = await res.json();
  } catch (err) {
    console.error("Flash sale fetch error:", err);
    notFound();
  }

  const saleSchema = {
    "@context": "https://schema.org",
    "@type": "SaleEvent",
    name: sale.name,
    description: sale.description,
    startDate: sale.startDate,
    endDate: sale.endDate,
    location: {
      "@type": "VirtualLocation",
      url: `${SITE_URL}/flash-sale/${slug}`,
    },
    image: sale.banner?.startsWith("http")
      ? sale.banner
      : `${SITE_URL}${sale.banner}`,
    offers: sale.products?.map((p) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: p.name,
        image: p.images?.[0]?.startsWith("http")
          ? p.images[0]
          : `${SITE_URL}${p.images[0]}`,
      },
      priceCurrency: "BDT",
      price: p.price - (p.price * sale.discount) / 100,
      availability: "https://schema.org/InStock",
    })),
  };

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
        name: "Flash Sale",
        item: `${SITE_URL}/flash-sale`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: sale.name,
        item: `${SITE_URL}/flash-sale/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(saleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <FlashSaleDetailsClient sale={sale} />
    </>
  );
}
