"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, ShoppingBag, Zap, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/utils/imageUtils";
import { useProductStore } from "@/store/productStore";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import { getTranslation } from "@/utils/typography/handler";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function SizeSelectionModal({ product, isOpen, onOpenChange, mode = "cart" }) {
  const router = useRouter();
  const { addToCart, initiateBuyNow } = useProductStore();
  const { isAuthenticated } = useAuthStore();
  const { lang } = useAppStore();
  const [selectedSizeId, setSelectedSizeId] = useState(null);

  const t = useMemo(() => getTranslation('product_details', lang), [lang]);

  if (!product) return null;

  const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
  const sizes = product.sizes || [];

  // 🚀 DEBUG: Examine the artifact structure
  console.log("Size Protocol Diagnostic:", {
    productId: product._id,
    sizesLength: sizes.length,
    firstSizeEntry: sizes[0],
    isPopulated: typeof sizes[0]?.size === 'object'
  });

  const handleConfirm = () => {
    if (!selectedSizeId) {
      toast.error(lang === 'bn' ? "দয়া করে একটি সাইজ নির্বাচন করুন।" : "Please select a size to proceed.");
      return;
    }

    if (mode === "buy-now") {
      initiateBuyNow(product, selectedSizeId, 1);
      onOpenChange(false);
      router.push("/cart?type=direct");
    } else {
      addToCart(product, selectedSizeId, 1, isAuthenticated);
      toast.success(t.addedToCart || `${product.name} added to cart`, {
        description: lang === 'bn' ? "সফলভাবে যোগ করা হয়েছে।" : "Protocol updated successfully.",
        icon: <ShoppingBag className="w-4 h-4 text-emerald-500" />
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[450px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] bg-background/95 backdrop-blur-3xl [&>button]:hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="sr-only">
          <DialogTitle>{t.selectSize || "Select Dimensional Protocol"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* 🏔️ Visual Header */}
          <div className="relative p-6 sm:p-8 flex items-center gap-5 bg-gradient-to-br from-accent/30 to-transparent border-b border-border/5 shrink-0">
             <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden flex-shrink-0 shadow-2xl ring-1 ring-white/10">
                <Image 
                  src={getImageUrl(product.images?.[0], 400, 160)}
                  alt={product.name}
                  fill
                  className="object-cover scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10" />
             </div>
             
             <div className="flex-1 min-w-0 space-y-2">
                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-accent-secondary/30 text-accent-secondary bg-accent-secondary/5">
                   {product.category?.name || t.premiumArtifact}
                </Badge>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter leading-[1.1] italic line-clamp-2 py-1">
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-2">
                   <span className="text-lg font-black text-foreground">৳{discountedPrice.toFixed(0)}</span>
                   {product.discount > 0 && (
                     <span className="text-[10px] text-muted-foreground line-through font-bold">৳{product.price}</span>
                   )}
                </div>
             </div>

             <button 
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/50 hover:bg-foreground hover:text-background flex items-center justify-center transition-all"
             >
                <X size={14} />
             </button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 sm:p-8 pb-12 sm:pb-20 space-y-8">
              {/* 📏 Selection Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                    {t.selectSize || "Dimensional Protocol"}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {sizes.length > 0 ? (
                    sizes.map((s) => {
                      const sizeObj = s.size || {};
                      const sizeId = String(sizeObj._id || sizeObj.id || s.size || "");
                      const sizeName = sizeObj.name || (typeof s.size === 'string' ? s.size : "—");
                      const isSelected = String(selectedSizeId) === sizeId;
                      
                      if (!sizeId) return null;

                      return (
                        <motion.button
                          key={sizeId}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedSizeId(sizeId)}
                          className={cn(
                            "group relative h-14 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-0.5",
                            isSelected 
                              ? "border-accent-secondary bg-accent-secondary text-white shadow-lg shadow-accent-secondary/20" 
                              : "border-border/40 hover:border-accent-secondary/50 hover:bg-accent/30"
                          )}
                        >
                          <span className={cn(
                            "text-xs font-black uppercase tracking-wider",
                            isSelected ? "text-white" : "text-foreground group-hover:text-accent-secondary"
                          )}>
                            {sizeName}
                          </span>
                          
                          {isSelected && (
                            <motion.div 
                              layoutId="active-check"
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-lg"
                            >
                               <Check size={10} className="text-accent-secondary stroke-[4]" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })
                  ) : (
                    <div className="col-span-full py-10 text-center glass rounded-3xl border-dashed border-2 border-border/20">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground italic">
                          No Dimensional Protocols Available
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ⚡ Action Node */}
              <div className="space-y-4">
                <Button
                  onClick={handleConfirm}
                  disabled={sizes.length === 0}
                  className={cn(
                    "w-full h-16 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-500 group shadow-2xl",
                    mode === 'buy-now' 
                      ? "bg-foreground text-background hover:bg-accent-secondary hover:text-white" 
                      : "bg-accent-secondary text-white hover:bg-foreground hover:text-background"
                  )}
                >
                  {mode === "buy-now" ? (
                    <div className="flex items-center gap-3">
                      <Zap size={16} className="animate-pulse" />
                      <span>{t.buyNow || "Execute Buy Now"}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <ShoppingBag size={16} />
                      <span>{t.addToCart || "Append to Cart"}</span>
                    </div>
                  )}
                </Button>
                
                <p className="text-[8px] font-bold text-center text-muted-foreground uppercase tracking-[0.4em] animate-pulse">
                  Secure Terminal Transfer v4.0.1
                </p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
