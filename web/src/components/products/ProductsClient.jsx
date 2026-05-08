"use client";

import { useMemo } from "react";
import ProductFilter from "./ProductFilter";
import ProductList from "./ProductList";
import { useAppStore } from "@/store/appStore";
import { getTranslation } from "@/utils/typography/handler";

export default function ProductsClient({ initialData, initialCategories }) {
  const { lang } = useAppStore();
  const t = useMemo(() => getTranslation('products', lang), [lang]);

  return (
    <div className="w-full">
      <div className="mb-10">
        <ProductFilter initialCategories={initialCategories} t={t} />
      </div>
      <ProductList initialData={initialData} t={t} />
    </div>
  );
}
