import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { cookies } from "next/headers";
import { getTranslation } from "@/utils/typography/handler";
import UspSection from "@/components/home/UspSection";
import FlashSaleTeaserServer from "@/components/home/FlashSaleTeaserServer";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductSection from "@/components/home/ProductSection";
import Newsletter from "@/components/home/Newsletter";
import { GridSkeleton, HeroSkeleton } from "@/components/common/Skeletons";
import SectionHeader from "@/components/common/SectionHeader";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getLayoutData = unstable_cache(
  async () => {
    try {
      const res = await fetch(`${API_URL}/home-layouts/active`, { 
        next: { revalidate: 60, tags: ['layout'] } 
      });
      return res.ok ? await res.json() : { sections: [] };
    } catch (e) {
      return { sections: [] };
    }
  },
  ['home-layout-data'],
  { revalidate: 60, tags: ['layout'] }
);

// 🛠️ Reusable fetch helper for specific section data
const getSectionData = async (endpoint, tags = []) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    next: { revalidate: 60, tags: ['home-data', ...tags] }
  });
  if (!res.ok) return null;
  return res.json();
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("vanguard-lang")?.value || "en";
  const t = getTranslation('home', lang);
  
  // ⚡ Await only the layout structure - fast!
  const layoutData = await getLayoutData();
  const visibleSections = (layoutData?.sections || []).filter(s => s.isVisible);

  return (
    <main className="w-full bg-surface transition-colors duration-700 overflow-x-hidden" role="main">
      <div className="flex flex-col">
        {visibleSections.map((section, idx) => {
          const sectionProps = {
            lang,
            t,
            section
          };

          // Precise 2:1 spacing ratio for professional visual rhythm
          const prevSection = idx > 0 ? visibleSections[idx - 1] : null;
          const isFollowingHeader = prevSection?.type === 'HEADER';
          const standardMargin = isFollowingHeader ? "mt-3 md:mt-12" : "mt-12 md:mt-24 lg:mt-32";

          switch (section.type) {
            case 'USP':
              return (
                <section key={section.id} className={cn("w-full", idx > 0 && standardMargin)} aria-label="Trust Markers">
                  <UspSection config={section.config} lang={lang} />
                </section>
              );
            case 'HEADER':
              return (
                <section key={section.id} className={cn("px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto w-full", idx > 0 && "mt-12 md:mt-20 lg:mt-24")} aria-label={section.title}>
                   <SectionHeader 
                     title={lang === 'bn' && section.titleBn ? section.titleBn : section.title} 
                     subtitle={lang === 'bn' && section.subtitleBn ? section.subtitleBn : section.subtitle} 
                     className="mb-1 md:mb-2" 
                     isBangla={lang === 'bn' || section.config?.isBangla}
                   />
                </section>
              );
            case 'FLASH_SALE':
              return (
                <section key={section.id} className={cn("w-full", idx > 0 && standardMargin)} aria-label="Limited Time Flash Sale">
                  <Suspense fallback={<GridSkeleton count={4} />}>
                    <FlashSaleWrapper {...sectionProps} />
                  </Suspense>
                </section>
              );
            case 'CATEGORY_GRID':
              return (
                <section key={section.id} className={cn("w-full", idx > 0 && standardMargin)} aria-label="Shop by Category">
                  <Suspense fallback={<GridSkeleton count={6} />}>
                    <CategoryWrapper {...sectionProps} />
                  </Suspense>
                </section>
              );
            case 'FEATURED_PRODUCTS':
              return (
                <section key={section.id} className={cn("w-full", idx > 0 && standardMargin)} aria-label="Curated Featured Selection">
                  <Suspense fallback={<GridSkeleton count={4} />}>
                    <FeaturedWrapper {...sectionProps} />
                  </Suspense>
                </section>
              );

            case 'NEW_ARRIVALS':
              return (
                <section key={section.id} className={cn("w-full", idx > 0 && standardMargin)} aria-label="Fresh New Arrivals">
                  <Suspense fallback={<GridSkeleton count={8} />}>
                    <NewArrivalsWrapper {...sectionProps} />
                  </Suspense>
                </section>
              );
            case 'SALE_PRODUCTS':
              return (
                <section key={section.id} className={cn("w-full", idx > 0 && standardMargin)} aria-label="Ongoing Sales and Offers">
                  <Suspense fallback={<GridSkeleton count={4} />}>
                    <SaleWrapper {...sectionProps} />
                  </Suspense>
                </section>
              );
            case 'CATEGORY_COLLECTION':
              return (
                <section key={section.id} className={cn("w-full", idx > 0 && standardMargin)} aria-label={`Collection: ${section.title || 'Category'}`}>
                  <Suspense fallback={<GridSkeleton count={8} />}>
                    <CategoryCollectionWrapper {...sectionProps} />
                  </Suspense>
                </section>
              );
            case 'CUSTOM_PRODUCTS':
              return (
                <section key={section.id} className={cn("w-full", idx > 0 && standardMargin)} aria-label={section.title || 'Custom Collection'}>
                  <Suspense fallback={<GridSkeleton count={4} />}>
                    <CustomProductsWrapper {...sectionProps} />
                  </Suspense>
                </section>
              );
            case "HERO":
            case "BANNER_SLIDER":
            case "PROMO_BANNER": {
              return (
                <section className={cn("w-full", idx > 0 && standardMargin)} key={section.id} aria-label="Campaign Banner">
                  <Suspense fallback={<HeroSkeleton />}>
                    <PromoBannerWrapper {...sectionProps} />
                  </Suspense>
                </section>
              );
            }
            default:
              return null;
          }
        })}
      </div>
    </main>
  );
}

