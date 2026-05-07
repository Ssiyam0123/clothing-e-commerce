"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, ShoppingCart, Zap, Check, AlertTriangle } from "lucide-react";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SizeSelectionModal({ product, isOpen, onOpenChange, mode = "cart" }) {
  const router = useRouter();
  const { addToCart, initiateBuyNow } = useProductStore();
  const { isAuthenticated } = useAuthStore();
  const [selectedSizeId, setSelectedSizeId] = useState(null);

  if (!product) return null;

  const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
  const availableSizes = product.sizes?.filter(s => s.stock > 0) || [];

  const handleConfirm = () => {
    if (!selectedSizeId) {
      toast.error("Please select a size.");
      return;
    }

    if (mode === "buy-now") {
      initiateBuyNow(product, selectedSizeId, 1);
      onOpenChange(false);
      router.push("/checkout?direct=true");
    } else {
      addToCart(product, selectedSizeId, 1, isAuthenticated);
      toast.success(`${product.name} added to cart`);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Select Size</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col">
          {/* Header */}
          <div className="relative h-32 bg-accent/10 flex items-center px-6 gap-4">
             <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image 
                  src={getImageUrl(product.images?.[0], 200, 80)}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
             </div>
             <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold truncate">{product.name}</h2>
                <div className="flex items-center gap-2">
                   <span className="text-primary font-bold">৳{discountedPrice.toFixed(0)}</span>
                   {product.discount > 0 && (
                     <span className="text-xs text-muted-foreground line-through">৳{product.price}</span>
                   )}
                </div>
             </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                 Available Sizes
              </span>
              <div className="grid grid-cols-4 gap-2">
                {availableSizes.map((s) => {
                  const sizeId = s.size?._id || s.size;
                  const isSelected = selectedSizeId === sizeId;
                  
                  return (
                    <button
                      key={sizeId}
                      onClick={() => setSelectedSizeId(sizeId)}
                      className={cn(
                        "h-10 rounded-md border text-sm font-medium transition-all",
                        isSelected 
                          ? "border-primary bg-primary text-primary-foreground" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {s.size?.name || "S"}
                    </button>
                  );
                })}
              </div>

              {availableSizes.length === 0 && (
                <p className="text-sm text-rose-500 font-medium py-2">Out of stock</p>
              )}
            </div>

            <Button
              onClick={handleConfirm}
              disabled={availableSizes.length === 0}
              className="w-full h-12 rounded-xl font-bold uppercase tracking-wider"
            >
              {mode === "buy-now" ? "Confirm & Buy Now" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
