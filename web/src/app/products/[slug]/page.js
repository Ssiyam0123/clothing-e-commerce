import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Share2, Star, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import StarRating from "@/components/store/StarRating";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import WishlistButtonClient from "@/components/products/WishlistButtonClient";
import ProductActionsClient from "@/components/products/ProductActionsClient";
import RelatedProducts from "@/components/products/RelatedProducts";
import ReviewSectionWrapper from "@/components/products/ReviewSectionWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getTranslation } from "@/utils/typography/handler";

import { getSettings } from "@/lib/settings";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://clothing-e-commerce-web.vercel.app";

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
    const siteName = branding.siteName || "VANGUARD";

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
    return { title: `Product Not Found | ${settings?.branding?.siteName || "VANGUARD"}` };
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  let product = null;

  try {
    const res = await fetch(`${API_URL}/products/details/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      if (res.status === 404) notFound();
      throw new Error(`HTTP ${res.status}`);
    }
    product = await res.json();
  } catch (err) {
    notFound();
  }

  const discountedPrice =
    product.price - (product.price * (product.discount || 0)) / 100;
  const isAvailable = product.sizes?.some((s) => s.stock > 0);
  
  const cookieStore = await cookies();
  const lang = cookieStore.get("vanguard-lang")?.value || "en";
  const t = getTranslation('product_details', lang);

  const settings = await getSettings();
  const siteName = settings?.branding?.siteName || "VANGUARD";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.map((img) =>
      img.startsWith("http") ? img : `${SITE_URL}${img}`,
    ),
    sku: product.sku || product._id,
    brand: { "@type": "Brand", name: siteName },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${slug}`,
      priceCurrency: "BDT",
      price: discountedPrice,
      availability: isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-700">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="max-w-[1800px] mx-auto pt-10 lg:pt-24 px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 xl:gap-32">
          {/* LEFT: Media Section */}
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-left-4 duration-1000">
            <ProductImageGallery
              images={product.images}
              name={product.name}
              discount={product.discount}
              isFeatured={product.isFeatured}
            />
          </div>

          {/* RIGHT: Information Engine */}
          <div className="lg:col-span-5 py-2 lg:py-4 flex flex-col gap-8 lg:gap-10 animate-in fade-in slide-in-from-right-4 duration-1000">
            <section className="space-y-8 lg:space-y-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-accent-secondary text-white border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                    {product.category?.name || t.premiumArtifact}
                  </Badge>
                  {product.isFeatured && (
                    <Badge className="bg-amber-500 text-black border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                      {t.featuredArtifact}
                    </Badge>
                  )}
                  {product.showReviews !== false && (
                    <div className="flex items-center gap-2 glass px-3 py-1 rounded-xl">
                      <StarRating rating={product.averageRating || 5} size="small" />
                      <span className="text-[9px] font-black text-foreground">
                        {product.totalReviews || 0} {t.reviews}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <WishlistButtonClient product={product} />
                  <Button variant="ghost" size="icon" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass hover:bg-accent-secondary hover:text-white transition-all">
                    <Share2 size={18} />
                  </Button>
                </div>
              </div>

              <div className="space-y-6 lg:space-y-8">
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-[0.9] text-gradient">
                    {product.name}
                  </h1>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl md:text-4xl font-black tracking-tighter">
                      ৳{discountedPrice.toFixed(0)}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-lg md:text-xl font-bold text-muted-foreground/40 line-through tracking-tight">
                        ৳{product.price.toFixed(0)}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium max-w-xl">
                  {product.description}
                </p>

                {/* Core USP Items */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 lg:pt-8">
                   <div className="flex flex-col items-center gap-3 text-center group/usp p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] hover:bg-accent/20 transition-all duration-500">
                     <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl glass flex items-center justify-center text-accent-secondary group-hover/usp:scale-110 group-hover/usp:rotate-6 transition-all duration-500 shadow-lg">
                        <ShieldCheck size={20} className="sm:w-6 sm:h-6" />
                     </div>
                     <div className="space-y-0.5">
                        <span className="block text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-foreground">{t.certified}</span>
                        <span className="block text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{t.qualityLock}</span>
                     </div>
                   </div>
                   <div className="flex flex-col items-center gap-3 text-center group/usp p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] hover:bg-accent/20 transition-all duration-500">
                     <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl glass flex items-center justify-center text-accent-secondary group-hover/usp:scale-110 group-hover/usp:-rotate-6 transition-all duration-500 shadow-lg">
                        <Truck size={20} className="sm:w-6 sm:h-6" />
                     </div>
                     <div className="space-y-0.5">
                        <span className="block text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-foreground">{t.express}</span>
                        <span className="block text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{t.globalTransit}</span>
                     </div>
                   </div>
                   <div className="flex flex-col items-center gap-3 text-center group/usp p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] hover:bg-accent/20 transition-all duration-500">
                     <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl glass flex items-center justify-center text-accent-secondary group-hover/usp:scale-110 group-hover/usp:rotate-12 transition-all duration-500 shadow-lg">
                        <RotateCcw size={20} className="sm:w-6 sm:h-6" />
                     </div>
                     <div className="space-y-0.5">
                        <span className="block text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-foreground">{t.recovery}</span>
                        <span className="block text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{t.secureReturns}</span>
                     </div>
                   </div>
                </div>

                <Separator className="bg-border/30" />

                {/* AEO / FAQ Section */}
                <div className="space-y-6 lg:space-y-8">
                  <div itemScope itemType="https://schema.org/Question" className="space-y-2">
                    <h3 itemProp="name" className="text-[9px] font-black uppercase tracking-[0.4em] text-accent-secondary">
                      {t.composition}
                    </h3>
                    <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                      <p itemProp="text" className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                        {t.compositionDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Actions (Client Island) */}
            <ProductActionsClient product={product} />
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 mt-20 lg:mt-32 pb-24 lg:pb-32 space-y-20 lg:space-y-32">
        {/* Reviews */}
        {product.showReviews !== false && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <ReviewSectionWrapper productId={product._id} />
          </div>
        )}

        {/* Related Products */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <RelatedProducts
            categorySlug={product.category?.slug}
            currentProductId={product._id}
            title={t.related}
          />
        </div>
      </div>
    </main>
  );
}
