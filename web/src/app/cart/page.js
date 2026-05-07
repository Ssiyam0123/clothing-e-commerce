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
  ChevronRight,
  ShieldAlert
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
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x divide-border/20">
        {/* 📦 LEFT: Manifest & Logistics */}
        <div className="lg:col-span-7 p-4 sm:p-12 lg:p-20 xl:p-24 space-y-16 sm:space-y-24 pt-20 sm:pt-24 lg:pt-32">
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
            <h1 className="text-3xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter italic text-gradient leading-none">
              {ui.title}
            </h1>
          </header>

          <div className="space-y-20 sm:space-y-32">
            {/* 01. Manifest Section */}
            <section className="space-y-8 sm:space-y-12">
              <div className="flex justify-between items-end border-b border-border/10 pb-4 sm:pb-6">
                <div className="space-y-1">
                  <h2 className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-accent-secondary">
                    01. {ui.manifest}
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-widest">Selected Artifacts</p>
                </div>
                <Badge className="bg-foreground text-background font-black px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] uppercase tracking-widest">
                  {items.length} {items.length === 1 ? "Unit" : "Units"}
                </Badge>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item, idx) => (
                    <motion.div
                      key={`${item.product._id}-${item.size._id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Card className="group border-none glass-card overflow-hidden transition-all duration-500 rounded-2xl sm:rounded-[2.5rem]">
                        <CardContent className="p-4 sm:p-8 flex gap-4 sm:gap-10">
                          <div className="relative w-20 sm:w-36 aspect-[3/4] rounded-xl sm:rounded-3xl overflow-hidden shrink-0 shadow-xl sm:shadow-2xl">
                            <Image
                              src={getImageUrl(item.product.images?.[0], 300, 100)}
                              alt={item.product.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-1 sm:py-2">
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1 sm:space-y-2">
                                <p className="text-[7px] sm:text-[10px] font-black text-accent-secondary uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                                  {item.product.category?.name || "Premium Drop"}
                                </p>
                                <h3 className="text-sm sm:text-2xl md:text-3xl font-black uppercase tracking-tighter italic text-gradient line-clamp-1">
                                  {item.product.name}
                                </h3>
                                <Badge variant="outline" className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest border-border/20 rounded-full px-2 sm:px-3">
                                  Size: {item.size?.name || "Standard"}
                                </Badge>
                              </div>
                              {!isDirectBuy && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemove(item.product._id, item.size._id)}
                                  className="text-muted-foreground hover:text-destructive transition-colors rounded-lg sm:rounded-xl h-8 w-8 sm:h-10 sm:w-10 hover:bg-destructive/10 shrink-0"
                                >
                                  <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                </Button>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 sm:mt-8">
                              <div className="flex items-center gap-2 sm:gap-4 glass p-0.5 sm:p-1 rounded-lg sm:rounded-2xl border-none shadow-inner">
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={isDirectBuy}
                                    onClick={() => handleQuantityChange(item.product._id, item.size._id, item.quantity, -1)}
                                    className="h-7 w-7 sm:h-10 sm:w-10 rounded-md sm:rounded-xl hover:bg-accent-secondary hover:text-white transition-all disabled:opacity-30"
                                 >
                                   <Minus size={12} className="sm:w-[14px] sm:h-[14px]" />
                                 </Button>
                                 <span className="font-black text-xs sm:text-base w-4 sm:w-6 text-center tabular-nums">
                                   {item.quantity}
                                 </span>
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={isDirectBuy}
                                    onClick={() => handleQuantityChange(item.product._id, item.size._id, item.quantity, 1)}
                                    className="h-7 w-7 sm:h-10 sm:w-10 rounded-md sm:rounded-xl hover:bg-accent-secondary hover:text-white transition-all disabled:opacity-30"
                                 >
                                   <Plus size={12} className="sm:w-[14px] sm:h-[14px]" />
                                 </Button>
                              </div>
                              <p className="text-xl sm:text-4xl font-black tracking-tighter text-foreground">
                                ৳{(item.discountedPrice * item.quantity).toFixed(0)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            {/* 02. Logistics Section */}
            <section className="space-y-10 sm:space-y-16">
              <div className="space-y-1 border-b border-border/10 pb-4 sm:pb-6">
                <h2 className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-accent-secondary">
                  02. {ui.destination}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-widest">Deployment Logistics</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                <LogisticsInput 
                  label="Full Identity" 
                  value={shippingInfo.name} 
                  onChange={(v) => setShippingInfo({ ...shippingInfo, name: v })}
                  placeholder="ENTER LEGAL NAME"
                  icon={<User size={18} />}
                />
                <LogisticsInput 
                  label="Neural Address (Email)" 
                  value={shippingInfo.email} 
                  onChange={(v) => setShippingInfo({ ...shippingInfo, email: v })}
                  placeholder="SYNC EMAIL ADDRESS"
                  icon={<Mail size={18} />}
                />
                <LogisticsInput 
                  label="Contact Protocol" 
                  value={shippingInfo.phone} 
                  onChange={(v) => setShippingInfo({ ...shippingInfo, phone: v })}
                  placeholder="+880 PHONE NUMBER"
                  icon={<Phone size={18} />}
                />

                <div className="space-y-3 sm:space-y-4">
                   <Label className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] ml-2 text-muted-foreground">Transit Zone</Label>
                   <RadioGroup 
                      value={deliveryZone} 
                      onValueChange={setDeliveryZone}
                      className="grid grid-cols-2 gap-3 sm:gap-4"
                   >
                     {["dhaka", "outside"].map((z) => (
                       <div key={z} className="relative">
                         <RadioGroupItem value={z} id={z} className="peer sr-only" />
                         <Label
                           htmlFor={z}
                           className="flex flex-col items-center justify-center h-12 sm:h-16 rounded-xl sm:rounded-2xl border-2 border-transparent bg-accent/20 peer-data-[state=checked]:border-accent-secondary peer-data-[state=checked]:bg-accent-secondary/10 peer-data-[state=checked]:text-accent-secondary cursor-pointer transition-all hover:bg-accent/40 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-center px-2"
                         >
                           {ui[z]}
                         </Label>
                       </div>
                     ))}
                   </RadioGroup>
                </div>

                <div className="md:col-span-2 space-y-3 sm:space-y-4">
                  <Label className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] ml-2 text-muted-foreground">Detailed Deployment Base (Address)</Label>
                  <Input
                    value={shippingInfo.street}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                    placeholder="STREET, HOUSE, AREA DETAILS / FULL DEPLOYMENT PATH"
                    className="bg-accent/20 border-none h-16 sm:h-20 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-accent-secondary/50 shadow-inner"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 💳 RIGHT: Financial Summary */}
        <div className="lg:col-span-5 p-4 sm:p-12 lg:p-20 xl:p-24 bg-accent/5">
          <div className="sticky top-24 sm:top-32 space-y-10 sm:space-y-12">
            <div className="space-y-1">
              <h2 className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-accent-secondary">
                03. Financial Summary
              </h2>
              <p className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-widest">Final Audit</p>
            </div>

            <Card className="rounded-[2.5rem] sm:rounded-[3.5rem] border-none shadow-2xl overflow-hidden glass-card">
              <CardContent className="p-8 sm:p-14 space-y-6 sm:space-y-8">
                <div className="space-y-4 sm:space-y-6">
                  <SummaryRow label={ui.subtotal} value={`৳${subtotal.toFixed(0)}`} />
                  
                  {appliedCoupon && (
                    <SummaryRow 
                      label={`${ui.promo} (${appliedCoupon.coupon?.code})`} 
                      value={`- ৳${appliedCoupon.discountAmount.toFixed(0)}`} 
                      highlight
                    />
                  )}

                  <SummaryRow label={ui.transit} value={`৳${shippingCharge}`} />
                </div>

                <Separator className="bg-border/20" />

                <div className="flex flex-col gap-1 sm:gap-2">
                  <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-accent-secondary">
                    {ui.total}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tighter text-gradient leading-none">
                      ৳{finalTotal.toFixed(0)}
                    </span>
                    <span className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">BDT</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voucher Area */}
            <div className="flex gap-2 p-1.5 sm:p-2 glass rounded-2xl sm:rounded-[2rem] shadow-xl border-none">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 bg-transparent border-none px-4 sm:px-8 text-[10px] sm:text-[11px] font-black uppercase tracking-widest focus-visible:ring-0 placeholder:text-muted-foreground/30 h-12 sm:h-14"
                placeholder="PROMO CODE"
              />
              <Button
                onClick={handleApplyCoupon}
                className="bg-primary text-primary-foreground h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-accent-secondary transition-all"
              >
                {ui.apply}
              </Button>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 sm:space-y-4">
               <Label className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] ml-2 text-muted-foreground">Settlement Protocol</Label>
               <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                  className="grid gap-2 sm:gap-3"
               >
                 {paymentOptions.ssl && (
                   <PaymentMethodItem 
                      id="ssl" 
                      title="Digital Settlement" 
                      icon={<CreditCard size={18} className="sm:w-5 sm:h-5" />} 
                      active={paymentMethod === "ssl"} 
                   />
                 )}
                 {paymentOptions.bkash && (
                   <PaymentMethodItem 
                      id="bkash" 
                      title="bKash Neural Wallet" 
                      icon={<Wallet size={18} className="sm:w-5 sm:h-5" />} 
                      active={paymentMethod === "bkash"} 
                   />
                 )}
                 {paymentOptions.cod && (
                   <PaymentMethodItem 
                      id="cod" 
                      title="Tactile Handover (COD)" 
                      icon={<Truck size={18} className="sm:w-5 sm:h-5" />} 
                      active={paymentMethod === "cod"} 
                   />
                 )}
               </RadioGroup>
            </div>

            {/* Authorize Button */}
            <Button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full h-16 sm:h-24 rounded-[1.5rem] sm:rounded-[3rem] bg-foreground text-background font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[11px] sm:text-sm shadow-2xl hover:bg-accent-secondary hover:text-white hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 group"
            >
              {isProcessing ? (
                <Loader size="small" />
              ) : (
                <>
                  <ShieldCheck size={18} className="mr-2 sm:mr-3 sm:w-5 sm:h-5 group-hover:animate-pulse" /> {ui.confirm}
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 opacity-30 text-[7px] sm:text-[8px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] italic pt-4">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              ENCRYPTED PROTOCOL / VANGUARD SECURITY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogisticsInput({ label, value, onChange, placeholder, icon }) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <Label className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] ml-2 text-muted-foreground">{label}</Label>
      <div className="relative">
        <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-muted-foreground/50">
          {icon}
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-accent/20 border-none h-14 sm:h-16 pl-12 sm:pl-14 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-accent-secondary/50 shadow-inner"
        />
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight }) {
  return (
    <div className={cn(
      "flex justify-between items-center text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]",
      highlight ? "text-emerald-500" : "text-muted-foreground"
    )}>
      <span className="flex items-center gap-2">
        {highlight && <Ticket size={12} className="sm:w-[14px] sm:h-[14px]" />} {label}
      </span>
      <span className={cn(!highlight && "text-foreground")}>{value}</span>
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
          "flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl sm:rounded-[2rem] border-2 cursor-pointer transition-all duration-500",
          active 
            ? "border-foreground bg-foreground/5 shadow-2xl scale-[1.01]" 
            : "border-border/10 bg-transparent opacity-40 hover:opacity-100"
        )}
      >
        <div className={cn(
          "w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl flex items-center justify-center transition-all",
          active ? "bg-foreground text-background" : "glass"
        )}>
          {icon}
        </div>
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">{title}</span>
        {active && (
          <div className="ml-auto w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,1)]" />
        )}
      </Label>
    </div>
  );
}

function EmptyState({ ui }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-background">
      <div className="w-32 h-32 sm:w-40 sm:h-40 glass rounded-3xl sm:rounded-[4rem] flex items-center justify-center mb-8 sm:mb-12 shadow-2xl animate-in zoom-in duration-1000">
        <ShoppingBag size={48} className="text-muted-foreground/20 sm:w-16 sm:h-16" />
      </div>
      <h2 className="text-3xl sm:text-7xl font-black uppercase tracking-tighter italic text-gradient mb-8 sm:mb-12 leading-none">
        {ui.empty}
      </h2>
      <Button
        asChild
        className="h-14 sm:h-16 px-10 sm:px-16 rounded-full bg-foreground text-background font-black uppercase text-[10px] sm:text-xs tracking-[0.3em] hover:bg-accent-secondary hover:text-white transition-all shadow-2xl"
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
          <div className="flex flex-col items-center gap-6">
             <ShoppingBag className="text-accent-secondary animate-bounce" size={48} />
             <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Initializing Manifest...</p>
          </div>
        </div>
      }
    >
      <UnifiedSettlementContent />
    </Suspense>
  );
}
