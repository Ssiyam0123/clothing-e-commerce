"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/client/useProducts";
import { useCategories } from "@/hooks/client/useCategories";
import { useFlashSales } from "@/hooks/client/useFlashSale";
import { useAppStore } from "@/store/appStore";

import FlashSaleTeaser from "@/components/home/FlashSaleTeaser";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductSection from "@/components/home/ProductSection";
import Newsletter from "@/components/home/Newsletter";
import ProductCard from "@/components/store/ProductCard";
import { DICTIONARY } from "../../app/homeDictionary";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20, duration: 0.8 },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function ShowcaseClient() {
  const { lang, isMounted } = useAppStore();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY["en"], [lang]);

  const { products, isLoading: productsLoading } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { flashSaleProducts, isLoading: flashSaleLoading } = useFlashSales();

  const loading = productsLoading || categoriesLoading || flashSaleLoading;

  const featuredProducts = useMemo(
    () => products?.filter((p) => p.isFeatured).slice(0, 8) || [],
    [products],
  );
  const newArrivals = useMemo(
    () =>
      [...(products || [])]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8),
    [products],
  );

  const dynamicCategorySections = useMemo(() => {
    if (
      !categories ||
      !products ||
      categories.length === 0 ||
      products.length === 0
    )
      return [];
    return categories
      .slice(0, 5)
      .map((cat) => {
        const catProducts = products
          .filter(
            (p) => String(p.category?._id || p.category) === String(cat._id),
          )
          .slice(0, 8);
        return {
          id: cat._id,
          title: cat.name,
          slug: cat.slug,
          products: catProducts,
        };
      })
      .filter((s) => s.products.length >= 4);
  }, [categories, products]);

  if (!isMounted || loading) {
    return (
      <div className="py-32 flex justify-center">
        <span className="animate-spin h-10 w-10 border-4 border-indigo-600 rounded-full border-t-transparent"></span>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <FlashSaleTeaser
          activeSale={flashSaleProducts?.flashSale}
          flashSaleProducts={flashSaleProducts}
          ui={ui}
          lang={lang}
        />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <CategoryGrid categories={categories} ui={ui} />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <ProductSection
          title={ui.featTitle}
          subTitle={ui.featSub}
          products={featuredProducts}
          lang={lang}
          isDarkBg={true}
        />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <ProductSection
          title={ui.newTitle}
          subTitle={ui.newSub}
          products={newArrivals}
          lang={lang}
          showLoadMore={true}
          ui={ui}
        />
      </motion.div>

      <Newsletter ui={ui} lang={lang} />

      {/* Dynamic Category Sections */}
      <div className="py-16 space-y-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500/5 dark:bg-blue-500/5 rounded-full blur-[150px] pointer-events-none"></div>

        {dynamicCategorySections.map((section, index) => (
          <motion.section
            key={section.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className={`py-12 ${index % 2 !== 0 ? "bg-gray-50/50" : ""}`}
          >
            <div className="container mx-auto px-4 md:px-6 mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900  uppercase italic">
                  {section.title}
                </h2>
                <div className="h-1 w-20 bg-indigo-600 mt-2"></div>
              </div>
              <button className="text-sm font-semibold tracking-widest uppercase border-b border-gray-400 hover:border-indigo-600 transition-colors pb-1">
                {ui.loadMore}
              </button>
            </div>

            <motion.div
              variants={containerVariants}
              className="flex overflow-x-auto gap-6 px-4 md:px-12 no-scrollbar pb-8 cursor-grab active:cursor-grabbing"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {section.products.map((product) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  className="min-w-[280px] md:min-w-[320px] lg:min-w-[350px]"
                >
                  <ProductCard product={product} lang={lang} />
                </motion.div>
              ))}
              <div className="min-w-[20px] md:min-w-[60px]"></div>
            </motion.div>
          </motion.section>
        ))}
      </div>
    </>
  );
}
