"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Plus,
  Minus,
  ShieldCheck,
  CreditCard,
  Wallet,
  Truck,
  Trash2,
  Mail,
  ArrowLeft,
  User,
  Phone,
  Ticket,
  Check,
  ImageOff,
  Edit2
} from "lucide-react";

// Stores & Hooks
import { useAuthStore } from "@/store/authStore";
import { useOrders } from "@/app/_common/lib/useOrders";
import { useCoupons } from "@/app/_common/lib/useCoupons";
import { useSettings } from "@/hooks/useSettings";
import { useAppStore } from "@/store/appStore";
import { useTrackingStore } from "@/store/trackingStore";
import { getImageUrl } from "@/utils/imageUtils";
import { swalError, swalToast, swalConfirm } from "@/utils/swal";
import { useProductStore } from "@/store/productStore";
import api from "@/lib/api";
import { getTranslation } from "@/utils/typography/handler";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Loader from "@/components/common/Loader";
import { motion, AnimatePresence } from "framer-motion";

// Extracted Components
import SizeEditModal from "./components/SizeEditModal";
import LogisticsInput from "./components/LogisticsInput";
import SummaryRow from "./components/SummaryRow";
import PaymentMethodItem from "./components/PaymentMethodItem";
import EmptyCartState from "./components/EmptyCartState";
import CartItemCard from "./components/CartItemCard";
import CartLogisticsForm from "./components/CartLogisticsForm";
import CartFinancialSummary from "./components/CartFinancialSummary";


function UnifiedSettlementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDirectBuy = searchParams.get("type") === "direct";

  // Stores
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { lang } = useAppStore();
  const { cart, buyNowItem, updateCartItem, updateBuyNowQuantity, removeFromCart, clearCart } =
    useProductStore();
  const { settings, isLoading: settingsLoading } = useSettings();
  const { initOrder } = useOrders();
  const { validateCoupon } = useCoupons();
  const trackPurchase = useTrackingStore((state) => state.trackPurchase);

  const t = useMemo(() => getTranslation('cart', lang), [lang]);

  // Local UI States
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ssl");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [deliveryZone, setDeliveryZone] = useState("dhaka");

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "", // Optional
    phone: "",
    address: "",
  });

  const [editModal, setEditModal] = useState({ isOpen: false, item: null });

  // Items Memo
  const items = useMemo(() => {
    if (isDirectBuy && buyNowItem) return [buyNowItem];
    if (!cart?.itemsMap) return [];
    return Object.values(cart.itemsMap).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  }, [isDirectBuy, buyNowItem, cart?.itemsMap]);

  const subtotal = useMemo(() => {
    if (!items.length) return 0;
    return items.reduce(
      (sum, i) => sum + (i.discountedPrice || 0) * (i.quantity || 0),
      0,
    );
  }, [items]);
  const totalQuantity = useMemo(() => {
    if (!items.length) return 0;
    return items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  }, [items]);

  // Sync User Data
  useEffect(() => {
    if (user) {
      setShippingInfo({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.addresses?.[0]?.address || user.addresses?.[0]?.street || "",
      });
    }
  }, [user]);

  const trackInitiateCheckout = useTrackingStore((state) => state.trackInitiateCheckout);
  useEffect(() => {
    if (items.length > 0) {
      trackInitiateCheckout();
    }
  }, [items.length, trackInitiateCheckout]);

  const paymentOptions = useMemo(
    () => ({
      ssl: settings?.paymentOptions?.online ?? true,
      bkash: settings?.paymentOptions?.bkash ?? true,
      cod: settings?.paymentOptions?.cod ?? true,
    }),
    [settings],
  );

  useEffect(() => {
    if (!settingsLoading) {
      if (paymentOptions.ssl) setPaymentMethod("ssl");
      else if (paymentOptions.bkash) setPaymentMethod("bkash");
      else if (paymentOptions.cod) setPaymentMethod("cod");
    }
  }, [paymentOptions, settingsLoading]);

  const shippingCharge = useMemo(() => {
    const inside = settings?.shipping?.insideDhaka ?? 60;
    const outside = settings?.shipping?.outsideDhaka ?? 120;
    return deliveryZone === "dhaka" ? inside : outside;
  }, [deliveryZone, settings]);
  const finalTotal =
    subtotal - (appliedCoupon?.discountAmount || 0) + shippingCharge;

  const handleQuantityChange = (productId, sizeId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) {
      if (isDirectBuy) {
        router.push("/products");
      } else {
        handleRemove(productId, sizeId);
      }
    } else {
      if (isDirectBuy) {
        updateBuyNowQuantity(newQty);
      } else {
        updateCartItem(productId, sizeId, newQty, isAuthenticated);
      }
    }
  };

  const handleRemove = async (productId, sizeId) => {
    const confirmed = await swalConfirm(
      t.purgeArtifact || "Remove Item?",
      t.removeDescription || "Are you sure you want to remove this item?",
    );
    if (confirmed) removeFromCart(productId, sizeId, isAuthenticated);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const data = await validateCoupon({
        code: couponCode,
        cartTotal: subtotal,
      });
      if (data.valid) {
        setAppliedCoupon(data);
        swalToast(t.syncCode || "Coupon Applied", "success");
      }
    } catch (err) {
      swalError(t.protocolDenied || "Invalid Coupon", t.voucherUnrecognized || "The coupon code is invalid.");
    }
  };

  const handlePlaceOrder = async () => {
    if (
      !shippingInfo.phone ||
      !shippingInfo.address ||
      !shippingInfo.name
    ) {
      return swalError(
        t.manifestIncomplete || "Information Missing",
        t.provideLogistics || "Please provide your name, phone and address.",
      );
    }

    setIsProcessing(true);
    try {
      const result = await initOrder({
        orderItems: items.map((i) => ({
          product: i.product._id,
          size: i.size?._id || i.size,
          quantity: i.quantity,
        })),
        shippingAddress: {
          ...shippingInfo,
        },
        shippingPrice: shippingCharge,
        deliveryZone,
        paymentMethod,
        couponCode: appliedCoupon?.coupon?.code,
        isDirectBuy,
      });
      if (paymentMethod === "cod") {
        trackPurchase(
          result.orderId,
          finalTotal,
          items.map((i) => i.product._id),
        );
        clearCart();
        router.push("/profile/order");
      }
    } catch (err) {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !authLoading) return <EmptyCartState t={t} />;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-700">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x divide-border/20">
        {/* 📦 LEFT: Manifest & Logistics */}
        <div className="lg:col-span-7 p-4 sm:p-12 lg:p-16 xl:p-20 space-y-12 sm:space-y-20 pt-20 sm:pt-24 lg:pt-32">
          <header className="flex items-center gap-4 sm:gap-6">
            <Button
              variant="outline"
              size="icon"
              asChild
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl glass hover:bg-accent-secondary hover:text-white border-none shadow-xl transition-all"
            >
              <Link href="/products" aria-label="Back to products">
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              </Link>
            </Button>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-gradient leading-none">
              {t.title}
            </h1>
          </header>

          <div className="space-y-16 sm:space-y-24">
            {/* 01. Manifest Section */}
            <section className="space-y-6 sm:space-y-8">
              <div className="flex justify-between items-end border-b border-border/10 pb-4 sm:pb-6">
                <div className="space-y-1">
                  <h2 className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-accent-secondary">
                    01. {t.manifest}
                  </h2>
                  <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.selectedArtifacts}</p>
                </div>
                <Badge className="bg-foreground text-background font-black px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] uppercase tracking-widest">
                  {totalQuantity} {totalQuantity === 1 ? t.unit : t.units}
                </Badge>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item, idx) => (
                    <CartItemCard
                      key={`${item.product._id}-${item.size._id}`}
                      item={item}
                      t={t}
                      isDirectBuy={isDirectBuy}
                      onEditSize={(itm) => setEditModal({ isOpen: true, item: itm })}
                      onRemove={handleRemove}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </section>

            {/* 02. Logistics Section */}
            <CartLogisticsForm 
              t={t}
              shippingInfo={shippingInfo}
              setShippingInfo={setShippingInfo}
              deliveryZone={deliveryZone}
              setDeliveryZone={setDeliveryZone}
            />
          </div>
        </div>

        {/* 💳 RIGHT: Financial Summary */}
        <CartFinancialSummary 
          t={t}
          subtotal={subtotal}
          appliedCoupon={appliedCoupon}
          shippingCharge={shippingCharge}
          finalTotal={finalTotal}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          handleApplyCoupon={handleApplyCoupon}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          paymentOptions={paymentOptions}
          handlePlaceOrder={handlePlaceOrder}
          isProcessing={isProcessing}
        />
      </div>
      
      <SizeEditModal 
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, item: null })}
        item={editModal.item}
        isAuth={isAuthenticated}
        t={t}
      />
    </div>
  );
}


export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background p-4 sm:p-12 lg:p-24 space-y-12">
          <div className="flex items-center gap-6">
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <Skeleton className="h-20 w-[60%] rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             <div className="lg:col-span-7 space-y-8">
                <Skeleton className="h-[200px] w-full rounded-[2.5rem]" />
                <Skeleton className="h-[200px] w-full rounded-[2.5rem]" />
             </div>
             <div className="lg:col-span-5">
                <Skeleton className="h-[400px] w-full rounded-[3.5rem]" />
             </div>
          </div>
        </div>
      }
    >
      <UnifiedSettlementContent />
    </Suspense>
  );
}
