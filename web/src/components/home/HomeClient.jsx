"use client";

import { useMemo } from "react";
import { useAppStore } from "@/store/appStore";
import { DICTIONARY } from "@/app/homeDictionary";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useFlashSales } from "@/hooks/useFlashSale";
import { useActiveBannerCampaign } from "@/hooks/useActiveBannerCampaign";
import { motion } from "framer-motion";

// Components
import HeroSection from "./HeroSection";
import UspSection from "./UspSection";
import FlashSaleTeaser from "./FlashSaleTeaser";
import CategoryGrid from "./CategoryGrid";
import ProductSection from "./ProductSection";
import Newsletter from "./Newsletter";
import { GridSkeleton, HeroSkeleton } from "../common/Skeletons";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 25 },
  },
};

// 🏛️ Refined Header: Zero redundant margins
const SectionHeader = ({ title, subtitle, badge }) => (
  <div className="flex flex-col gap-1.5 md:gap-2">
    {badge && (
      <div className="flex items-center gap-2 text-rose-500 font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em] mb-0.5">
        <Sparkles size={10} className="animate-pulse" />
        {badge}
      </div>
    )}
    <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase italic tracking-tighter text-primary leading-[0.8] transition-all">
      {title}
    </h2>
    <div className="flex items-center gap-4 mt-2">
      <div className="h-[2px] md:h-[3px] w-12 md:w-20 bg-accent-secondary rounded-full" />
      {subtitle && (
        <p className="max-w-md text-[9px] md:text-[11px] font-bold text-secondary uppercase tracking-widest leading-none">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

export default function HomeClient() {
  const { lang, isMounted } = useAppStore();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY["en"], [lang]);

  const { products, isLoading: productsLoading } = useProducts({ limit: 8 });
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { allActiveSales, isLoading: flashSaleLoading } = useFlashSales();
  const { activeCampaign, isLoading: bannerLoading } =
    useActiveBannerCampaign();

  const featuredProducts = useMemo(
    () => products?.filter((p) => p.isFeatured) || [],
    [products],
  );
  const newArrivals = useMemo(() => products || [], [products]);

  // 🛰️ Senior Spacing Rules: Reduced from py-40 to py-12/20
  const sectionClass = "py-10 md:py-16 lg:py-20";

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      className="w-full bg-surface dark:bg-[#050505] transition-colors duration-700 overflow-x-hidden"
    >
      {/* 1. Hero Section */}
      <section className="relative w-full">
        {bannerLoading ? (
          <HeroSkeleton />
        ) : (
          <HeroSection
            slides={
              activeCampaign?.slides?.sort((a, b) => a.order - b.order) || []
            }
            ui={ui}
            lang={lang}
          />
        )}
      </section>

      {/* 2. USP Section - Tighter Padding */}
      <section className="border-y border-light bg-surface-alt dark:bg-accent-primary/10 py-8 md:py-12">
        <UspSection ui={ui} />
      </section>

      {/* ⚡ Main Content Area: Removed 'space-y-XX' to prevent margin collisions */}
      <div className="container mx-auto max-w-[1536px] px-5 sm:px-10 lg:px-14">
        {/* 3. Flash Sale Teaser */}
        {!flashSaleLoading && allActiveSales?.length > 0 && (
          <motion.section
            variants={sectionVariants}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className={sectionClass}
          >
            <FlashSaleTeaser
              activeSale={allActiveSales[0]}
              flashSaleProducts={allActiveSales[0]}
              ui={ui}
              lang={lang}
            />
          </motion.section>
        )}

        {/* 4. Category Grid */}
        <motion.section
          variants={sectionVariants}
          whileInView="visible"
          viewport={{ once: true }}
          className={sectionClass}
        >
          <CategoryGrid
            categories={categories}
            ui={ui}
            isLoading={categoriesLoading}
          />
        </motion.section>

        {/* 5. Featured Artifacts - The "Tight" Layout */}
        <motion.section
          variants={sectionVariants}
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className={sectionClass}
        >
          {/* Header wrapper with tight margin-bottom */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 gap-5">
            <SectionHeader
              badge="Handpicked Drops"
              title={ui.featTitle}
              subtitle="Masterpieces Crafted within the Foundry"
            />
            <Link
              href="/products"
              className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-secondary hover:text-rose-600 transition-all pb-1 border-b-2 border-transparent hover:border-rose-600"
            >
              {lang === "bn" ? "সব দেখুন" : "Explore All"}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-2 transition-transform"
              />
            </Link>
          </div>

          <div className="relative w-full">
            {productsLoading ? (
              <GridSkeleton count={4} />
            ) : (
              <ProductSection products={featuredProducts} lang={lang} ui={ui} />
            )}
          </div>
        </motion.section>

        {/* 6. New Arrivals */}
        <motion.section
          variants={sectionVariants}
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className={sectionClass}
        >
          <div className="mb-8 md:mb-10">
            <SectionHeader
              badge="Fresh Archives"
              title={ui.newTitle}
              subtitle="The latest chronological drops"
            />
          </div>

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

        {/* 7. Newsletter */}
        <motion.section
          variants={sectionVariants}
          whileInView="visible"
          className="py-20 md:py-32"
        >
          <Newsletter ui={ui} lang={lang} />
        </motion.section>
      </div>

      {!isMounted && (
        <div className="fixed inset-0 bg-surface dark:bg-[#050505] z-[9999] opacity-0" />
      )}
    </motion.main>
  );
}
