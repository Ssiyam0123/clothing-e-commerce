import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { cookies } from "next/headers";
import { getTranslation } from "@/utils/typography/handler";
import HeroSectionServer from "@/components/home/HeroSectionServer";
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

const getHomeData = unstable_cache(
  async () => {
    try {
      const fetchOptions = {
        next: { 
          revalidate: 60,
          tags: ['home-data', 'layout', 'products', 'categories'] 
        }
      };

      const [productsRes, categoriesRes, flashSalesRes, bannerRes, allProductsRes, layoutRes] =
        await Promise.all([
          fetch(`${API_URL}/products?limit=24`, fetchOptions),
          fetch(`${API_URL}/categories`, fetchOptions),
          fetch(`${API_URL}/flash-sales/active`, fetchOptions),
          fetch(`${API_URL}/banner-campaigns/active`, fetchOptions),
          fetch(`${API_URL}/products?limit=200`, fetchOptions),
          fetch(`${API_URL}/home-layouts/active`, fetchOptions),
        ]);

      const bannerData = bannerRes.ok ? await bannerRes.json() : null;
      const campaigns = Array.isArray(bannerData) ? bannerData : (bannerData ? [bannerData] : []);

      const [layoutData, productData, categoryData, flashSaleData, allProductsData] = await Promise.all([
        layoutRes.ok ? layoutRes.json() : null,
        productsRes.ok ? productsRes.json() : { products: [] },
        categoriesRes.ok ? categoriesRes.json() : [],
        flashSalesRes.ok ? flashSalesRes.json() : null,
        allProductsRes.ok ? allProductsRes.json() : { products: [] }
      ]);

      return {
        products: productData.products || [],
        categories: categoryData,
        flashSales: flashSaleData,
        activeCampaign: campaigns.find(c => c.isActive) || campaigns[0] || null,
        allCampaigns: campaigns,
        allProducts: allProductsData.products || [],
        layout: layoutData?.sections || [],
      };
    } catch (e) {
      console.error("Home data fetch failed:", e);
      return {
        products: [],
        categories: [],
        flashSales: null,
        activeCampaign: null,
        allCampaigns: [],
        layout: [],
      };
    }
  },
  ['home-page-data'],
  { revalidate: 60, tags: ['home-data'] }
);

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("vanguard-lang")?.value || "en";
  const t = getTranslation('home', lang);
  const dataPromise = getHomeData();
  const data = await dataPromise;

  // Pre-filter visible sections to avoid unnecessary processing in render
  const visibleSections = data.layout.filter(s => s.isVisible);

  return (
    <main className="w-full bg-surface transition-colors duration-700 overflow-x-hidden" role="main">
      <div className="flex flex-col">
        {visibleSections.map((section, idx) => {
          const sectionProps = {
            dataPromise,
            lang,
            t,
            section
          };

          // Precise 2:1 spacing ratio for professional visual rhythm
          const prevSection = idx > 0 ? visibleSections[idx - 1] : null;
          const isFollowingHeader = prevSection?.type === 'HEADER';
          const standardMargin = isFollowingHeader ? "mt-3 md:mt-12" : "mt-12 md:mt-24 lg:mt-32";

          switch (section.type) {
            case 'HERO':
              return (
                <section key={section.id} className="w-full" aria-label="Main Hero Slider">
                  <HeroSectionServer 
                    campaign={{ slides: section.config?.slides || [] }} 
                    lang={lang} 
                    ui={{ ...t, heroBtn: section.buttonText }} 
                  />
                </section>
              );
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
            case "PROMO_BANNER": {
              const campaign = data.allCampaigns.find(c => String(c._id) === String(section.config?.campaignId)) || data.activeCampaign;
              
              const bannerSlides = section.imageUrl 
                ? [{ 
                    image: section.imageUrl, 
                    title: "", 
                    subtitle: "",
                    link: section.actionLink || "#"
                  }]
                : (campaign?.slides?.map(slide => ({
                    ...slide,
                    title: "",
                    subtitle: ""
                  })) || []);

              return (
                <section className={cn("w-full", idx > 0 && standardMargin)} key={section.id} aria-label="Campaign Banner">
                   <HeroSectionServer 
                     campaign={{ slides: bannerSlides }} 
                     lang={lang} 
                     ui={{ ...t, heroBtn: section.buttonText }} 
                     showHeader={section.config?.showHeader === true}
                   />
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

async function FlashSaleWrapper({ dataPromise, lang, t, section }) {
  const data = await dataPromise;
  const config = section.config;
  
  let allSales = [];
  if (Array.isArray(data.flashSales)) {
    allSales = data.flashSales;
  } else if (data.flashSales?.flashSale) {
    allSales = [data.flashSales.flashSale];
  }

  let activeSale = null;
  if (config?.saleId) {
    activeSale = allSales.find(s => String(s._id) === String(config.saleId));
  } 
  
  if (!activeSale) {
    activeSale = allSales.find(s => s.isActive);
  }

  if (!activeSale) return null;
  
  const flashProducts = { 
    products: (activeSale.products || (data.flashSales?.products || [])).filter(p => {
      if (!config?.subcategoryId) return true;
      const subId = p.subcategory?._id || p.subcategory;
      return String(subId) === String(config.subcategoryId);
    })
  };

  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <FlashSaleTeaserServer activeSale={activeSale} products={flashProducts} lang={lang} ui={t} />
      <div className="flex justify-center mt-12">
        <Link 
          href={`/flash-sale/${activeSale.slug}`} 
          className="group flex items-center gap-4 px-10 py-5 rounded-full bg-foreground text-background font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all duration-500 shadow-xl hover:shadow-primary/20"
          aria-label={`${t.seeMore || "Explore"} ${activeSale.name}`}
        >
          {t.seeMore || "Explore"} {activeSale.name} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

async function CategoryWrapper({ dataPromise, t, section }) {
  const data = await dataPromise;
  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <CategoryGrid categories={data.categories} />
    </section>
  );
}

async function FeaturedWrapper({ dataPromise, lang, t, section }) {
  const data = await dataPromise;
  const featuredProducts = data.products.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <ProductSection products={featuredProducts} lang={lang} />
      <div className="flex justify-center mt-12">
        <Link 
          href="/products?category=isFeatured" 
          className="group flex items-center gap-4 px-10 py-5 rounded-full bg-foreground text-background font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all duration-500 shadow-xl hover:shadow-primary/20"
          aria-label={t.viewMore || "View Featured Collection"}
        >
          {t.viewMore || "View Featured Collection"} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

async function NewArrivalsWrapper({ dataPromise, lang, t, section }) {
  const data = await dataPromise;
  const newArrivals = data.products.slice(0, 12);

  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <ProductSection products={newArrivals} showLoadMore={false} lang={lang} ui={t} />
      <div className="flex justify-center mt-12">
        <Link href="/products" className="group flex items-center gap-4 px-10 py-5 rounded-full bg-foreground text-background font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all duration-500 shadow-xl hover:shadow-primary/20">
          {t.viewMore || "View All New Arrivals"} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

async function SaleWrapper({ dataPromise, lang, t, section }) {
  const data = await dataPromise;
  const saleProducts = data.products.filter((p) => p.discount > 0).slice(0, 12);

  if (saleProducts.length === 0) return null;
  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <ProductSection products={saleProducts} lang={lang} />
      <div className="flex justify-center mt-12">
        <Link href="/products?onSale=true" className="group flex items-center gap-4 px-10 py-5 rounded-full bg-foreground text-background font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all duration-500 shadow-xl hover:shadow-primary/20">
          {t.viewMore || "View All Sale Items"} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

async function PromoBannerWrapper({ dataPromise, lang, t, section }) {
  const data = await dataPromise;
  const config = section.config;
  
  // Find campaign by ID with string safety
  let campaign = data.allCampaigns?.find(c => 
    String(c._id) === String(config?.campaignId)
  );

  // Fallback to active campaign if specific one not found (to avoid empty space)
  if (!campaign) campaign = data.activeCampaign;
  
  if (!campaign) return null;
  return <HeroSectionServer campaign={campaign} lang={lang} ui={t} showHeader={config?.showHeader === true} />;
}

async function CategoryCollectionWrapper({ dataPromise, lang, t, section }) {
  const data = await dataPromise;
  const config = section.config;
  
  if (!config?.categoryId && !config?.slug && !config?.subcategoryId) return null;

  // 🕵️ Strategic Filter Resolution
  let filteredProducts = [];

  if (config.subcategoryId) {
    // Priority: Subcategory Match
    filteredProducts = data.allProducts.filter(p => 
      String(p.subcategory?._id || p.subcategory) === String(config.subcategoryId)
    );
  } else {
    // Fallback: Category Match
    const cat = data.categories.find(c => c._id === config.categoryId || c.slug === config.slug);
    if (cat) {
      filteredProducts = data.allProducts.filter(p => 
        p.category?.slug === cat.slug || 
        p.category?._id === cat._id || 
        p.category === cat._id
      );
    }
  }

  const catProducts = filteredProducts.slice(0, 12);

  if (catProducts.length === 0) return null;

  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <ProductSection products={catProducts} showLoadMore={false} lang={lang} ui={t} />
      <div className="flex justify-center mt-12">
        <Link 
          href={config.subcategoryId ? `/products?subcategory=${config.slug}` : `/products?category=${config.slug}`}
          className="group flex items-center gap-4 px-10 py-5 rounded-full bg-foreground text-background font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all duration-500 shadow-xl hover:shadow-primary/20"
        >
          {t.viewMore || "View Collection"} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
