"use client";

import { use, useEffect, useState, useMemo } from "react";
import { useAdminProduct } from "@/app/admin/products/lib/useAdminProducts";
import { useSizes } from "@/app/_common/lib/useSizes";
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
import ProductManageNavigation from "@/app/admin/products/components/ProductManageNavigation";

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
      {/* 🔙 Navigation */}
      <div className="mb-6">
        <Link href="/admin/products">
          <Button 
            variant="ghost" 
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all p-0 hover:bg-transparent"
          >
            <div className="w-8 h-8 rounded-full border border-border/10 flex items-center justify-center group-hover:border-foreground/20 transition-colors">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span>Back to Products</span>
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <div>
          <h1 className="admin-title">
            Manage <span className="text-muted-foreground/30">Console</span>
          </h1>
          <p className="admin-subtitle">Inventory, Pricing, Media & Social metrics for: <span className="text-primary">{product?.name}</span></p>
        </div>
        
        <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-3xl border border-border/5">
          <div className="h-10 w-10 rounded-xl overflow-hidden border border-border/10 shrink-0">
             <img src={getImageUrl(product?.images?.[0])} className="w-full h-full object-cover grayscale" />
          </div>
          <div>
             <p className="text-[10px] font-black uppercase leading-none mb-1 line-clamp-1 max-w-[200px]">{product?.name}</p>
             <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none">SKU: {product?.sku || "GENERATED"}</p>
          </div>
        </div>
      </div>

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
        </div>

        {/* 📱 Unified Floating Tabs Navigation */}
        <ProductManageNavigation activeTab={activeTab} product={product} />
      </Tabs>
    </div>
  );
}
