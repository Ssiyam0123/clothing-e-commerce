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
} from "lucide-react";

// Stores & Hooks
import { useAuthStore } from "@/store/authStore";
import { useOrders } from "@/hooks/useOrders";
import { useCoupons } from "@/hooks/useCoupons";
import { useSettings } from "@/hooks/useSettings";
import { useAppStore } from "@/store/appStore";
import { useTrackingStore } from "@/store/trackingStore";
import { getImageUrl } from "@/utils/imageUtils";
import { swalError, swalToast, swalConfirm } from "@/utils/swal";
import { useProductStore } from "@/store/productStore";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Loader from "@/components/common/Loader";

const DICTIONARY = {
  en: {
    title: "Settlement Vault",
    manifest: "Artifact Manifest",
    destination: "Logistics Info",
    payment: "Settlement Method",
    subtotal: "Subtotal",
    transit: "Transit Fee",
    total: "Final Investment",
    promo: "Voucher",
    apply: "Sync Code",
    confirm: "Authorize Order",
    processing: "Synchronizing...",
    dhaka: "Dhaka (Metropolitan)",
    outside: "Nationwide (Outside)",
    empty: "The Vault is Empty",
    browse: "Explore Drops",
  },
  bn: {
    title: "অর্ডার সেটেলমেন্ট",
    manifest: "পণ্যের তালিকা",
    destination: "শিপিং তথ্য",
    payment: "পেমেন্ট পদ্ধতি",
    subtotal: "উপ-মোট",
    transit: "ডেলিভারি ফি",
    total: "সর্বমোট বিনিয়োগ",
    promo: "ভাউচার",
    apply: "কোড দিন",
    confirm: "অর্ডার কনফার্ম করুন",
    processing: "প্রসেসিং হচ্ছে...",
    dhaka: "ঢাকার ভেতরে",
    outside: "ঢাকার বাইরে",
    empty: "ভল্ট খালি আছে",
    browse: "কালেকশন দেখুন",
  },
};

function UnifiedSettlementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDirectBuy = searchParams.get("type") === "direct";

  // Stores
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { lang } = useAppStore();
  const { cart, buyNowItem, updateCartItem, removeFromCart, clearCart } =
    useProductStore();
  const { settings, isLoading: settingsLoading } = useSettings();
  const { initOrder } = useOrders();
  const { validateCoupon } = useCoupons();
  const trackPurchase = useTrackingStore((state) => state.trackPurchase);

  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY.en, [lang]);

  // Local UI States
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ssl");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [deliveryZone, setDeliveryZone] = useState("dhaka");

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    street: "",
    phone: "",
  });

  // Items Memo
  const items = useMemo(() => {
    if (isDirectBuy && buyNowItem) return [buyNowItem];
    return cart?.itemsMap ? Object.values(cart.itemsMap) : [];
  }, [isDirectBuy, buyNowItem, cart?.itemsMap]);

  const subtotal = useMemo(() => {
    if (!items.length) return 0;
    return items.reduce(
      (sum, i) => sum + (i.discountedPrice || 0) * (i.quantity || 0),
      0,
    );
  }, [items]);

  // Sync User Data
  useEffect(() => {
    if (user) {
      setShippingInfo({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        street: user.addresses?.[0]?.street || "",
      });
    }
  }, [user]);

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

  const shippingCharge = useMemo(
    () => (deliveryZone === "dhaka" ? 60 : 120),
    [deliveryZone],
  );
  const finalTotal =
    subtotal - (appliedCoupon?.discountAmount || 0) + shippingCharge;

  const handleQuantityChange = (productId, sizeId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) handleRemove(productId, sizeId);
    else updateCartItem(productId, sizeId, newQty, isAuthenticated);
  };

  const handleRemove = async (productId, sizeId) => {
    const confirmed = await swalConfirm(
      "Purge Artifact?",
      "This item will be removed from your manifest.",
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
        swalToast("Voucher Synced", "success");
      }
    } catch (err) {
      swalError("Protocol Denied", "Voucher code not recognized.");
    }
  };

  const handlePlaceOrder = async () => {
    if (
      !shippingInfo.phone ||
      !shippingInfo.street ||
      !shippingInfo.name ||
      !shippingInfo.email
    ) {
      return swalError(
        "Manifest Incomplete",
        "Please provide all logistics data including email.",
      );
    }

    setIsProcessing(true);
    try {
      const result = await initOrder.mutateAsync({
        orderItems: items.map((i) => ({
          product: i.product._id,
          size: i.size?._id || i.size,
          quantity: i.quantity,
        })),
        shippingAddress: {
          ...shippingInfo,
          city: deliveryZone === "dhaka" ? "Dhaka" : "Outside Dhaka",
          pathao_city_id: deliveryZone === "dhaka" ? "1" : "2",
        },
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
        router.push("/profile?tab=orders");
      }
    } catch (err) {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !authLoading) return <EmptyState ui={ui} />;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-700">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x divide-border/50">
        {/* LEFT: Manifest & Logistics */}
        <div className="lg:col-span-7 p-6 md:p-12 lg:p-24 space-y-20">
          <header className="flex items-center gap-6 animate-in fade-in slide-in-from-left-4 duration-700">
            <Button
              variant="outline"
              size="icon"
              asChild
              className="w-14 h-14 rounded-2xl glass hover:bg-accent-secondary hover:text-white border-none shadow-xl transition-all"
            >
              <Link href="/products" aria-label="Back to products">
                <ArrowLeft size={20} />
              </Link>
            </Button>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic text-gradient leading-none">
              {ui.title}
            </h1>
          </header>

          <div className="space-y-32">
            {/* 01. Manifest Section */}
            <section className="space-y-12">
              <div className="flex justify-between items-end border-b border-border/50 pb-6">
                <div className="space-y-1">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-secondary">
                    01. {ui.manifest}
                  </h2>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Selected Artifacts</p>
                </div>
                <Badge className="bg-foreground text-background font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest">
                  {items.length} {items.length === 1 ? "Unit" : "Units"}
                </Badge>
              </div>

              <div className="space-y-6">
                {items.map((item, idx) => (
                  <Card 
                    key={`${item.product._id}-${item.size._id}`}
                    className="group border-none glass-card overflow-hidden hover:scale-[1.01] transition-all duration-500 rounded-[2.5rem]"
                  >
                    <CardContent className="p-6 md:p-8 flex gap-6 md:gap-10">
                      <div className="relative w-24 md:w-36 aspect-[3/4] rounded-3xl overflow-hidden shrink-0 shadow-2xl">
                        <Image
                          src={getImageUrl(item.product.images?.[0], 300, 100)}
                          alt={item.product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-accent-secondary uppercase tracking-[0.3em]">
                              {item.product.category?.name || "Premium Drop"}
                            </p>
                            <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter italic text-gradient line-clamp-1">
                              {item.product.name}
                            </h3>
                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-border/50 rounded-full px-3">
                              Size: {item.size?.name || "Standard"}
                            </Badge>
                          </div>
                          {!isDirectBuy && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemove(item.product._id, item.size._id)}
                              className="text-muted-foreground hover:text-destructive transition-colors rounded-xl h-10 w-10 hover:bg-destructive/10"
                            >
                              <Trash2 size={18} />
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-8">
                          <div className="flex items-center gap-4 glass p-1 rounded-2xl border-none shadow-inner">
                             <Button
                                variant="ghost"
                                size="icon"
                                disabled={isDirectBuy}
                                onClick={() => handleQuantityChange(item.product._id, item.size._id, item.quantity, -1)}
                                className="h-10 w-10 rounded-xl hover:bg-accent-secondary hover:text-white transition-all disabled:opacity-30"
                             >
                               <Minus size={14} />
                             </Button>
                             <span className="font-black text-base w-6 text-center tabular-nums">
                               {item.quantity}
                             </span>
                             <Button
                                variant="ghost"
                                size="icon"
                                disabled={isDirectBuy}
                                onClick={() => handleQuantityChange(item.product._id, item.size._id, item.quantity, 1)}
                                className="h-10 w-10 rounded-xl hover:bg-accent-secondary hover:text-white transition-all disabled:opacity-30"
                             >
                               <Plus size={14} />
                             </Button>
                          </div>
                          <p className="text-2xl md:text-4xl font-black tracking-tighter text-foreground">
                            ৳{(item.discountedPrice * item.quantity).toFixed(0)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* 02. Logistics Section */}
            <section className="space-y-16">
              <div className="space-y-1 border-b border-border/50 pb-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-secondary">
                  02. {ui.destination}
                </h2>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Deployment Logistics</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] ml-2 text-muted-foreground">Full Identity</Label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
                    <Input
                      value={shippingInfo.name}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                      placeholder="ENTER LEGAL NAME"
                      className="bg-accent/30 border-none h-16 pl-14 rounded-2xl font-black text-xs uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-accent-secondary/50 shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] ml-2 text-muted-foreground">Neural Address (Email)</Label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
                    <Input
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      placeholder="SYNC EMAIL ADDRESS"
                      className="bg-accent/30 border-none h-16 pl-14 rounded-2xl font-black text-xs uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-accent-secondary/50 shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] ml-2 text-muted-foreground">Contact Protocol</Label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
                    <Input
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      placeholder="+880 PHONE NUMBER"
                      className="bg-accent/30 border-none h-16 pl-14 rounded-2xl font-black text-xs uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-accent-secondary/50 shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                   <Label className="text-[10px] font-black uppercase tracking-[0.3em] ml-2 text-muted-foreground">Transit Zone</Label>
                   <RadioGroup 
                      value={deliveryZone} 
                      onValueChange={setDeliveryZone}
                      className="grid grid-cols-2 gap-4"
                   >
                     {["dhaka", "outside"].map((z) => (
                       <div key={z} className="relative">
                         <RadioGroupItem value={z} id={z} className="peer sr-only" />
                         <Label
                           htmlFor={z}
                           className="flex flex-col items-center justify-center h-16 rounded-2xl border-2 border-transparent bg-accent/30 peer-data-[state=checked]:border-accent-secondary peer-data-[state=checked]:bg-accent-secondary/10 peer-data-[state=checked]:text-accent-secondary cursor-pointer transition-all hover:bg-accent/50 text-[10px] font-black uppercase tracking-widest"
                         >
                           {ui[z]}
                         </Label>
                       </div>
                     ))}
                   </RadioGroup>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] ml-2 text-muted-foreground">Detailed Deployment Base (Address)</Label>
                  <Input
                    value={shippingInfo.street}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                    placeholder="STREET, HOUSE, AREA DETAILS / FULL DEPLOYMENT PATH"
                    className="bg-accent/30 border-none h-20 px-8 rounded-2xl font-black text-xs uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-accent-secondary/50 shadow-inner"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* RIGHT: Financial Summary */}
        <div className="lg:col-span-5 p-6 md:p-12 lg:p-24 bg-accent/5">
          <div className="sticky top-32 space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="space-y-1">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-secondary">
                03. Financial Summary
              </h2>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Final Audit</p>
            </div>

            <Card className="rounded-[3.5rem] border-none shadow-2xl overflow-hidden glass-card">
              <CardContent className="p-10 md:p-14 space-y-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                    <span>{ui.subtotal}</span>
                    <span className="text-foreground">৳{subtotal.toFixed(0)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500">
                      <span className="flex items-center gap-2">
                        <Ticket size={14} /> {ui.promo} ({appliedCoupon.coupon?.code})
                      </span>
                      <span>- ৳{appliedCoupon.discountAmount.toFixed(0)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                    <span>{ui.transit}</span>
                    <span className="text-foreground">৳{shippingCharge}</span>
                  </div>
                </div>

                <Separator className="bg-border/30" />

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-secondary">
                    {ui.total}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl md:text-8xl font-black tracking-tighter text-gradient leading-none">
                      ৳{finalTotal.toFixed(0)}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">BDT</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voucher Area */}
            <div className="flex gap-2 p-2 glass rounded-[2rem] shadow-xl border-none">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 bg-transparent border-none px-8 text-[11px] font-black uppercase tracking-widest focus-visible:ring-0 placeholder:text-muted-foreground/30 h-14"
                placeholder="PROMO CODE"
              />
              <Button
                onClick={handleApplyCoupon}
                className="bg-primary text-primary-foreground h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-accent-secondary transition-all"
              >
                {ui.apply}
              </Button>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-4">
               <Label className="text-[10px] font-black uppercase tracking-[0.3em] ml-2 text-muted-foreground">Settlement Protocol</Label>
               <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                  className="grid gap-3"
               >
                 {paymentOptions.ssl && (
                   <PaymentMethodItem 
                      id="ssl" 
                      title="Digital Settlement" 
                      icon={<CreditCard size={20} />} 
                      active={paymentMethod === "ssl"} 
                   />
                 )}
                 {paymentOptions.bkash && (
                   <PaymentMethodItem 
                      id="bkash" 
                      title="bKash Neural Wallet" 
                      icon={<Wallet size={20} />} 
                      active={paymentMethod === "bkash"} 
                   />
                 )}
                 {paymentOptions.cod && (
                   <PaymentMethodItem 
                      id="cod" 
                      title="Tactile Handover (COD)" 
                      icon={<Truck size={20} />} 
                      active={paymentMethod === "cod"} 
                   />
                 )}
               </RadioGroup>
            </div>

            {/* Authorize Button */}
            <Button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full h-24 rounded-[3rem] bg-foreground text-background font-black uppercase tracking-[0.5em] text-sm shadow-2xl hover:bg-accent-secondary hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 group"
            >
              {isProcessing ? (
                <Loader size="small" />
              ) : (
                <>
                  <ShieldCheck size={20} className="mr-3 group-hover:animate-pulse" /> {ui.confirm}
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 opacity-30 text-[8px] font-black uppercase tracking-[0.4em] italic pt-8">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              ENCRYPTED PROTOCOL / VANGUARD SECURITY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentMethodItem({ id, title, icon, active }) {
  return (
    <div className="relative">
      <RadioGroupItem value={id} id={id} className="peer sr-only" />
      <Label
        htmlFor={id}
        className={cn(
          "flex items-center gap-6 p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-500",
          active 
            ? "border-foreground bg-foreground/5 shadow-2xl scale-[1.01]" 
            : "border-border/30 bg-transparent opacity-40 hover:opacity-100"
        )}
      >
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
          active ? "bg-foreground text-background" : "glass"
        )}>
          {icon}
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest">{title}</span>
        {active && (
          <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,1)]" />
        )}
      </Label>
    </div>
  );
}

function EmptyState({ ui }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-12 bg-background">
      <div className="w-40 h-40 glass rounded-[4rem] flex items-center justify-center mb-12 shadow-2xl animate-in zoom-in duration-1000">
        <ShoppingBag size={64} className="text-muted-foreground/20" />
      </div>
      <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic text-gradient mb-12">
        {ui.empty}
      </h2>
      <Button
        asChild
        className="h-16 px-16 rounded-full bg-foreground text-background font-black uppercase text-xs tracking-[0.3em] hover:bg-accent-secondary hover:text-white transition-all shadow-2xl"
      >
        <Link href="/products">
          {ui.browse}
        </Link>
      </Button>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-background">
          <Loader />
        </div>
      }
    >
      <UnifiedSettlementContent />
    </Suspense>
  );
}
