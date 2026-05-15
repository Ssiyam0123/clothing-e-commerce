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
  Edit2,
  Check
} from "lucide-react";

// Stores & Hooks
import { useAuthStore } from "@/store/authStore";
import { useOrders } from "@/hooks/client/useOrders";
import { useCoupons } from "@/hooks/useCoupons";
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

function SizeEditModal({ isOpen, onClose, item, isAuth, t }) {
  const { changeItemSize } = useProductStore();
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && item) {
      setIsLoading(true);
      api.get(`/products/${item.product._id}`)
        .then(res => {
          setProductData(res.data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [isOpen, item]);

  if (!isOpen) return null;

  const handleSizeSelect = async (newSizeId, newSizeName) => {
    const sId = typeof newSizeId === 'object' ? newSizeId._id : newSizeId;
    await changeItemSize(item.product._id, item.size._id, sId, newSizeName, isAuth);
    onClose();
    swalToast(t.attributeRecalibrated || "Attribute Re-calibrated", "success");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/60 backdrop-blur-2xl"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-card/50 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="p-10 sm:p-14 space-y-10">
            <div className="space-y-3 text-center">
              <Badge variant="outline" className="text-[8px] font-black uppercase tracking-[0.4em] border-accent-secondary/30 text-accent-secondary bg-accent-secondary/5 mb-4">
                 {t.manifest || "Modification Protocol"}
              </Badge>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic text-gradient leading-none">
                {t.modifyAttribute || "Adjust Size"}
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 italic">
                {t.recalibrating || "Optimizing"} {item.product.name}
              </p>
            </div>

            {isLoading ? (
              <div className="h-48 flex items-center justify-center">
                <Loader size="small" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {productData?.sizes?.map((s) => {
                  const sId = s.size?._id || s.size;
                  const sName = s.size?.name || "Standard";
                  const isSelected = String(item.size._id || item.size) === String(sId);
                  
                  return (
                    <button
                      key={sId}
                      type="button"
                      disabled={s.stock <= 0}
                      onClick={() => handleSizeSelect(sId, sName)}
                      className={cn(
                        "group relative h-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-500 overflow-hidden",
                        isSelected
                          ? "border-accent-secondary bg-accent-secondary text-white shadow-lg shadow-accent-secondary/20" 
                          : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20",
                        s.stock <= 0 && "opacity-20 cursor-not-allowed grayscale"
                      )}
                    >
                      <span className="text-sm font-black uppercase tracking-widest italic">{sName}</span>
                      {isSelected && (
                        <div className="absolute top-1 right-1">
                          <Check size={10} className="text-white opacity-50" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="pt-6">
              <Button 
                onClick={onClose}
                variant="ghost" 
                className="w-full h-16 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/5 text-muted-foreground transition-all"
              >
                {t.abortModification || "Abort Protocol"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

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
    if (newQty < 1) handleRemove(productId, sizeId);
    else updateCartItem(productId, sizeId, newQty, isAuthenticated);
  };

  const handleRemove = async (productId, sizeId) => {
    const confirmed = await swalConfirm(
      t.purgeArtifact || "Purge Artifact?",
      t.removeDescription || "This item will be removed from your manifest.",
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
        swalToast(t.syncCode || "Voucher Synced", "success");
      }
    } catch (err) {
      swalError(t.protocolDenied || "Protocol Denied", t.voucherUnrecognized || "Voucher code not recognized.");
    }
  };

  const handlePlaceOrder = async () => {
    if (
      !shippingInfo.phone ||
      !shippingInfo.address ||
      !shippingInfo.name
    ) {
      return swalError(
        t.manifestIncomplete || "Manifest Incomplete",
        t.provideLogistics || "Please provide name, phone and address.",
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

  if (items.length === 0 && !authLoading) return <EmptyState t={t} />;

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
                  {items.length} {items.length === 1 ? t.unit : t.units}
                </Badge>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item, idx) => (
                    <motion.div
                      layout
                      key={`${item.product._id}-${item.size._id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ 
                        type: "spring", 
                        damping: 25, 
                        stiffness: 300,
                        layout: { duration: 0.4 }
                      }}
                    >
                      <Card className="group border-none glass-card overflow-hidden transition-all duration-500 rounded-2xl sm:rounded-[2rem]">
                        <CardContent className="p-4 sm:p-6 flex gap-4 sm:gap-8">
                          <div className="relative w-20 sm:w-28 aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden shrink-0 shadow-lg sm:shadow-xl">
                            <Image
                              src={getImageUrl(item.product.images?.[0], 300, 100)}
                              alt={item.product.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                <p className="text-[7px] sm:text-[8px] font-black text-accent-secondary uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                                  {item.product.category?.name || "Premium Drop"}
                                </p>
                                <h3 className="text-xs sm:text-lg md:text-xl font-black uppercase tracking-tighter italic text-gradient line-clamp-1">
                                  {item.product.name}
                                </h3>
                                <Badge variant="outline" className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest border-border/20 rounded-full px-2 sm:px-2.5 h-5">
                                  {t.size}: {item.size?.name || "Standard"}
                                </Badge>
                              </div>
                                <div className="flex items-center gap-1.5">
                                  {!isDirectBuy && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setEditModal({ isOpen: true, item });
                                      }}
                                      className="text-muted-foreground hover:text-accent-secondary transition-colors rounded-lg sm:rounded-xl h-8 w-8 sm:h-9 sm:w-9 hover:bg-accent-secondary/10 shrink-0"
                                    >
                                      <Edit2 size={14} className="sm:w-[15px] sm:h-[15px]" />
                                    </Button>
                                  )}
                                  {!isDirectBuy && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemove(item.product._id, item.size._id)}
                                      className="text-muted-foreground hover:text-destructive transition-colors rounded-lg sm:rounded-xl h-8 w-8 sm:h-9 sm:w-9 hover:bg-destructive/10 shrink-0"
                                    >
                                      <Trash2 size={16} className="sm:w-[17px] sm:h-[17px]" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4">
                              <div className="flex items-center gap-2 sm:gap-3 glass p-0.5 sm:p-1 rounded-lg sm:rounded-xl border-none shadow-inner">
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={isDirectBuy}
                                    onClick={() => handleQuantityChange(item.product._id, item.size._id, item.quantity, -1)}
                                    className="h-7 w-7 sm:h-9 sm:w-9 rounded-md sm:rounded-xl hover:bg-accent-secondary hover:text-white transition-all disabled:opacity-30"
                                 >
                                    <Minus size={12} className="sm:w-[13px] sm:h-[13px]" />
                                 </Button>
                                 <span className="font-black text-xs sm:text-sm w-4 sm:w-5 text-center tabular-nums">
                                   {item.quantity}
                                 </span>
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={isDirectBuy}
                                    onClick={() => handleQuantityChange(item.product._id, item.size._id, item.quantity, 1)}
                                    className="h-7 w-7 sm:h-9 sm:w-9 rounded-md sm:rounded-xl hover:bg-accent-secondary hover:text-white transition-all disabled:opacity-30"
                                 >
                                    <Plus size={12} className="sm:w-[13px] sm:h-[13px]" />
                                 </Button>
                              </div>
                              <p className="text-lg sm:text-2xl font-black tracking-tighter text-foreground">
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
            <section className="space-y-8 sm:space-y-12">
              <div className="space-y-1 border-b border-border/10 pb-4 sm:pb-6">
                <h2 className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-accent-secondary">
                  02. {t.destination}
                </h2>
                <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.deploymentLogistics}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                <LogisticsInput 
                  label={t.fullIdentity} 
                  value={shippingInfo.name} 
                  onChange={(v) => setShippingInfo({ ...shippingInfo, name: v })}
                  placeholder={t.namePlaceholder}
                  icon={<User size={16} />}
                />
                <LogisticsInput 
                  label={t.emailAddress} 
                  value={shippingInfo.email} 
                  onChange={(v) => setShippingInfo({ ...shippingInfo, email: v })}
                  placeholder={t.emailPlaceholder}
                  icon={<Mail size={16} />}
                />
                <LogisticsInput 
                  label={t.contactProtocol} 
                  value={shippingInfo.phone} 
                  onChange={(v) => setShippingInfo({ ...shippingInfo, phone: v })}
                  placeholder={t.phonePlaceholder}
                  icon={<Phone size={16} />}
                />

                <div className="space-y-2 sm:space-y-3">
                   <Label className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] ml-2 text-muted-foreground">{t.transitZone}</Label>
                   <RadioGroup 
                      value={deliveryZone} 
                      onValueChange={setDeliveryZone}
                      className="grid grid-cols-2 gap-3"
                   >
                     {["dhaka", "outside"].map((z) => (
                       <div key={z} className="relative">
                         <RadioGroupItem value={z} id={z} className="peer sr-only" />
                         <Label
                           htmlFor={z}
                           className="flex flex-col items-center justify-center h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-transparent bg-accent/20 peer-data-[state=checked]:border-accent-secondary peer-data-[state=checked]:bg-accent-secondary/10 peer-data-[state=checked]:text-accent-secondary cursor-pointer transition-all hover:bg-accent/40 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-center px-2"
                         >
                           {t[z]}
                         </Label>
                       </div>
                     ))}
                   </RadioGroup>
                </div>

                <div className="md:col-span-2 space-y-2 sm:space-y-3">
                  <Label className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] ml-2 text-muted-foreground">{t.deploymentBase || "Full Address"}</Label>
                  <Input
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    placeholder={t.addressPlaceholder || "Enter your full address"}
                    className="bg-accent/20 border-none h-14 sm:h-16 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-accent-secondary/50 shadow-inner"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 💳 RIGHT: Financial Summary */}
        <div className="lg:col-span-5 p-4 sm:p-12 lg:p-16 xl:p-20 bg-accent/5">
          <div className="sticky top-24 sm:top-32 space-y-8 sm:space-y-10">
            <div className="space-y-1">
              <h2 className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-accent-secondary">
                03. {t.summary}
              </h2>
              <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.finalAudit}</p>
            </div>

            <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden glass-card">
              <CardContent className="p-8 sm:p-12 space-y-6">
                <div className="space-y-4 sm:space-y-5">
                  <SummaryRow label={t.subtotal} value={`৳${subtotal.toFixed(0)}`} />
                  
                  {appliedCoupon && (
                    <SummaryRow 
                      label={`${t.voucher} (${appliedCoupon.coupon?.code})`} 
                      value={`- ৳${appliedCoupon.discountAmount.toFixed(0)}`} 
                      highlight
                    />
                  )}

                  <SummaryRow label={t.transitFee} value={`৳${shippingCharge}`} />
                </div>

                <Separator className="bg-border/20" />

                <div className="flex flex-col gap-1">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.4em] text-accent-secondary">
                    {t.totalInvestment}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter text-gradient leading-none">
                      ৳{finalTotal.toFixed(0)}
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">BDT</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voucher Area */}
            <div className="flex gap-2 p-1.5 glass rounded-2xl sm:rounded-[1.8rem] shadow-xl border-none">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 bg-transparent border-none px-4 sm:px-6 text-[10px] sm:text-[11px] font-black uppercase tracking-widest focus-visible:ring-0 placeholder:text-muted-foreground/30 h-12 sm:h-14"
                placeholder="PROMO CODE"
              />
              <Button
                onClick={handleApplyCoupon}
                className="bg-primary text-primary-foreground h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-accent-secondary transition-all"
              >
                {t.syncCode}
              </Button>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 sm:space-y-3">
               <Label className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] ml-2 text-muted-foreground">Settlement Protocol</Label>
               <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                  className="grid gap-2"
               >
                 {paymentOptions.ssl && (
                   <PaymentMethodItem 
                      id="ssl" 
                      title="Digital Settlement" 
                      icon={<CreditCard size={16} />} 
                      active={paymentMethod === "ssl"} 
                   />
                 )}
                 {paymentOptions.bkash && (
                   <PaymentMethodItem 
                      id="bkash" 
                      title="bKash Neural Wallet" 
                      icon={<Wallet size={16} />} 
                      active={paymentMethod === "bkash"} 
                   />
                 )}
                 {paymentOptions.cod && (
                   <PaymentMethodItem 
                      id="cod" 
                      title="Tactile Handover (COD)" 
                      icon={<Truck size={16} />} 
                      active={paymentMethod === "cod"} 
                   />
                 )}
               </RadioGroup>
            </div>

            {/* Authorize Button */}
            <Button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full h-16 sm:h-20 rounded-[1.5rem] sm:rounded-[2.5rem] bg-foreground text-background font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-xs shadow-2xl hover:bg-accent-secondary hover:text-white hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 group"
            >
              {isProcessing ? (
                <Loader size="small" />
              ) : (
                <>
                  <ShieldCheck size={18} className="mr-2 sm:mr-3 sm:w-5 sm:h-5 group-hover:animate-pulse" /> {t.authorizeOrder}
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 opacity-30 text-[7px] font-black uppercase tracking-[0.3em] italic pt-4">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              ENCRYPTED PROTOCOL / VANGUARD SECURITY
            </div>
          </div>
        </div>
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

function LogisticsInput({ label, value, onChange, placeholder, icon }) {
  return (
    <div className="space-y-2 sm:space-y-3">
      <Label className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] ml-2 text-muted-foreground">{label}</Label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/50">
          {icon}
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-accent/20 border-none h-14 sm:h-16 pl-12 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-accent-secondary/50 shadow-inner"
        />
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight }) {
  return (
    <div className={cn(
      "flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]",
      highlight ? "text-emerald-500" : "text-muted-foreground"
    )}>
      <span className="flex items-center gap-2">
        {highlight && <Ticket size={12} />} {label}
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
          "flex items-center gap-4 p-4 sm:p-5 rounded-xl sm:rounded-[1.8rem] border-2 cursor-pointer transition-all duration-500",
          active 
            ? "border-foreground bg-foreground/5 shadow-xl scale-[1.01]" 
            : "border-border/10 bg-transparent opacity-40 hover:opacity-100"
        )}
      >
        <div className={cn(
          "w-10 h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all",
          active ? "bg-foreground text-background" : "glass"
        )}>
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
        {active && (
          <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,1)]" />
        )}
      </Label>
    </div>
  );
}

function EmptyState({ t }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-background">
      <div className="w-32 h-32 glass rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl animate-in zoom-in duration-1000">
        <ShoppingBag size={40} className="text-muted-foreground/20" />
      </div>
      <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter italic text-gradient mb-10 leading-none">
        {t.emptyVault}
      </h2>
      <Button
        asChild
        className="h-14 px-12 rounded-full bg-foreground text-background font-black uppercase text-[10px] tracking-[0.3em] hover:bg-accent-secondary hover:text-white transition-all shadow-2xl"
      >
        <Link href="/products">
          {t.exploreDrops}
        </Link>
      </Button>
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
