"use client";

import { use, useEffect, useState, useMemo } from "react";
import { useAdminProduct } from "@/app/admin/products/lib/useAdminProducts";
import { useSizes } from "@/app/admin/sizes/lib/useSizes";
import Loader from "@/components/common/Loader";
import { getImageUrl } from "@/utils/imageUtils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Box, DollarSign, Image, MessageSquare } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Subcomponents for each Tab
import ManageStockTab from "@/app/admin/products/components/ManageStockTab";
import ManagePricingTab from "@/app/admin/products/components/ManagePricingTab";
import ManageImagesTab from "@/app/admin/products/components/ManageImagesTab";
import ManageReviewsTab from "@/app/admin/products/components/ManageReviewsTab";
import ManageSeoTab from "@/app/admin/products/components/ManageSeoTab";
import ProductManageNavigation from "@/app/admin/products/components/ProductManageNavigation";
import AdminPageHeader, { AdminBackLink } from "@/app/admin/_components/AdminPageHeader";

export default function ProductManagementPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const { product: fetchedProduct, isLoading, updateProduct, patchProduct } = useAdminProduct(id);
  const { sizes } = useSizes();

  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("stock");

  // Find and bind current product
  useEffect(() => {
    if (fetchedProduct) {
      setProduct(fetchedProduct);
    }
  }, [fetchedProduct]);

  const filteredSizes = useMemo(() => {
    if (!product || !sizes) return [];
    const catId = product.category?._id || product.category;
    return sizes.filter(
      (size) => (size.category?._id || size.category) === catId
    );
  }, [product, sizes]);

  if (isLoading || !product) {
    return (
      <div className="admin-page-container flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="admin-page-container max-w-[1400px] mx-auto pb-32">
      <AdminBackLink href="/admin/products" label="Back to products" />

      <AdminPageHeader
        title="Manage product"
        description={
          product?.name
            ? `Stock, pricing, images, reviews, and SEO for ${product.name}.`
            : "Stock, pricing, images, reviews, and SEO."
        }
        actions={
          <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border/10">
              <img
                src={getImageUrl(product?.images?.[0])}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="line-clamp-1 max-w-[200px] text-sm font-medium">{product?.name}</p>
              <p className="text-xs text-muted-foreground">SKU: {product?.sku || "—"}</p>
            </div>
          </div>
        }
      />

      {/* Control Center Tabs */}
      <Tabs defaultValue="stock" onValueChange={setActiveTab} className="w-full">
        {/* Workspace Card */}
        <div className="bg-card border border-border p-8 md:p-14 rounded-[3rem] shadow-sm flex flex-col justify-start min-h-[650px] lg:min-h-[700px] w-full">
           {/* Tab 1: Stock levels */}
           <TabsContent value="stock" className="focus-visible:outline-none mt-0 w-full">
             <ManageStockTab 
               product={product} 
               filteredSizes={filteredSizes} 
               updateProduct={updateProduct} 
             />
           </TabsContent>

           {/* Tab 2: Pricing Metrics */}
           <TabsContent value="pricing" className="focus-visible:outline-none mt-0 w-full">
             <ManagePricingTab 
               product={product} 
               updateProduct={updateProduct} 
             />
           </TabsContent>

           {/* Tab 3: Product Images */}
           <TabsContent value="images" className="focus-visible:outline-none mt-0 w-full">
             <ManageImagesTab 
               product={product} 
               updateProduct={updateProduct}
               setProduct={setProduct}
             />
           </TabsContent>

           {/* Tab 4: Reviews list */}
           <TabsContent value="reviews" className="focus-visible:outline-none mt-0 w-full">
             <ManageReviewsTab 
               product={product} 
               setProduct={setProduct} 
               patchProduct={patchProduct} 
             />
           </TabsContent>

           {/* Tab 5: SEO Configuration */}
           <TabsContent value="seo" className="focus-visible:outline-none mt-0 w-full">
             <ManageSeoTab 
               product={product} 
               updateProduct={updateProduct} 
             />
           </TabsContent>
        </div>

        {/* 📱 Unified Floating Tabs Navigation */}
        <ProductManageNavigation activeTab={activeTab} product={product} />
      </Tabs>
    </div>
  );
}
