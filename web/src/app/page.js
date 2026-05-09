import { Suspense, cache } from "react";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// 🚀 Request-level Memoization + Edge Caching
const getHomeData = cache(async () => {
  try {
    const [productsRes, categoriesRes, flashSalesRes, bannerRes, featuredCatRes] =
      await Promise.all([
        fetch(`${API_URL}/products?limit=24`, {
          next: { revalidate: 60, tags: ["products", "home-data"] },
        }),
        fetch(`${API_URL}/categories`, {
          next: { revalidate: 60, tags: ["categories", "home-data"] },
        }),
        fetch(`${API_URL}/flash-sales/active`, {
          next: { revalidate: 60, tags: ["flash-sale", "home-data"] }, 
        }),
        fetch(`${API_URL}/banner-campaigns/active`, {
          next: { revalidate: 60, tags: ["banners", "home-data"] },
        }),
        fetch(`${API_URL}/products?category=featured&limit=100`, {
          next: { revalidate: 60, tags: ["products", "categories", "home-data"] },
        }),
      ]);

    return {
      products: productsRes.ok ? (await productsRes.json()).products : [],
      categories: categoriesRes.ok ? await categoriesRes.json() : [],
      flashSales: flashSalesRes.ok ? await flashSalesRes.json() : null,
      activeCampaign: bannerRes.ok ? await bannerRes.json() : null,
      featuredCategoryProducts: featuredCatRes.ok ? (await featuredCatRes.json()).products : [],
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
});

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("vanguard-lang")?.value || "en";
  const t = getTranslation('home', lang);
  const dataPromise = getHomeData();

  return (
    <main className="w-full bg-surface transition-colors duration-700">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSectionWrapper dataPromise={dataPromise} lang={lang} t={t} />
      </Suspense>

      <div className="space-y-20 md:space-y-28 pb-36 mt-10 md:mt-16">
        <Suspense fallback={<GridSkeleton count={4} />}>
          <FlashSaleWrapper dataPromise={dataPromise} lang={lang} t={t} />
        </Suspense>

        <Suspense fallback={<GridSkeleton count={6} />}>
          <CategoryWrapper dataPromise={dataPromise} t={t} />
        </Suspense>

        <Suspense fallback={<GridSkeleton count={4} />}>
          <FeaturedWrapper dataPromise={dataPromise} lang={lang} t={t} />
        </Suspense>

        <Suspense fallback={<GridSkeleton count={8} />}>
          <NewArrivalsWrapper dataPromise={dataPromise} lang={lang} t={t} />
        </Suspense>

        <Suspense fallback={<GridSkeleton count={4} />}>
          <SaleWrapper dataPromise={dataPromise} lang={lang} t={t} />
        </Suspense>

        <Suspense fallback={<GridSkeleton count={4} />}>
          <FeaturedCategoryWrapper dataPromise={dataPromise} lang={lang} t={t} />
        </Suspense>
      </div>
    </main>
  );
}

async function HeroSectionWrapper({ dataPromise, lang, t }) {
  const data = await dataPromise;
  return <HeroSectionServer campaign={data.activeCampaign} lang={lang} ui={t} />;
}

async function FlashSaleWrapper({ dataPromise, lang, t }) {
  const data = await dataPromise;
  if (!data.flashSales?.flashSale) return null;
  return (
    <section className="px-4 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 md:mb-24">
        <SectionHeader title={t.flashSale || "Flash Sale"} subtitle={t.flashSub || "Live Drops"} className="mb-0" />
        <Link href="/flash-sale" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-elevated px-8 py-4 rounded-full border border-light hover:bg-accent-secondary hover:text-white transition-all duration-500">
          {t.seeMore || "See More"}
        </Link>
      </div>
      <FlashSaleTeaserServer activeSale={data.flashSales.flashSale} products={data.flashSales} lang={lang} ui={t} />
    </section>
  );
}

async function CategoryWrapper({ dataPromise, t }) {
  const data = await dataPromise;
  return (
    <section className="px-4 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto">
      <SectionHeader title={t.catTitle} subtitle={t.catSub} className="mb-16 md:mb-24" />
      <CategoryGrid categories={data.categories} />
    </section>
  );
}

async function FeaturedWrapper({ dataPromise, lang, t }) {
  const data = await dataPromise;
  const featuredProducts = data.products.filter((p) => p.isFeatured).slice(0, 4);
  return (
    <section className="px-4 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 md:mb-24">
        <SectionHeader title={t.featTitle} subtitle={t.featSub} className="mb-0" />
        <Link href="/products?category=isFeatured" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-elevated px-8 py-4 rounded-full border border-light hover:bg-accent-secondary hover:text-white transition-all duration-500">
          {t.viewMore || "View More"}
        </Link>
      </div>
      <ProductSection products={featuredProducts} lang={lang} />
    </section>
  );
}

async function NewArrivalsWrapper({ dataPromise, lang, t }) {
  const data = await dataPromise;
  const newArrivals = data.products.slice(0, 8);
  return (
    <section className="px-4 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto">
      <SectionHeader title={t.newTitle} subtitle={t.newSub} className="mb-16 md:mb-24" />
      <ProductSection products={newArrivals} showLoadMore={true} lang={lang} ui={t} />
    </section>
  );
}

async function SaleWrapper({ dataPromise, lang, t }) {
  const data = await dataPromise;
  const saleProducts = data.products.filter((p) => p.discount > 0).slice(0, 4);
  if (saleProducts.length === 0) return null;
  return (
    <section className="px-4 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto">
      <SectionHeader title={t.saleTitle} subtitle={t.saleSub} className="mb-16 md:mb-24" />
      <ProductSection products={saleProducts} lang={lang} />
    </section>
  );
}

async function FeaturedCategoryWrapper({ dataPromise, lang, t }) {
  const data = await dataPromise;
  const featuredCategories = data.categories.filter(c => c.isFeatured);
  const allFeaturedProducts = data.featuredCategoryProducts || [];

  if (featuredCategories.length === 0 || allFeaturedProducts.length === 0) return null;

  return (
    <>
      {featuredCategories.map((cat) => {
        // Filter products for THIS specific category
        const catProducts = allFeaturedProducts.filter(p => 
          p.category?.slug === cat.slug || 
          p.category?._id === cat._id || 
          p.category === cat._id
        ).slice(0, 4);

        if (catProducts.length === 0) return null;

        return (
          <section key={cat._id} className="px-4 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 md:mb-24">
              <SectionHeader 
                title={cat.name} 
                subtitle={t.featuredCatSub} 
                className="mb-0" 
              />
              <Link 
                href={`/products?category=${cat.slug}&page=1`} 
                className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-elevated px-8 py-4 rounded-full border border-light hover:bg-accent-secondary hover:text-white transition-all duration-500"
              >
                {t.viewMore || "View More"}
              </Link>
            </div>
            <ProductSection products={catProducts} lang={lang} />
          </section>
        );
      })}
    </>
  );
}