async function FlashSaleWrapper({ lang, t, section }) {
  const config = section.config;
  const flashSaleData = await getSectionData('/flash-sales/active', ['flash-sales']);
  
  if (!flashSaleData) return null;

  let allSales = [];
  if (Array.isArray(flashSaleData)) {
    allSales = flashSaleData;
  } else if (flashSaleData.flashSale) {
    allSales = [flashSaleData.flashSale];
  }

  let activeSale = config?.saleId 
    ? allSales.find(s => String(s._id) === String(config.saleId))
    : allSales.find(s => s.isActive);
  
  if (!activeSale) return null;
  
  const products = (activeSale.products || flashSaleData.products || []).filter(p => {
    if (!config?.subcategoryId) return true;
    const subId = p.subcategory?._id || p.subcategory;
    return String(subId) === String(config.subcategoryId);
  });

  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <FlashSaleTeaserServer activeSale={activeSale} products={{ products }} lang={lang} ui={t} />
      <ViewMoreButton 
        href={`/flash-sale/${activeSale.slug}`} 
        label={`${t.seeMore || "Explore"} ${activeSale.name}`} 
      />
    </section>
  );
}

async function CategoryWrapper({ section }) {
  const categories = await getSectionData('/categories', ['categories']);
  if (!categories) return null;

  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <CategoryGrid categories={categories} />
    </section>
  );
}

async function FeaturedWrapper({ lang, t }) {
  const data = await getSectionData('/products?isFeatured=true&limit=4', ['products']);
  const products = data?.products || [];
  if (products.length === 0) return null;

  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <ProductSection products={products} lang={lang} />
      <ViewMoreButton href="/products?category=isFeatured" label={t.viewMore || "View Featured Collection"} />
    </section>
  );
}

async function NewArrivalsWrapper({ lang, t }) {
  const data = await getSectionData('/products?sort=-createdAt&limit=12', ['products']);
  const products = data?.products || [];
  if (products.length === 0) return null;

  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <ProductSection products={products} showLoadMore={false} lang={lang} ui={t} />
      <ViewMoreButton href="/products" label={t.viewMore || "View All New Arrivals"} />
    </section>
  );
}

async function SaleWrapper({ lang, t }) {
  const data = await getSectionData('/products?onSale=true&limit=12', ['products']);
  const products = data?.products || [];
  if (products.length === 0) return null;

  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <ProductSection products={products} lang={lang} />
      <ViewMoreButton href="/products?onSale=true" label={t.viewMore || "View All Sale Items"} />
    </section>
  );
}

import BannerSlider from "@/components/home/BannerSlider";

async function PromoBannerWrapper({ lang, t, section }) {
  const config = section.config;
  const campaignId = config?.campaignId;
  const endpoint = campaignId ? `/banner-campaigns/${campaignId}/public` : '/banner-campaigns/active';
  const campaign = await getSectionData(endpoint, ['campaigns']);

  // 🧪 Extract Manual Slides if they exist
  const manualSlides = (section.images || [])
    .filter(img => {
      if (typeof img === 'string') return img && img.trim() !== "";
      if (typeof img === 'object' && img !== null) return img.image && img.image.trim() !== "";
      return false;
    })
    .map(img => {
      const isObject = typeof img === 'object' && img !== null;
      return { 
        image: isObject ? img.image : img, 
        title: "", 
        subtitle: "", 
        link: (isObject && img.link) ? img.link : (section.actionLink || "#")
      };
    });

  if (manualSlides.length === 0 && !section.imageUrl && !campaign) return null;

  const bannerSlides = manualSlides.length > 0
    ? manualSlides
    : (campaign?.slides?.length > 0 
        ? campaign.slides.map(s => ({ ...s, title: "", subtitle: "" }))
        : (section.imageUrl 
            ? [{ image: section.imageUrl, title: "", subtitle: "", link: section.actionLink || "#" }]
            : [])
      );

  if (bannerSlides.length === 0) return null;

  return (
    <BannerSlider 
      slides={bannerSlides} 
      lang={lang} 
      buttonText={section.buttonText || t.heroBtn || "Shop Now"} 
      showHeader={config?.showHeader !== false} 
    />
  );
}

async function CategoryCollectionWrapper({ lang, t, section }) {
  const config = section.config;
  if (!config?.categoryId && !config?.slug && !config?.subcategoryId) return null;

  const query = config.subcategoryId ? `subcategory=${config.subcategoryId}` : `category=${config.categoryId || config.slug}`;
  const data = await getSectionData(`/products?${query}&limit=12`, ['products']);
  const products = data?.products || [];

  if (products.length === 0) return null;

  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <ProductSection products={products} showLoadMore={false} lang={lang} ui={t} />
      <ViewMoreButton 
        href={config.subcategoryId ? `/products?subcategory=${config.slug}` : `/products?category=${config.slug}`}
        label={t.viewMore || "View Collection"} 
      />
    </section>
  );
}

async function CustomProductsWrapper({ lang, t, section }) {
  const productIds = section.config?.productIds || [];
  if (productIds.length === 0) return null;

  const data = await getSectionData(`/products?ids=${productIds.join(',')}`, ['products']);
  const products = data?.products || [];

  if (products.length === 0) return null;

  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <ProductSection products={products} lang={lang} />
    </section>
  );
}

function ViewMoreButton({ href, label }) {
  return (
    <div className="flex justify-center mt-12">
      <Link 
        href={href} 
        className="group flex items-center gap-4 px-10 py-5 rounded-full bg-foreground text-background font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all duration-500 shadow-xl hover:shadow-primary/20"
      >
        {label} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
