"use client";

import { use, useEffect, useState, useMemo } from "react";
import { useAdminProducts } from "@/app/admin/products/lib/useAdminProducts";
import { useSizes } from "@/app/_common/lib/useSizes";
import Loader from "@/components/common/Loader";
import { getImageUrl } from "@/utils/imageUtils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Subcomponents for each Tab
import ManageStockTab from "@/app/admin/products/components/ManageStockTab";
import ManagePricingTab from "@/app/admin/products/components/ManagePricingTab";
import ManageImagesTab from "@/app/admin/products/components/ManageImagesTab";
import ManageReviewsTab from "@/app/admin/products/components/ManageReviewsTab";

export default function ProductManagementPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const { products, updateProduct, patchProduct } = useAdminProducts();
  const { sizes } = useSizes();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("stock");

  // Find and bind current product
  useEffect(() => {
    if (products && products.length > 0) {
      const found = products.find(p => p._id === id);
      if (found) {
        setProduct(found);
        setLoading(false);
      }
    }
  }, [products, id]);

  const filteredSizes = useMemo(() => {
    if (!product || !sizes) return [];
    const catId = product.category?._id || product.category;
    return sizes.filter(
      (size) => (size.category?._id || size.category) === catId
    );
  }, [product, sizes]);

  if (loading) {
    return (
      <div className="admin-page-container flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="admin-page-container max-w-6xl pb-24">
      {/* 🔙 Navigation */}
      <div className="mb-4">
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
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
      <Tabs defaultValue="stock" onValueChange={setActiveTab} className="space-y-10">
        <TabsList className="bg-muted/10 border border-border/5 p-1 rounded-2xl h-16 w-full flex overflow-x-auto justify-start md:justify-center items-center scrollbar-none gap-2">
          <TabsTrigger value="stock" className="flex-1 rounded-xl h-12 font-black text-[9px] uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background">
             Stock Levels
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex-1 rounded-xl h-12 font-black text-[9px] uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background">
             Pricing Metrics
          </TabsTrigger>
          <TabsTrigger value="images" className="flex-1 rounded-xl h-12 font-black text-[9px] uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background">
             Product Images
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex-1 rounded-xl h-12 font-black text-[9px] uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background">
             Reviews ({product?.showReviews === false ? "Off" : "Active"})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Stock levels */}
        <TabsContent value="stock" className="focus-visible:outline-none">
          <ManageStockTab 
            product={product} 
            filteredSizes={filteredSizes} 
            updateProduct={updateProduct} 
          />
        </TabsContent>

        {/* Tab 2: Pricing Metrics */}
        <TabsContent value="pricing" className="focus-visible:outline-none">
          <ManagePricingTab 
            product={product} 
            updateProduct={updateProduct} 
          />
        </TabsContent>

        {/* Tab 3: Product Images */}
        <TabsContent value="images" className="focus-visible:outline-none">
          <ManageImagesTab 
            product={product} 
            updateProduct={updateProduct}
            setProduct={setProduct}
          />
        </TabsContent>

        {/* Tab 4: Reviews list */}
        <TabsContent value="reviews" className="focus-visible:outline-none">
          <ManageReviewsTab 
            product={product} 
            setProduct={setProduct} 
            patchProduct={patchProduct} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}



