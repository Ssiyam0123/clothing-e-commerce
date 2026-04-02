"use client";

import { useState, useEffect, Suspense, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { usePathao } from "@/hooks/usePathao";
import { useCoupons } from "@/hooks/useCoupons";
import { useSettings } from "@/hooks/useSettings";
import { getImageUrl } from "@/utils/imageUtils";
import { swalError, swalToast } from "@/utils/swal";
import { useAppStore } from "@/store/appStore";
import { useTrackingStore } from "@/store/trackingStore";
import { motion, AnimatePresence } from "framer-motion";
import { AddressFormSkeleton, CheckoutSummarySkeleton } from "@/components/common/Skeletons";

const DICTIONARY = {
  en: {
    title: "Settlement",
    destination: "Shipping Destination",
    saved: "Saved Locations",
    new: "New Address",
    name: "Full Name *",
    email: "Email Address *",
    street: "House / Road / Street *",
    city: "Select City *",
    zone: "Select Zone *",
    area: "Select Area *",
    phone: "Phone Number *",
    back: "Back to saved",
    method: "Settlement Method",
    ssl: "Card / Online Banking (SSLCommerz)",
    bkash: "bKash (Mobile Banking)",
    cod: "Cash on Delivery",
    codInfo: "Pay when your order arrives. No additional fees.",
    verification: "Verification",
    amount: "Final Amount",
    subtotal: "Subtotal",
    authorize: "Authorize Payment",
    processing: "Processing...",
    incomplete: "Validation Error",
    incompleteMsg: "Identity and Destination details are mandatory.",
    promoLabel: "Voucher Logic",
    promoPlaceholder: "ENTER CODE",
    promoApply: "Sync",
    promoValid: "✓ Sequence Accepted",
    discount: "Voucher Credit",
    shipping: "Transit Fee",
    shippingNote: "Calculated based on zone",
  },
  bn: {
    title: "পেমেন্ট সেটেলমেন্ট",
    destination: "শিপিং ঠিকানা",
    saved: "সংরক্ষিত ঠিকানা",
    new: "নতুন ঠিকানা",
    name: "পুরো নাম *",
    email: "ইমেইল অ্যাড্রেস *",
    street: "বাসা / রোড / গ্রাম *",
    city: "শহর নির্বাচন করুন *",
    zone: "জোন নির্বাচন করুন *",
    area: "এলাকা নির্বাচন করুন *",
    phone: "ফোন নম্বর *",
    back: "তালিকায় ফিরুন",
    method: "পেমেন্ট পদ্ধতি",
    ssl: "কার্ড / অনলাইন ব্যাংকিং (SSLCommerz)",
    bkash: "বিকাশ (মোবাইল ব্যাংকিং)",
    cod: "হাতে নগদ",
    codInfo: "অর্ডার পাওয়ার সময় টাকা প্রদান করুন। অতিরিক্ত চার্জ নেই।",
    verification: "যাচাইকরণ",
    amount: "সর্বমোট প্রদেয়",
    subtotal: "উপ-মোট",
    authorize: "পেমেন্ট সম্পন্ন করুন",
    processing: "প্রসেসিং হচ্ছে...",
    incomplete: "ভুল তথ্য",
    incompleteMsg: "দয়া করে নাম, ইমেইল, ফোন এবং পূর্ণ ঠিকানা প্রদান করুন।",
    promoLabel: "ভাউচার কোড",
    promoPlaceholder: "কোডটি লিখুন",
    promoApply: "প্রয়োগ",
    promoValid: "✓ ভাউচার কাজ করেছে",
    discount: "ভাউচার ডিসকাউন্ট",
    shipping: "ডেলিভারি চার্জ",
    shippingNote: "এলাকা অনুযায়ী নির্ধারিত",
  },
};

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDirectBuy = searchParams.get("type") === "direct";

  const { user, isLoading: authLoading } = useAuth();
  const { cart, isLoading: cartLoading } = useCart();
  const { initOrder } = useOrders();
  const { validateCoupon } = useCoupons();
  const { settings, isLoading: settingsLoading } = useSettings();
  const { lang, isMounted } = useAppStore();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY['en'], [lang]);
  const trackPurchase = useTrackingStore((state) => state.trackPurchase);

  const [selectedAddressIdx, setSelectedAddressIdx] = useState(0);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [directItem, setDirectItem] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('ssl');

  const [newAddress, setNewAddress] = useState({
    name: "", email: "", street: "",
    city_id: "", city_name: "",
    zone_id: "", zone_name: "",
    area_id: "", area_name: "",
    phone: "",
  });

  // Pathao Integration
  const { cities, zones, areas, citiesLoading, zonesLoading, areasLoading } = usePathao(
    newAddress.city_id,
    newAddress.zone_id
  );

  // Determine which payment methods are enabled
  const paymentOptions = useMemo(() => ({
    ssl: settings?.paymentOptions?.online ?? true,
    bkash: settings?.paymentOptions?.bkash ?? true,
    cod: settings?.paymentOptions?.cod ?? true,
  }), [settings]);

  // Auto-select first available payment method when options change
  useEffect(() => {
    if (!settingsLoading) {
      if (paymentOptions.ssl) {
        setPaymentMethod('ssl');
      } else if (paymentOptions.bkash) {
        setPaymentMethod('bkash');
      } else if (paymentOptions.cod) {
        setPaymentMethod('cod');
      }
    }
  }, [paymentOptions, settingsLoading]);

  useEffect(() => {
    if (isDirectBuy) {
      const stored = sessionStorage.getItem("buyNowItem");
      if (stored) setDirectItem(JSON.parse(stored));
    }
  }, [isDirectBuy]);

  useEffect(() => {
    if (user) {
      setNewAddress(prev => ({ ...prev, name: user.name, email: user.email, phone: user.phone || "" }));
      if (!user.addresses?.length) setShowNewAddress(true);
    }
  }, [user]);

  const checkoutItems = useMemo(() => (isDirectBuy && directItem ? [directItem] : cart?.items || []), [isDirectBuy, directItem, cart]);

  const subtotal = useMemo(() => checkoutItems.reduce((sum, item) => {
    const price = item.product.discount > 0
      ? item.product.price - (item.product.price * item.product.discount / 100)
      : item.product.price;
    return sum + price * (item.quantity || 1);
  }, 0), [checkoutItems]);

  const activeShippingAddr = useMemo(() => {
    if (showNewAddress || !user?.addresses?.length) return newAddress;
    const saved = user.addresses[selectedAddressIdx];
    return {
      name: user.name,
      email: user.email,
      phone: saved.phone || user.phone,
      street: saved.street,
      city_id: saved.pathao_city_id,
      city_name: saved.city,
      zone_id: saved.pathao_zone_id,
      area_id: saved.pathao_area_id,
    };
  }, [showNewAddress, user, selectedAddressIdx, newAddress]);

  const shippingPrice = useMemo(() => {
    if (!activeShippingAddr?.city_id) return 0;
    return Number(activeShippingAddr.city_id) === 1 ? 60 : 120;
  }, [activeShippingAddr]);

  const total = subtotal - (appliedCoupon?.discountAmount || 0) + shippingPrice;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const data = await validateCoupon({ code: couponCode, cartTotal: subtotal });
      if (data.valid) {
        setAppliedCoupon(data);
        swalToast(ui.promoValid, "success");
      }
    } catch (err) {
      swalError("Rejected", "Invalid Voucher Code.");
    }
  };

  const handlePlaceOrder = async () => {
    const addr = activeShippingAddr;
    if (!addr.name || !addr.phone || !addr.street || !addr.city_id || !addr.zone_id || !addr.area_id) {
      return swalError(ui.incomplete, ui.incompleteMsg);
    }

    setIsProcessing(true);
    try {
      const result = await initOrder.mutateAsync({
        orderItems: checkoutItems.map(i => ({
          product: i.product._id,
          size: i.size?._id || i.size,
          quantity: i.quantity
        })),
        shippingAddress: {
          name: addr.name,
          email: addr.email,
          phone: addr.phone,
          street: addr.street,
          city: addr.city_name || addr.city,
          pathao_city_id: String(addr.city_id),
          pathao_zone_id: String(addr.zone_id),
          pathao_area_id: String(addr.area_id),
        },
        couponCode: appliedCoupon?.coupon?.code,
        totalPrice: total,
        isDirectBuy,
        paymentMethod,
      });

      if (paymentMethod === 'cod') {
        const productIds = checkoutItems.map(i => i.product._id);
        trackPurchase(result.orderId, total, productIds);
        swalToast(result.message || "Order placed successfully!", "success");
        router.push('/profile?tab=orders');
      } else if (result.url) {
        window.location.replace(result.url);
      } else {
        swalError("Payment Error", "Could not initiate payment. Please try again.");
      }
    } catch (err) {
      swalError("Error", err.response?.data?.message || "Checkout failed.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] py-12 lg:py-24 relative transition-colors duration-700">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <h1 className={`text-5xl md:text-8xl font-black tracking-tighter uppercase mb-20 text-zinc-900 dark:text-white ${lang === 'bn' ? 'font-sans' : ''}`}>
          {ui.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-start">

          {/* LEFT: Address Section */}
          <div className="lg:col-span-7 space-y-16">
            <section>
              <h2 className="text-xl font-black uppercase tracking-[0.2em] mb-10 border-b border-zinc-100 dark:border-white/5 pb-4 text-zinc-900 dark:text-zinc-100">
                {ui.destination}
              </h2>

              {authLoading ? (
                <AddressFormSkeleton />
              ) : (
                <AnimatePresence mode="wait">
                  {user?.addresses?.length > 0 && !showNewAddress ? (
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-4">
                      {user.addresses.map((addr, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedAddressIdx(i)}
                          className={`w-full text-left p-8 rounded-[2rem] border-2 transition-all ${
                            selectedAddressIdx === i
                              ? 'border-zinc-900 dark:border-white bg-white dark:bg-zinc-900 shadow-xl'
                              : 'border-zinc-100 dark:border-white/5 opacity-60'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold uppercase text-lg text-zinc-900 dark:text-white">
                                {addr.street}
                              </p>
                              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                                {addr.city}, {addr.zone_name || ''}
                              </p>
                            </div>
                            {selectedAddressIdx === i && (
                              <span className="text-indigo-500 text-xl font-bold">✓</span>
                            )}
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={() => setShowNewAddress(true)}
                        className="text-[10px] font-black uppercase text-indigo-500 hover:tracking-widest transition-all mt-4"
                      >
                        + {ui.new}
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-zinc-400 ml-1">{ui.name}</label>
                          <input
                            type="text"
                            value={newAddress.name}
                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                            className="w-full bg-transparent border-b-2 border-zinc-200 dark:border-white/10 py-4 focus:border-zinc-900 dark:focus:border-white outline-none uppercase text-xs font-black text-zinc-900 dark:text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-zinc-400 ml-1">{ui.email}</label>
                          <input
                            type="email"
                            value={newAddress.email}
                            onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
                            className="w-full bg-transparent border-b-2 border-zinc-200 dark:border-white/10 py-4 focus:border-zinc-900 dark:focus:border-white outline-none uppercase text-xs font-black text-zinc-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-zinc-400 ml-1">{ui.street}</label>
                        <input
                          type="text"
                          placeholder="House/Road/Area detail..."
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                          className="w-full bg-transparent border-b-2 border-zinc-200 dark:border-white/10 py-4 focus:border-zinc-900 dark:focus:border-white outline-none uppercase text-xs font-black text-zinc-900 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-zinc-400 ml-1">{ui.city}</label>
                          <select
                            onChange={(e) => {
                              const c = cities.find(city => city.city_id == e.target.value);
                              setNewAddress({
                                ...newAddress,
                                city_id: e.target.value,
                                city_name: c?.city_name,
                                zone_id: "",
                                zone_name: "",
                                area_id: "",
                                area_name: "",
                              });
                            }}
                            value={newAddress.city_id}
                            className="w-full bg-transparent border-b-2 border-zinc-200 dark:border-white/10 py-4 outline-none uppercase text-[10px] font-black text-zinc-900 dark:text-white appearance-none cursor-pointer"
                          >
                            <option value="" className="dark:bg-black">
                              {citiesLoading ? 'Loading...' : 'Select City'}
                            </option>
                            {cities?.map(c => (
                              <option key={c.city_id} value={c.city_id} className="dark:bg-black">
                                {c.city_name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-zinc-400 ml-1">{ui.zone}</label>
                          <select
                            disabled={!newAddress.city_id}
                            onChange={(e) => {
                              const z = zones.find(zone => zone.zone_id == e.target.value);
                              setNewAddress({
                                ...newAddress,
                                zone_id: e.target.value,
                                zone_name: z?.zone_name,
                                area_id: "",
                                area_name: "",
                              });
                            }}
                            value={newAddress.zone_id}
                            className="w-full bg-transparent border-b-2 border-zinc-200 dark:border-white/10 py-4 outline-none uppercase text-[10px] font-black text-zinc-900 dark:text-white appearance-none cursor-pointer disabled:opacity-30"
                          >
                            <option value="" className="dark:bg-black">
                              {zonesLoading ? '...' : 'Select Zone'}
                            </option>
                            {zones?.map(z => (
                              <option key={z.zone_id} value={z.zone_id} className="dark:bg-black">
                                {z.zone_name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-zinc-400 ml-1">{ui.area}</label>
                          <select
                            disabled={!newAddress.zone_id}
                            onChange={(e) => {
                              const a = areas.find(area => area.area_id == e.target.value);
                              setNewAddress({
                                ...newAddress,
                                area_id: e.target.value,
                                area_name: a?.area_name,
                              });
                            }}
                            value={newAddress.area_id}
                            className="w-full bg-transparent border-b-2 border-zinc-200 dark:border-white/10 py-4 outline-none uppercase text-[10px] font-black text-zinc-900 dark:text-white appearance-none cursor-pointer disabled:opacity-30"
                          >
                            <option value="" className="dark:bg-black">
                              {areasLoading ? '...' : 'Select Area'}
                            </option>
                            {areas?.map(a => (
                              <option key={a.area_id} value={a.area_id} className="dark:bg-black">
                                {a.area_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-zinc-400 ml-1">{ui.phone}</label>
                        <input
                          type="text"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="w-full bg-transparent border-b-2 border-zinc-200 dark:border-white/10 py-4 outline-none uppercase text-xs font-black text-zinc-900 dark:text-white"
                        />
                      </div>

                      {user?.addresses?.length > 0 && (
                        <button
                          onClick={() => setShowNewAddress(false)}
                          className="text-[10px] font-black uppercase text-zinc-500 mt-4 transition-colors hover:text-black dark:hover:text-white"
                        >
                          ← {ui.back}
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </section>

            {/* Payment Method Section */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-[0.2em] mb-10 border-b border-zinc-100 dark:border-white/5 pb-4 text-zinc-900 dark:text-zinc-100">
                {ui.method}
              </h2>
              <div className="space-y-6">
                {paymentOptions.ssl && (
                  <div
                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${
                      paymentMethod === 'ssl'
                        ? 'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-900/50 shadow-md'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                    }`}
                    onClick={() => setPaymentMethod('ssl')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">💳</span>
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                            {ui.ssl}
                          </p>
                          <p className="text-[9px] text-zinc-500 mt-1">Visa, Mastercard, Amex, Internet Banking</p>
                        </div>
                      </div>
                      {paymentMethod === 'ssl' && (
                        <div className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-white border-2 border-zinc-100 dark:border-zinc-800" />
                      )}
                    </div>
                  </div>
                )}

                {paymentOptions.bkash && (
                  <div
                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${
                      paymentMethod === 'bkash'
                        ? 'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-900/50 shadow-md'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                    }`}
                    onClick={() => setPaymentMethod('bkash')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">📱</span>
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                            {ui.bkash}
                          </p>
                          <p className="text-[9px] text-zinc-500 mt-1">Pay using bKash Mobile Banking</p>
                        </div>
                      </div>
                      {paymentMethod === 'bkash' && (
                        <div className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-white border-2 border-zinc-100 dark:border-zinc-800" />
                      )}
                    </div>
                  </div>
                )}

                {paymentOptions.cod && (
                  <div
                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-900/50 shadow-md'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                    }`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">💵</span>
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                            {ui.cod}
                          </p>
                          <p className="text-[9px] text-zinc-500 mt-1">{ui.codInfo}</p>
                        </div>
                      </div>
                      {paymentMethod === 'cod' && (
                        <div className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-white border-2 border-zinc-100 dark:border-zinc-800" />
                      )}
                    </div>
                  </div>
                )}

                {!paymentOptions.ssl && !paymentOptions.bkash && !paymentOptions.cod && (
                  <div className="p-6 text-center text-red-500">
                    No payment methods are currently enabled. Please contact support.
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5 relative w-full">
            <div className="lg:sticky lg:top-24">
              {cartLoading && !isDirectBuy ? (
                <CheckoutSummarySkeleton />
              ) : (
                <div className="p-10 rounded-[3rem] bg-zinc-900 dark:bg-[#0a0a0a] border border-transparent dark:border-white/5 text-white shadow-2xl overflow-hidden">
                  <h2 className="text-2xl font-black uppercase mb-10 tracking-widest border-b border-white/5 pb-6">
                    {ui.verification}
                  </h2>

                  <div className="max-h-64 overflow-y-auto no-scrollbar mb-10 space-y-8">
                    {checkoutItems.map((item, i) => (
                      <div key={i} className="flex gap-6 border-b border-white/5 pb-8 last:border-0">
                        <div className="w-16 h-20 bg-zinc-800 rounded-xl overflow-hidden shrink-0">
                          <img
                            src={getImageUrl(item.product.images?.[0])}
                            className="w-full h-full object-cover grayscale"
                            alt=""
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black uppercase truncate text-zinc-100">
                            {item.product.name}
                          </p>
                          <p className="text-[9px] text-zinc-500 font-bold mt-2 uppercase tracking-widest">
                            {item.size?.name || ''} x {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-black tracking-tighter">
                          ৳{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mb-12 bg-black/40 border border-white/5 p-6 rounded-[1.5rem] shadow-inner">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-4">
                      {ui.promoLabel}
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder={ui.promoPlaceholder}
                        disabled={!!appliedCoupon}
                        className="flex-1 bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black text-zinc-100 outline-none focus:border-white disabled:opacity-50 tracking-widest"
                      />
                      <button
                        onClick={appliedCoupon ? () => setAppliedCoupon(null) : handleApplyCoupon}
                        className={`px-6 py-3 rounded-xl font-black text-[9px] uppercase transition-all shadow-lg ${
                          appliedCoupon
                            ? 'bg-rose-500 text-white'
                            : 'bg-white text-black hover:bg-zinc-200'
                        }`}
                      >
                        {appliedCoupon ? "✕" : ui.promoApply}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-5 mb-10">
                    <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      <span>{ui.subtotal}</span>
                      <span>৳{subtotal.toFixed(2)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                        <span>{ui.discount}</span>
                        <span>- ৳{appliedCoupon.discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      <span>{ui.shipping}</span>
                      <span>৳{shippingPrice}</span>
                    </div>
                    <div className="h-px bg-white/5 my-6" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em]">
                        {ui.amount}
                      </span>
                      <span className="text-4xl font-black tracking-tighter">
                        ৳{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full bg-white text-black py-6 rounded-full font-black uppercase text-[11px] tracking-[0.25em] shadow-2xl disabled:opacity-50 transition-all active:scale-95"
                  >
                    {isProcessing ? ui.processing : ui.authorize}
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]"><div className="animate-pulse text-zinc-800 font-black text-4xl italic">VANGUARD</div></div>}>
      <CheckoutContent />
    </Suspense>
  );
}