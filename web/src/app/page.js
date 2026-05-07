import { Suspense } from "react";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { DICTIONARY } from "@/app/homeDictionary";
import HeroSectionServer from "@/components/home/HeroSectionServer";
import UspSection from "@/components/home/UspSection";
import FlashSaleTeaserServer from "@/components/home/FlashSaleTeaserServer";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductSection from "@/components/home/ProductSection";
import Newsletter from "@/components/home/Newsletter";
import { GridSkeleton, HeroSkeleton } from "@/components/common/Skeletons";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getHomeData() {
  try {
    const [productsRes, categoriesRes, flashSalesRes, bannerRes] =
      await Promise.all([
        fetch(`${API_URL}/products?limit=24`, {
          next: { revalidate: 60, tags: ["products", "home-data"] },
        }),
        fetch(`${API_URL}/categories`, {
          next: { revalidate: 3600, tags: ["categories", "home-data"] },
        }),
        fetch(`${API_URL}/flash-sales/active`, {
          next: { revalidate: 30, tags: ["flash-sale", "home-data"] },
        }),
        fetch(`${API_URL}/banner-campaigns/active`, {
          next: { revalidate: 60, tags: ["banners", "home-data"] },
        }),
      ]);

    return {
      products: productsRes.ok ? (await productsRes.json()).products : [],
      categories: categoriesRes.ok ? await categoriesRes.json() : [],
      flashSales: flashSalesRes.ok ? await flashSalesRes.json() : null,
      activeCampaign: bannerRes.ok ? await bannerRes.json() : null,
    };
  } catch (e) {
    console.error("Home data fetch failed:", e);
    return {
      products: [],
      categories: [],
      flashSales: null,
      activeCampaign: null,
    };
  }
}

import SectionHeader from "@/components/common/SectionHeader";

export default async function HomePage() {
  const lang = "en";
  const ui = DICTIONARY.en;

  const data = await getHomeData();

  const featuredProducts = data.products
    .filter((p) => p.isFeatured)
    .slice(0, 4);
  const newArrivals = data.products.slice(0, 8);
  const saleProducts = data.products.filter((p) => p.discount > 0).slice(0, 4);

  return (
    <main className="w-full bg-surface transition-colors duration-700">
      {/* 1. Hero Section */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSectionServer campaign={data.activeCampaign} lang={lang} ui={ui} />
      </Suspense>

      <div className="space-y-20 md:space-y-28 pb-36 mt-10 md:mt-16">
        {/* 2. Flash Sale Section */}
        {data.flashSales?.flashSale && (
          <section className="px-4 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 md:mb-24">
               <SectionHeader title="Flash Sale" subtitle={ui.flashSub || "Live Drops"} className="mb-0" />
               <Link
                 href="/flash-sale"
                 className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-elevated px-8 py-4 rounded-full border border-light hover:bg-accent-secondary hover:text-white transition-all duration-500"
               >
                 See More
               </Link>
             </div>
             <Suspense fallback={<GridSkeleton count={4} />}>
               <FlashSaleTeaserServer
                 activeSale={data.flashSales.flashSale}
                 products={data.flashSales}
                 lang={lang}
                 ui={ui}
               />
             </Suspense>
          </section>
        )}

        {/* 3. Category Grid Section */}
        <section className="px-4 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto">
          <SectionHeader title={ui.catTitle} subtitle={ui.catSub} className="mb-16 md:mb-24" />
          <CategoryGrid categories={data.categories} />
        </section>

        {/* 4. Featured Product Section */}
        <section className="px-4 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 md:mb-24">
            <SectionHeader title={ui.featTitle} subtitle={ui.featSub} className="mb-0" />
            <Link
              href="/products?category=isFeatured"
              className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-elevated px-8 py-4 rounded-full border border-light hover:bg-accent-secondary hover:text-white transition-all duration-500"
            >
              View More
            </Link>
          </div>
          <ProductSection products={featuredProducts} lang={lang} />
        </section>

        {/* 5. New Arrivals */}
        <section className="px-4 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto">
          <SectionHeader title={ui.newTitle} subtitle={ui.newSub} className="mb-16 md:mb-24" />
          <ProductSection
            products={newArrivals}
            showLoadMore={true}
            lang={lang}
            ui={ui}
          />
        </section>

        {/* 6. Sale Section */}
        {saleProducts.length > 0 && (
          <section className="px-4 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto">
            <SectionHeader title={ui.saleTitle} subtitle={ui.saleSub} className="mb-16 md:mb-24" />
            <ProductSection products={saleProducts} lang={lang} />
          </section>
        )}

        {/* 7. Newsletter Section - Full Width */}
        {/* <section className="bg-elevated py-16 md:py-20 border-y border-light">
          <div className="px-4 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto">
            <SectionHeader 
              title={ui.newsletterTitle || "Join the Syndicate"} 
              subtitle={ui.newsletterSub || "Early access and exclusive drops."} 
              className="items-center text-center"
            />
            <Newsletter lang={lang} />
          </div>
        </section> */}
      </div>
    </main>
  );
}
