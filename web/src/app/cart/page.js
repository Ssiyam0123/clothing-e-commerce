'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, X, Plus, Minus, ShieldCheck, MapPin, 
  CreditCard, Wallet, Truck, CheckCircle2, Trash2,
  ChevronDown, Phone, NotepadText
} from 'lucide-react';

// Stores & Hooks
import { useAuthStore } from '@/store/authStore';
import { useOrders } from '@/hooks/useOrders';
import { usePathao } from '@/hooks/usePathao';
import { useCoupons } from '@/hooks/useCoupons';
import { useSettings } from '@/hooks/useSettings';
import { useAppStore } from '@/store/appStore';
import { useProductCondition } from '@/store/productCondition';
import { useTrackingStore } from '@/store/trackingStore';
import { getImageUrl } from '@/utils/imageUtils';
import { swalError, swalToast, swalConfirm } from '@/utils/swal';
import Loader from '@/components/common/Loader';

const DICTIONARY = {
  en: {
    title: 'Settlement Vault', manifest: 'Manifest', destination: 'Destination',
    payment: 'Settlement', subtotal: 'Subtotal', transit: 'Transit Fee',
    total: 'Final Amount', promo: 'Voucher', apply: 'Sync',
    confirm: 'Authorize Order', processing: 'Synchronizing...',
    note: 'Note', dhaka: 'Dhaka Metropolitan', outside: 'Outside Dhaka',
    empty: 'Bag is Empty', browse: 'Explore Drops'
  },
  bn: {
    title: 'অর্ডার সেটেলমেন্ট', manifest: 'পণ্যের তালিকা', destination: 'ঠিকানা',
    payment: 'পেমেন্ট পদ্ধতি', subtotal: 'উপ-মোট', transit: 'ডেলিভারি চার্জ',
    total: 'সর্বমোট', promo: 'কুপন', apply: 'প্রয়োগ',
    confirm: 'অর্ডার নিশ্চিত করুন', processing: 'প্রসেসিং হচ্ছে...',
    note: 'নোট', dhaka: 'ঢাকার ভেতরে', outside: 'ঢাকার বাইরে',
    empty: 'আপনার ব্যাগটি খালি', browse: 'কালেকশন দেখুন'
  }
};

function UnifiedSettlementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDirectBuy = searchParams.get("type") === "direct";

  // 🛰️ Stores
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { lang } = useAppStore();
  const { cart, buyNowItem, updateCartItem, removeFromCart, clearCart } = useProductCondition();
  const { settings, isLoading: settingsLoading } = useSettings();
  const { initOrder } = useOrders();
  const { validateCoupon } = useCoupons();
  const trackPurchase = useTrackingStore((state) => state.trackPurchase);

  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY['en'], [lang]);

  // Local UI States
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('ssl');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [deliveryZone, setDeliveryZone] = useState('dhaka');
  const [orderNote, setOrderNote] = useState('');
  const [shippingInfo, setShippingInfo] = useState({ name: '', street: '', phone: '' });

  // Sync initial info from user store
  useEffect(() => {
    if (user) {
      setShippingInfo({ 
        name: user.name, 
        phone: user.phone || "", 
        street: user.addresses?.[0]?.street || "" 
      });
    }
  }, [user]);

  // Determine which payment methods are enabled by admin
  const paymentOptions = useMemo(() => ({
    ssl: settings?.paymentOptions?.online ?? true,
    bkash: settings?.paymentOptions?.bkash ?? true,
    cod: settings?.paymentOptions?.cod ?? true,
  }), [settings]);

  // Auto-select first available payment method when options change
  useEffect(() => {
    if (!settingsLoading && paymentOptions) {
      if (paymentOptions.ssl) setPaymentMethod('ssl');
      else if (paymentOptions.bkash) setPaymentMethod('bkash');
      else if (paymentOptions.cod) setPaymentMethod('cod');
    }
  }, [paymentOptions, settingsLoading]);

  // Items & Totals
  const items = useMemo(() => isDirectBuy && buyNowItem ? [buyNowItem] : cart.items, [isDirectBuy, buyNowItem, cart.items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + (i.discountedPrice * i.quantity), 0), [items]);
  const shippingCharge = useMemo(() => deliveryZone === 'dhaka' ? 60 : 120, [deliveryZone]);
  const finalTotal = subtotal - (appliedCoupon?.discountAmount || 0) + shippingCharge;

  // ✅ Quantity handler (fix: use correct arguments)
  const handleQuantityChange = (productId, sizeId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) {
      handleRemove(productId, sizeId);
    } else {
      updateCartItem(productId, sizeId, newQty, isAuthenticated);
    }
  };

  // ✅ Remove handler
  const handleRemove = async (productId, sizeId) => {
    const confirmed = await swalConfirm("Remove from Bag?", "This artifact will be removed.");
    if (confirmed) removeFromCart(productId, sizeId, isAuthenticated);
  };

  // ✅ Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const data = await validateCoupon({ code: couponCode, cartTotal: subtotal });
      if (data.valid) { 
        setAppliedCoupon(data); 
        swalToast("Voucher Synced", "success"); 
      }
    } catch (err) { 
      swalError("Invalid", "Voucher code not recognised."); 
    }
  };

  // ✅ Place order
  const handlePlaceOrder = async () => {
    if (!shippingInfo.phone || !shippingInfo.street || !shippingInfo.name) {
      return swalError("Missing Info", "Please fill all shipping details.");
    }

    setIsProcessing(true);
    try {
      const result = await initOrder.mutateAsync({
        orderItems: items.map(i => ({ 
          product: i.product._id, 
          size: i.size?._id || i.size, 
          quantity: i.quantity 
        })),
        shippingAddress: {
          name: shippingInfo.name,
          email: user?.email || "guest@vanguard.com",
          phone: shippingInfo.phone,
          street: shippingInfo.street,
          city: deliveryZone === 'dhaka' ? 'Dhaka' : 'Outside Dhaka',
          pathao_city_id: deliveryZone === 'dhaka' ? '1' : '2',
          pathao_zone_id: "1",
          pathao_area_id: "1",
        },
        paymentMethod,
        couponCode: appliedCoupon?.coupon?.code,
        totalPrice: finalTotal,
        note: orderNote,
        isDirectBuy
      });

      if (paymentMethod === 'cod') {
        trackPurchase(result.orderId, finalTotal, items.map(i => i.product._id));
        clearCart();
        router.push('/profile?tab=orders');
      } else if (result.url) {
        if (!isDirectBuy) clearCart();
        window.location.replace(result.url);
      }
    } catch (err) {
      swalError("Order Failed", err.response?.data?.message || "Check your details and try again.");
      setIsProcessing(false);
    }
  };

  if ((!items.length && !authLoading) || (items.length === 0 && !isDirectBuy)) {
    return <EmptyState ui={ui} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* LEFT: Manifest & Destination */}
        <div className="lg:col-span-7 p-6 sm:p-12 lg:p-20 bg-white dark:bg-[#080808] border-r dark:border-zinc-900">
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic mb-16 dark:text-white">
            {ui.title}
          </h1>

          <div className="space-y-20">
            {/* 01. Item Manifest */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-10 border-b dark:border-zinc-800 pb-4">
                01. {ui.manifest}
              </h2>
              <div className="space-y-8">
                {items.map((item) => {
                  const productId = item.product._id;
                  const sizeId = item.size?._id || item.size;
                  return (
                    <div key={`${productId}-${sizeId}`} className="flex gap-6 sm:gap-10 border-b dark:border-zinc-900 pb-8 group">
                      <div className="w-24 sm:w-36 aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded-[1.5rem] overflow-hidden shrink-0">
                        <img src={getImageUrl(item.product.images?.[0])} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" alt="" />
                      </div>
                      <div className="flex-1 py-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-black uppercase tracking-tight dark:text-white leading-tight">{item.product.name}</h3>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase mt-2">Size: {item.size?.name || 'N/A'}</p>
                          </div>
                          {!isDirectBuy && (
                            <button 
                              onClick={() => handleRemove(productId, sizeId)} 
                              className="text-zinc-300 hover:text-rose-500 transition-colors p-2"
                            >
                              <Trash2 size={18}/>
                            </button>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-8">
                          {!isDirectBuy ? (
                            <div className="flex items-center gap-4 bg-zinc-50 dark:bg-white/5 p-1 rounded-full border dark:border-white/10">
                              <button 
                                onClick={() => handleQuantityChange(productId, sizeId, item.quantity, -1)} 
                                className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                              >
                                <Minus size={12}/>
                              </button>
                              <span className="font-black text-sm w-4 text-center dark:text-white">{item.quantity}</span>
                              <button 
                                onClick={() => handleQuantityChange(productId, sizeId, item.quantity, 1)} 
                                className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all"
                              >
                                <Plus size={12}/>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-black uppercase text-zinc-400">Qty: {item.quantity}</span>
                          )}
                          <p className="text-2xl font-black dark:text-white tracking-tighter">
                            ৳{(item.discountedPrice * item.quantity).toFixed(0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 02. Destination */}
            <section className="space-y-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 border-b dark:border-zinc-800 pb-4">
                02. {ui.destination}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField 
                  label="Full Name *" 
                  value={shippingInfo.name} 
                  onChange={v => setShippingInfo({...shippingInfo, name: v})} 
                  placeholder="FULL NAME" 
                />
                <InputField 
                  label="Phone Number *" 
                  value={shippingInfo.phone} 
                  onChange={v => setShippingInfo({...shippingInfo, phone: v})} 
                  placeholder="+880 1XXXXXXXXX" 
                />
              </div>
              <InputField 
                label="Street / Area *" 
                value={shippingInfo.street} 
                onChange={v => setShippingInfo({...shippingInfo, street: v})} 
                placeholder="HOUSE, ROAD, AREA DETAILS" 
              />
              
              <div className="flex gap-4">
                {['dhaka', 'outside'].map(z => (
                  <button 
                    key={z} 
                    onClick={() => setDeliveryZone(z)} 
                    className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase border-2 transition-all ${
                      deliveryZone === z 
                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-xl' 
                        : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-400 border-transparent hover:border-zinc-200'
                    }`}
                  >
                    {ui[z]}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* RIGHT: Ledger & Payment */}
        <div className="lg:col-span-5 bg-zinc-50 dark:bg-[#0a0a0a] p-6 sm:p-12 lg:p-24 border-l dark:border-zinc-900">
          <div className="sticky top-32 space-y-12 max-w-md mx-auto">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">
              03. {ui.payment}
            </h2>
            
            <div className="space-y-6">
              <LedgerRow label={ui.subtotal} value={subtotal} />
              {appliedCoupon && (
                <LedgerRow label={ui.promo} value={`- ${appliedCoupon.discountAmount}`} highlight />
              )}
              <LedgerRow label={ui.transit} value={shippingCharge} />
              <div className="pt-8 border-t dark:border-zinc-800 flex justify-between items-end">
                <span className="text-xs font-black uppercase text-zinc-400">{ui.total}</span>
                <span className="text-6xl font-black tracking-tighter dark:text-white leading-none">৳{finalTotal}</span>
              </div>
            </div>

            {/* Coupon Input */}
            <div className="flex gap-2 bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border dark:border-white/5">
              <input 
                value={couponCode} 
                onChange={e => setCouponCode(e.target.value.toUpperCase())} 
                className="flex-1 bg-transparent px-4 text-[10px] font-black uppercase outline-none dark:text-white" 
                placeholder="ENTER CODE" 
              />
              <button 
                onClick={handleApplyCoupon} 
                className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase transition-all"
              >
                {ui.apply}
              </button>
            </div>

            {/* Payment Methods (only enabled by admin) */}
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{ui.payment}</p>
              <div className="grid gap-3">
                {paymentOptions.ssl && (
                  <MethodBtn 
                    active={paymentMethod === 'ssl'} 
                    onClick={() => setPaymentMethod('ssl')} 
                    icon={<CreditCard size={18}/>} 
                    title="Card / Online Banking" 
                  />
                )}
                {paymentOptions.bkash && (
                  <MethodBtn 
                    active={paymentMethod === 'bkash'} 
                    onClick={() => setPaymentMethod('bkash')} 
                    icon={<Wallet size={18}/>} 
                    title="bKash (Mobile Banking)" 
                  />
                )}
                {paymentOptions.cod && (
                  <MethodBtn 
                    active={paymentMethod === 'cod'} 
                    onClick={() => setPaymentMethod('cod')} 
                    icon={<Truck size={18}/>} 
                    title="Cash on Delivery" 
                  />
                )}
              </div>
            </div>

            {/* Order Note (optional) */}
            <div className="flex items-center gap-3 bg-white dark:bg-zinc-900/50 p-4 rounded-2xl border dark:border-white/5">
              <NotepadText size={16} className="text-zinc-400" />
              <input 
                type="text" 
                value={orderNote} 
                onChange={e => setOrderNote(e.target.value)} 
                className="flex-1 bg-transparent text-[9px] font-bold uppercase outline-none dark:text-white placeholder:text-zinc-500" 
                placeholder="Order note (optional)" 
              />
            </div>

            {/* Confirm Button */}
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              onClick={handlePlaceOrder} 
              disabled={isProcessing}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-7 rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl transition-all hover:bg-rose-600 hover:text-white disabled:opacity-50"
            >
              {isProcessing ? ui.processing : ui.confirm}
            </motion.button>

            {/* Security Badge */}
            <div className="flex items-center gap-4 p-5 bg-white dark:bg-zinc-900/50 rounded-2xl border border-dashed dark:border-zinc-800">
              <ShieldCheck className="text-emerald-500" size={20} />
              <p className="text-[8px] font-bold text-zinc-500 uppercase leading-relaxed tracking-widest">
                Transaction secured via Vanguard 256-bit AES protocol.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function InputField({ label, value, onChange, placeholder, disabled }) {
  return (
    <div className="space-y-3 w-full">
      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">{label}</label>
      <input 
        disabled={disabled} 
        value={value} 
        onChange={e => onChange?.(e.target.value)} 
        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border dark:border-white/10 p-5 rounded-2xl outline-none focus:border-black dark:focus:border-white transition-all text-xs font-bold uppercase dark:text-white" 
        placeholder={placeholder} 
      />
    </div>
  );
}

function LedgerRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
      <span className="text-zinc-500">{label}</span>
      <span className={highlight ? "text-emerald-500" : "dark:text-white"}>৳{value}</span>
    </div>
  );
}

function MethodBtn({ active, onClick, icon, title }) {
  return (
    <button 
      onClick={onClick} 
      className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
        active 
          ? 'border-black dark:border-white bg-white dark:bg-white/5 shadow-lg' 
          : 'border-zinc-100 dark:border-zinc-900 opacity-50 hover:opacity-100'
      }`}
    >
      <div className={`p-2 rounded-lg ${active ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">{title}</span>
      {active && <CheckCircle2 size={16} className="ml-auto text-emerald-500" />}
    </button>
  );
}

function EmptyState({ ui }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-[#050505]">
      <ShoppingBag size={100} className="text-zinc-100 dark:text-zinc-900 mb-8" />
      <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 dark:text-white">{ui.empty}</h2>
      <Link href="/products" className="bg-black dark:bg-white text-white dark:text-black px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl">
        {ui.browse}
      </Link>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white dark:bg-[#050505]"><Loader /></div>}>
      <UnifiedSettlementContent />
    </Suspense>
  );
}