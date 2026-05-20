"use client";

import { useState, useMemo } from "react";
import { X, Minus, Plus } from "lucide-react";
import { useProductStore } from "@/store/productStore";
import { notify } from "@/utils/swal";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useTrackingStore } from "@/store/trackingStore";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

export default function QuickSelectModal({ isOpen, onClose, product, lang, mode = "quick-view" }) {
  const { settings } = useAppStore();
  const siteName = settings?.branding?.siteName || "Store";
  const router = useRouter();

  const [prevProduct, setPrevProduct] = useState(null);
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  if (product !== prevProduct || isOpen !== prevIsOpen) {
    setPrevProduct(product);
    setPrevIsOpen(isOpen);
    if (isOpen && product) {
      const availableSize = product.sizes?.find((s) => s.stock > 0);
      if (availableSize) {
        const sizeId = availableSize.size?._id || availableSize.size;
        const sizeName =
          availableSize.size?.name || availableSize.name || "Standard";
        setSelectedSize({ _id: sizeId, name: sizeName });
      } else {
        setSelectedSize(null);
      }
      setQuantity(1);
    } else {
      setSelectedSize(null);
      setQuantity(1);
    }
  }

  const addToCart = useProductStore((state) => state.addToCart);
  const initiateBuyNow = useProductStore((state) => state.initiateBuyNow);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const trackAddToCart = useTrackingStore((state) => state.trackAddToCart);

  const isBn = lang === "bn";

  const discountedPrice = useMemo(() => {
    if (!product) return 0;
    return product.price - (product.price * (product.discount || 0)) / 100;
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAction = async (type) => {
    if (!selectedSize) {
      return notify.error(
        isBn
          ? "অনুগ্রহ করে সাইজ নির্বাচন করুন"
          : "Please select a size"
      );
    }

    if (type === "buy") {
      if (typeof initiateBuyNow === "function") {
        initiateBuyNow(product, selectedSize._id, quantity);
        router.push("/cart?type=direct");
        onClose();
      } else {
        console.error("Store Error: initiateBuyNow is not defined.");
        notify.error("System Error", "Please refresh");
      }
    } else {
      if (typeof addToCart === "function") {
        addToCart(product, selectedSize._id, quantity, isAuthenticated);
        trackAddToCart(product._id, discountedPrice, quantity);
        notify.success(
          isBn ? "ব্যাগে যোগ করা হয়েছে" : "Added to Bag"
        );
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="quick-select-modal-container">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="quick-select-close-btn"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Product Title */}
            <div className="pr-8">
              <h4 className="quick-select-title">
                {product.name}
              </h4>
            </div>

            {/* Price Info */}
            <div className="flex flex-col">
              <span className="quick-select-price-label">
                {isBn ? "দাম" : "Price"}
              </span>
              <span className="quick-select-price-val">
                {discountedPrice.toFixed(0)} BDT
              </span>
            </div>

            {/* Size Section */}
            <div className="flex flex-col gap-2">
              <span className="quick-select-size-label">
                Size
              </span>
              <div className="flex flex-wrap gap-2.5 mt-1">
                {product.sizes?.map((item, index) => {
                  const isPopulated = item.size && typeof item.size === "object";
                  const sizeName = isPopulated ? item.size.name : item.name || "N/A";
                  const sizeId = isPopulated ? item.size._id : item.size;
                  const outOfStock = item.stock <= 0;
                  const isSelected = selectedSize?._id === sizeId;

                  return (
                    <button
                      key={sizeId || index}
                      disabled={outOfStock}
                      onClick={() => setSelectedSize({ _id: sizeId, name: sizeName })}
                      className={cn(
                        "quick-select-size-btn",
                        isSelected && "quick-select-size-btn-active",
                        outOfStock && "quick-select-size-btn-disabled"
                      )}
                    >
                      {sizeName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Controls and Action Buttons */}
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex gap-3 items-center">
                {/* Quantity Selector */}
                <div className="quick-select-qty-container">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="quick-select-qty-btn"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="quick-select-qty-val">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="quick-select-qty-btn"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Add to Cart button */}
                {(mode === "quick-view" || mode === "cart") && (
                  <button
                    onClick={() => handleAction("cart")}
                    className="quick-select-cart-btn"
                  >
                    {isBn ? "কার্টে যোগ করুন" : "Add to Cart"}
                  </button>
                )}

                {/* Buy Now button inline if in buy-now mode */}
                {mode === "buy-now" && (
                  <button
                    onClick={() => handleAction("buy")}
                    className="quick-select-buy-inline-btn"
                  >
                    {isBn ? "অর্ডার করুন" : "Order Now"}
                  </button>
                )}
              </div>

              {/* Order Now / Buy Now button below in quick-view mode */}
              {mode === "quick-view" && (
                <button
                  onClick={() => handleAction("buy")}
                  className="quick-select-buy-btn"
                >
                  {isBn ? "অর্ডার করুন" : "Order Now"}
                </button>
              )}
            </div>
          </div>
        </div>
  );
}