"use client";

import Link from "next/link";
import ProductCard from "@/components/common/ProductCard";

export default function FlashSaleTeaser({
  activeSale,
  flashSaleProducts,
}) {
  if (!activeSale || !flashSaleProducts?.products?.length) return null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
        {flashSaleProducts.products.slice(0, 4).map((p) => (
          <div key={p._id}>
            <ProductCard product={p} isFlashSale={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
