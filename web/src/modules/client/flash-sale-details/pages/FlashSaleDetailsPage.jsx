import { notFound } from "next/navigation";
import FlashSaleDetailsView from "@/modules/client/flash-sale-details/components/FlashSaleDetailsView";
import { getFlashSaleDetails } from "@/modules/client/flash-sale-details/lib/flashSaleDetailsApi";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clothing-e-commerce-web.vercel.app";

export default async function FlashSaleDetailsPage({ params }) {
  const { slug } = await params;
  
  const sale = await getFlashSaleDetails(slug);
  if (sale.error) {
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
      <FlashSaleDetailsView sale={sale} />
    </>
  );
}
