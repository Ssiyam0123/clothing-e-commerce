import { Suspense } from "react";
import { cookies } from "next/headers";
import { getTranslation } from "@/utils/typography/handler";
import { getLayoutData } from "@/modules/client/home/lib/homeApi";
import UspSection from "@/modules/client/home/components/UspSection";
import { GridSkeleton, HeroSkeleton, FlashBannerSkeleton } from "@/components/common/Skeletons";
import SectionHeader from "@/components/common/SectionHeader";
import { cn } from "@/lib/utils";

// Home Sections
import FlashSaleSection from "@/modules/client/home/components/FlashSaleSection";
import CategoryGridSection from "@/modules/client/home/components/CategoryGridSection";
import FeaturedProductsSection from "@/modules/client/home/components/FeaturedProductsSection";
import NewArrivalsSection from "@/modules/client/home/components/NewArrivalsSection";
import SaleProductsSection from "@/modules/client/home/components/SaleProductsSection";
import PromoBannerSection from "@/modules/client/home/components/PromoBannerSection";
import CategoryCollectionSection from "@/modules/client/home/components/CategoryCollectionSection";
import CustomProductsSection from "@/modules/client/home/components/CustomProductsSection";


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
          const sectionProps = { lang, t, section };

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
                    <FlashSaleSection {...sectionProps} />
                  </Suspense>
                </section>
              );
            case 'CATEGORY_GRID':
              return (
                <section key={section.id} className={cn("w-full", idx > 0 && standardMargin)} aria-label="Shop by Category">
                  <Suspense fallback={<GridSkeleton count={6} />}>
                    <CategoryGridSection {...sectionProps} />
                  </Suspense>
                </section>
              );
            case 'FEATURED_PRODUCTS':
              return (
                <section key={section.id} className={cn("w-full", idx > 0 && standardMargin)} aria-label="Curated Featured Selection">
                  <Suspense fallback={<GridSkeleton count={4} />}>
                    <FeaturedProductsSection {...sectionProps} />
                  </Suspense>
                </section>
              );

            case 'NEW_ARRIVALS':
              return (
                <section key={section.id} className={cn("w-full", idx > 0 && standardMargin)} aria-label="Fresh New Arrivals">
                  <Suspense fallback={<GridSkeleton count={8} />}>
                    <NewArrivalsSection {...sectionProps} />
                  </Suspense>
                </section>
              );
            case 'SALE_PRODUCTS':
              return (
                <section key={section.id} className={cn("w-full", idx > 0 && standardMargin)} aria-label="Ongoing Sales and Offers">
                  <Suspense fallback={<GridSkeleton count={4} />}>
                    <SaleProductsSection {...sectionProps} />
                  </Suspense>
                </section>
              );
            case 'CATEGORY_COLLECTION':
              return (
                <section key={section.id} className={cn("w-full", idx > 0 && standardMargin)} aria-label={`Collection: ${section.title || 'Category'}`}>
                  <Suspense fallback={<GridSkeleton count={8} />}>
                    <CategoryCollectionSection {...sectionProps} />
                  </Suspense>
                </section>
              );
            case 'CUSTOM_PRODUCTS':
              return (
                <section key={section.id} className={cn("w-full", idx > 0 && standardMargin)} aria-label={section.title || 'Custom Collection'}>
                  <Suspense fallback={<GridSkeleton count={4} />}>
                    <CustomProductsSection {...sectionProps} />
                  </Suspense>
                </section>
              );
            case "HERO":
            case "BANNER_SLIDER":
            case "PROMO_BANNER": {
              return (
                <section className={cn("w-full", idx > 0 && standardMargin)} key={section.id} aria-label="Campaign Banner">
                  <Suspense fallback={<FlashBannerSkeleton />}>
                    <PromoBannerSection {...sectionProps} />
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
