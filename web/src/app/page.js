"use client";

import { useMemo, lazy, Suspense } from "react";
import { useAppStore } from "@/store/appStore";
import { DICTIONARY } from "@/app/homeDictionary";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useFlashSales } from "@/hooks/useFlashSale";
import { useActiveBannerCampaign } from "@/hooks/useActiveBannerCampaign";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Lazy load heavy components that are below the fold
const HeroSection = lazy(() => import("@/components/home/HeroSection"));
const UspSection = lazy(() => import("@/components/home/UspSection"));
const FlashSaleTeaser = lazy(() => import("@/components/home/FlashSaleTeaser"));
const CategoryGrid = lazy(() => import("@/components/home/CategoryGrid"));
const ProductSection = lazy(() => import("@/components/home/ProductSection"));
const Newsletter = lazy(() => import("@/components/home/Newsletter"));

// ✅ FIXED IMPORT – use the correct alias path
import { GridSkeleton, HeroSkeleton } from "@/components/common/Skeletons";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.1 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="flex flex-col mb-16 gap-3">
    <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">
      {title}
    </h2>
    <div className="h-1.5 w-20 bg-rose-600 rounded-full" />
    {subtitle && (
      <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.3em] pt-1">
        {subtitle}
      </p>
    )}
  </div>
);

export default function HomeClient() {
  const { lang, isMounted } = useAppStore();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY.en, [lang]);

  const { products, isLoading: productsLoading } = useProducts({ limit: 8 });
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { flashSaleProducts, isLoading: flashSaleLoading } = useFlashSales();
  const { activeCampaign, isLoading: bannerLoading } =
    useActiveBannerCampaign();

  const featuredProducts = useMemo(
    () => products?.filter((p) => p.isFeatured) || [],
    [products],
  );
  const newArrivals = useMemo(() => products || [], [products]);

  if (!isMounted) {
    return (
      <div className="w-full bg-white dark:bg-[#050505]">
        <HeroSkeleton />
        <div className="py-20 px-4">
          <GridSkeleton count={4} />
        </div>
      </div>
    );
  }

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="w-full bg-white dark:bg-[#050505] transition-colors duration-700"
    >
      {/* 1. Hero Section – critical, loaded with priority */}
      <Suspense fallback={<HeroSkeleton />}>
        {bannerLoading ? (
          <HeroSkeleton />
        ) : (
          <motion.div variants={sectionVariants}>
            <HeroSection
              slides={
                activeCampaign?.slides?.sort((a, b) => a.order - b.order) || []
              }
              ui={ui}
              lang={lang}
            />
          </motion.div>
        )}
      </Suspense>

      {/* 2. USP Section – lazy loaded */}
      <Suspense fallback={<div className="h-32" />}>
        <motion.div
          variants={sectionVariants}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <UspSection ui={ui} />
        </motion.div>
      </Suspense>

      <div className="space-y-28 md:space-y-36 pb-36 px-4 sm:px-8 lg:px-12 max-w-[1700px] mx-auto">
        {/* 3. Flash Sale Teaser */}
        <Suspense fallback={<GridSkeleton count={4} />}>
          {flashSaleLoading ? (
            <GridSkeleton count={4} />
          ) : (
            flashSaleProducts?.flashSale && (
              <motion.div
                variants={sectionVariants}
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <FlashSaleTeaser
                  activeSale={flashSaleProducts.flashSale}
                  flashSaleProducts={flashSaleProducts}
                  ui={ui}
                  lang={lang}
                />
              </motion.div>
            )
          )}
        </Suspense>

        {/* 4. Category Grid */}
        <Suspense fallback={<GridSkeleton count={4} />}>
          <motion.div
            variants={sectionVariants}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <CategoryGrid
              categories={categories}
              ui={ui}
              isLoading={categoriesLoading}
            />
          </motion.div>
        </Suspense>

        {/* 5. Featured Artifacts */}
        <Suspense fallback={<GridSkeleton count={4} />}>
          <motion.section
            variants={sectionVariants}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-16"
          >
            <div className="flex justify-between">
              <SectionHeader
                title={ui.featTitle}
                subtitle="Masterpieces Crafted within the Foundry Walls"
              />
              <div className="flex flex-col md:flex-row gap-6">
                <Link
                  href="/products"
                  className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-rose-600 transition-all"
                  aria-label="Explore all products"
                >
                  {lang === "bn" ? "সব দেখুন" : "Explore All"}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </Link>
              </div>
            </div>

            {productsLoading ? (
              <GridSkeleton count={4} />
            ) : (
              <div className="">
                <ProductSection
                  products={featuredProducts}
                  lang={lang}
                  ui={ui}
                />
              </div>
            )}
          </motion.section>
        </Suspense>

        {/* 6. New Arrivals */}
        <Suspense fallback={<GridSkeleton count={4} />}>
          <motion.section
            variants={sectionVariants}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-16"
          >
            <SectionHeader title={ui.newTitle} subtitle="Fresh from the Foundry" />

            {productsLoading ? (
              <GridSkeleton count={4} />
            ) : (
              <ProductSection
                products={newArrivals}
                lang={lang}
                showLoadMore={true}
                ui={ui}
              />
            )}
          </motion.section>
        </Suspense>

        {/* 7. Newsletter – loaded lazily */}
        <Suspense fallback={<div className="h-64" />}>
          <motion.div
            variants={sectionVariants}
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Newsletter ui={ui} lang={lang} />
          </motion.div>
        </Suspense>
      </div>
    </motion.main>
  );
}