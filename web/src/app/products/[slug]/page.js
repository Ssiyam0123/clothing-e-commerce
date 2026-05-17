import ProductDetailsPage from "@/modules/client/product-details/pages/ProductDetailsPage";
import { getSettings } from "@/lib/settings";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clothing-e-commerce-web.vercel.app";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const [res, settings] = await Promise.all([
      fetch(`${API_URL}/products/details/${slug}`, { next: { revalidate: 3600 } }),
      getSettings()
    ]);
    
    if (!res.ok) throw new Error("Product not found");
    const product = await res.json();
    const branding = settings?.branding || {};
    const siteName = branding.siteName || "Store";

    const discountedPrice =
      product.price - (product.price * (product.discount || 0)) / 100;
    const isAvailable = product.sizes?.some((s) => s.stock > 0);
    const imageUrl = product.images?.[0]
      ? product.images[0].startsWith("http")
        ? product.images[0]
        : `${SITE_URL}${product.images[0]}`
      : `${SITE_URL}/og-image.jpg`;

    return {
      title: `${product.name} | ${siteName} Collection`,
      description:
        product.description?.slice(0, 160) ||
        `Shop ${product.name} – premium apparel from ${siteName}.`,
      keywords: [
        product.name,
        product.category?.name,
        "premium",
        siteName,
      ],
      openGraph: {
        title: product.name,
        description: product.description?.slice(0, 160),
        images: [
          { url: imageUrl, width: 1200, height: 630, alt: product.name },
        ],
        type: "website",
        siteName: siteName,
        url: `${SITE_URL}/products/${slug}`,
        "og:price:amount": discountedPrice.toString(),
        "og:price:currency": "BDT",
        "og:availability": isAvailable ? "instock" : "oos",
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description?.slice(0, 160),
        images: [imageUrl],
      },
    };
  } catch (error) {
    const settings = await getSettings();
    return { title: `Product Not Found | ${settings?.branding?.siteName || "Store"}` };
  }
}

export default function ProductRoute({ params }) {
  return <ProductDetailsPage params={params} />;
}
