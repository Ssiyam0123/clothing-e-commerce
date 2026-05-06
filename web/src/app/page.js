import { Suspense } from "react";
import { cookies, headers } from "next/headers";
import { DICTIONARY } from "@/app/homeDictionary";
import HeroSectionServer from "@/components/home/HeroSectionServer";
import UspSection from "@/components/home/UspSection";
import FlashSaleTeaserServer from "@/components/home/FlashSaleTeaserServer";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductSection from "@/components/home/ProductSection";
import Newsletter from "@/components/home/Newsletter";
import { GridSkeleton, HeroSkeleton } from "@/components/common/Skeletons";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getHomeData() {
  try {
    const [productsRes, categoriesRes, flashSalesRes, bannerRes] = await Promise.all([
      fetch(`${API_URL}/products?limit=24`, { next: { revalidate: 3600 } }),
      fetch(`${API_URL}/categories`, { next: { revalidate: 86400 } }),
      fetch(`${API_URL}/flash-sales/active`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/banner-campaigns/active`, { next: { revalidate: 3600 } })
    ]);

    return {
      products: productsRes.ok ? (await productsRes.json()).products : [],
      categories: categoriesRes.ok ? await categoriesRes.json() : [],
      flashSales: flashSalesRes.ok ? await flashSalesRes.json() : null,
      activeCampaign: bannerRes.ok ? await bannerRes.json() : null,
    };
  } catch (e) {
    console.error("Home data fetch failed:", e);
    return { products: [], categories: [], flashSales: null, activeCampaign: null };
  }
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const ui = DICTIONARY[lang] || DICTIONARY.en;
  
  const data = await getHomeData();
  
  const featuredProducts = data.products.filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = data.products.slice(0, 8);
  const saleProducts = data.products.filter(p => p.discount > 0).slice(0, 4);

  return (
    <main className="w-full bg-white dark:bg-[#050505] transition-colors duration-700">
      {/* 1. Hero Section */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSectionServer campaign={data.activeCampaign} lang={lang} ui={ui} />
      </Suspense>

      {/* 2. USP Section */}
      <UspSection ui={ui} />

      <div className="space-y-28 md:space-y-36 pb-36 px-4 sm:px-8 lg:px-12 max-w-[1700px] mx-auto mt-20">
        {/* 3. Flash Sale */}
        {data.flashSales?.flashSale && (
          <Suspense fallback={<GridSkeleton count={4} />}>
            <FlashSaleTeaserServer 
              activeSale={data.flashSales.flashSale} 
              products={data.flashSales} 
              lang={lang}
              ui={ui}
            />
          </Suspense>
        )}

        {/* 4. Category Grid */}
        <CategoryGrid categories={data.categories} ui={ui} />

        {/* 5. Featured Artifacts */}
        <section className="space-y-16">
          <div className="flex flex-col mb-16 gap-3">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">
              {ui.featTitle}
            </h2>
            <div className="h-1.5 w-20 bg-rose-600 rounded-full" />
            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.3em] pt-1">
              {ui.featSub}
            </p>
          </div>
          <ProductSection products={featuredProducts} lang={lang} />
        </section>

        {/* 6. New Arrivals */}
        <section className="space-y-16">
          <div className="flex flex-col mb-16 gap-3">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">
              {ui.newTitle}
            </h2>
            <div className="h-1.5 w-20 bg-rose-600 rounded-full" />
            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.3em] pt-1">
              {ui.newSub}
            </p>
          </div>
          <ProductSection products={newArrivals} showLoadMore={true} lang={lang} ui={ui} />
        </section>

        {/* 7. Sale Section */}
        {saleProducts.length > 0 && (
          <section className="space-y-16">
            <div className="flex flex-col mb-16 gap-3">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">
                {ui.saleTitle}
              </h2>
              <div className="h-1.5 w-20 bg-rose-600 rounded-full" />
              <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.3em] pt-1">
                {ui.saleSub}
              </p>
            </div>
            <ProductSection products={saleProducts} lang={lang} isDarkBg={true} />
          </section>
        )}

        {/* 8. Newsletter */}
        <Newsletter ui={ui} lang={lang} />
      </div>
    </main>
  );
}