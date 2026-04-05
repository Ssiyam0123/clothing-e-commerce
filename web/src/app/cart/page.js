'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, X, Plus, Minus, ShieldCheck, MapPin, 
  CreditCard, Wallet, Truck, Trash2, Phone, Mail,
  ArrowLeft
} from 'lucide-react';

// Stores & Hooks
import { useAuthStore } from '@/store/authStore';
import { useOrders } from '@/hooks/useOrders';
import { useCoupons } from '@/hooks/useCoupons';
import { useSettings } from '@/hooks/useSettings';
import { useAppStore } from '@/store/appStore';
import { useTrackingStore } from '@/store/trackingStore';
import { getImageUrl } from '@/utils/imageUtils';
import { swalError, swalToast, swalConfirm } from '@/utils/swal';
import Loader from '@/components/common/Loader';
import { useProductCondition } from '@/store/productStore';

const DICTIONARY = {
  en: {
    title: 'Settlement Vault', manifest: 'Artifact Manifest', destination: 'Logistics Info',
    payment: 'Settlement Method', subtotal: 'Subtotal', transit: 'Transit Fee',
    total: 'Final Investment', promo: 'Voucher', apply: 'Sync Code',
    confirm: 'Authorize Order', processing: 'Synchronizing...',
    dhaka: 'Dhaka (Metropolitan)', outside: 'Nationwide (Outside)',
    empty: 'The Vault is Empty', browse: 'Explore Drops'
  },
  bn: {
    title: 'অর্ডার সেটেলমেন্ট', manifest: 'পণ্যের তালিকা', destination: 'শিপিং তথ্য',
    payment: 'পেমেন্ট পদ্ধতি', subtotal: 'উপ-মোট', transit: 'ডেলিভারি ফি',
    total: 'সর্বমোট বিনিয়োগ', promo: 'ভাউচার', apply: 'কোড দিন',
    confirm: 'অর্ডার কনফার্ম করুন', processing: 'প্রসেসিং হচ্ছে...',
    dhaka: 'ঢাকার ভেতরে', outside: 'ঢাকার বাইরে',
    empty: 'ভল্ট খালি আছে', browse: 'কালেকশন দেখুন'
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
  
  // 📧 Email added to shipping info
  const [shippingInfo, setShippingInfo] = useState({ 
    name: '', 
    email: '', 
    street: '', 
    phone: '' 
  });

  // 🛒 Items Memo
  const items = useMemo(() => {
    if (isDirectBuy && buyNowItem) return [buyNowItem];
    return cart?.itemsMap ? Object.values(cart.itemsMap) : [];
  }, [isDirectBuy, buyNowItem, cart?.itemsMap]);

  // 🧮 Subtotal logic
  const subtotal = useMemo(() => {
    if (!items.length) return 0;
    return items.reduce((sum, i) => sum + ((i.discountedPrice || 0) * (i.quantity || 0)), 0);
  }, [items]);

  // 🔄 Sync User Data including Email
  useEffect(() => {
    if (user) {
      setShippingInfo({ 
        name: user.name || "", 
        email: user.email || "", // 🚀 Email Sync
        phone: user.phone || "", 
        street: user.addresses?.[0]?.street || "" 
      });
    }
  }, [user]);

  const paymentOptions = useMemo(() => ({
    ssl: settings?.paymentOptions?.online ?? true,
    bkash: settings?.paymentOptions?.bkash ?? true,
    cod: settings?.paymentOptions?.cod ?? true,
  }), [settings]);

  useEffect(() => {
    if (!settingsLoading) {
      if (paymentOptions.ssl) setPaymentMethod('ssl');
      else if (paymentOptions.bkash) setPaymentMethod('bkash');
      else if (paymentOptions.cod) setPaymentMethod('cod');
    }
  }, [paymentOptions, settingsLoading]);

  const shippingCharge = useMemo(() => deliveryZone === 'dhaka' ? 60 : 120, [deliveryZone]);
  const finalTotal = subtotal - (appliedCoupon?.discountAmount || 0) + shippingCharge;

  const handleQuantityChange = (productId, sizeId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) handleRemove(productId, sizeId);
    else updateCartItem(productId, sizeId, newQty, isAuthenticated);
  };

  const handleRemove = async (productId, sizeId) => {
    const confirmed = await swalConfirm("Purge Artifact?", "This item will be removed from your manifest.");
    if (confirmed) removeFromCart(productId, sizeId, isAuthenticated);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const data = await validateCoupon({ code: couponCode, cartTotal: subtotal });
      if (data.valid) { 
        setAppliedCoupon(data); 
        swalToast("Voucher Synced", "success"); 
      }
    } catch (err) { 
      swalError("Protocol Denied", "Voucher code not recognized."); 
    }
  };

  const handlePlaceOrder = async () => {
    // 🛡️ Validation with Email
    if (!shippingInfo.phone || !shippingInfo.street || !shippingInfo.name || !shippingInfo.email) {
      return swalError("Manifest Incomplete", "Please provide all logistics data including email.");
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
          ...shippingInfo,
          city: deliveryZone === 'dhaka' ? 'Dhaka' : 'Outside Dhaka',
          pathao_city_id: deliveryZone === 'dhaka' ? '1' : '2',
        },
        paymentMethod,
        couponCode: appliedCoupon?.coupon?.code,
        isDirectBuy
      });
      if (paymentMethod === 'cod') {
        trackPurchase(result.orderId, finalTotal, items.map(i => i.product._id));
        clearCart();
        router.push('/profile?tab=orders');
      }
    } catch (err) { 
      setIsProcessing(false); 
    }
  };

  if (items.length === 0 && !authLoading) return <EmptyState ui={ui} />;

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] transition-colors duration-700">
      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* LEFT: Manifest & Logistics */}
        <div className="lg:col-span-7 p-4 sm:p-10 lg:p-20 bg-white dark:bg-[#080808] border-r dark:border-zinc-900">
          <header className="mb-12 flex items-center gap-4">
              <Link href="/products" className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-full hover:scale-110 transition-transform">
                <ArrowLeft size={18} className="dark:text-white" />
              </Link>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic dark:text-white leading-none">
                Settlement
              </h1>
          </header>

          <div className="space-y-24">
            {/* 01. Manifest Section */}
            <section>
              <div className="flex justify-between items-end mb-10 border-b dark:border-zinc-800 pb-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">01. {ui.manifest}</h2>
                <span className="text-xs font-black dark:text-white">{items.length} Artifacts</span>
              </div>
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={`${item.product._id}-${item.size._id}`} className="flex gap-4 sm:gap-8 bg-zinc-50/50 dark:bg-white/5 p-5 rounded-[2.5rem] border border-zinc-100 dark:border-white/5 transition-all">
                    <div className="w-20 sm:w-28 aspect-[3/4] bg-zinc-200 dark:bg-zinc-900 rounded-2xl overflow-hidden shrink-0">
                      <img src={getImageUrl(item.product.images?.[0])} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="space-y-1">
                          <h3 className="text-base font-black uppercase tracking-tight dark:text-white">{item.product.name}</h3>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{item.size?.name || 'Standard'}</p>
                        </div>
                        {!isDirectBuy && (
                          <button onClick={() => handleRemove(item.product._id, item.size._id)} className="text-zinc-300 hover:text-rose-500 p-1"><Trash2 size={16}/></button>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <QuantitySelector 
                          qty={item.quantity} 
                          disabled={isDirectBuy} 
                          onDec={() => handleQuantityChange(item.product._id, item.size._id, item.quantity, -1)}
                          onInc={() => handleQuantityChange(item.product._id, item.size._id, item.quantity, 1)}
                        />
                        <p className="text-xl font-black dark:text-white tracking-tighter">৳{(item.discountedPrice * item.quantity).toFixed(0)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 02. Logistics Section */}
            <section className="space-y-12">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 border-b dark:border-zinc-800 pb-4">02. {ui.destination}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField label="Identity Name" value={shippingInfo.name} onChange={v => setShippingInfo({...shippingInfo, name: v})} placeholder="FULL NAME" />
                <InputField label="Neural Address (Email)" value={shippingInfo.email} onChange={v => setShippingInfo({...shippingInfo, email: v})} placeholder="EMAIL ADDRESS" icon={<Mail size={14}/>} />
                <InputField label="Contact Protocol" value={shippingInfo.phone} onChange={v => setShippingInfo({...shippingInfo, phone: v})} placeholder="+880" icon={<Phone size={14}/>} />
                
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Transit Zone</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['dhaka', 'outside'].map(z => (
                      <button key={z} onClick={() => setDeliveryZone(z)} className={`py-4 rounded-2xl font-black text-[9px] uppercase border-2 transition-all ${deliveryZone === z ? 'bg-black text-white border-black dark:bg-white dark:text-black shadow-lg scale-[1.02]' : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-400 border-transparent'}`}>
                        {ui[z]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <InputField label="Detailed Deployment Base (Address)" value={shippingInfo.street} onChange={v => setShippingInfo({...shippingInfo, street: v})} placeholder="STREET, HOUSE, AREA DETAILS" />
            </section>
          </div>
        </div>

        {/* RIGHT: Financial Summary */}
        <div className="lg:col-span-5 bg-zinc-50 dark:bg-[#0a0a0a] p-6 lg:p-24 border-l dark:border-zinc-900">
          <div className="sticky top-32 space-y-12">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">03. Financial Summary</h2>
            
            <div className="bg-white dark:bg-zinc-950 p-10 rounded-[3rem] shadow-2xl border dark:border-white/5 space-y-6 relative overflow-hidden">
               <LedgerRow label={ui.subtotal} value={subtotal} />
               {appliedCoupon && <LedgerRow label={ui.promo} value={`- ${appliedCoupon.discountAmount}`} highlight />}
               <LedgerRow label={ui.transit} value={shippingCharge} />
               <div className="pt-8 border-t dark:border-zinc-800 flex justify-between items-end">
                  <span className="text-xs font-black uppercase text-zinc-400">{ui.total}</span>
                  <span className="text-6xl font-black tracking-tighter dark:text-white leading-none">৳{finalTotal}</span>
               </div>
            </div>

            {/* Voucher Area */}
            <div className="flex gap-2 bg-white dark:bg-zinc-900 p-2 rounded-3xl border dark:border-white/5 shadow-inner">
              <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} className="flex-1 bg-transparent px-6 text-[10px] font-black uppercase outline-none dark:text-white" placeholder="PROMO CODE" />
              <button onClick={handleApplyCoupon} className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase hover:bg-rose-600 hover:text-white transition-all">{ui.apply}</button>
            </div>

            {/* Payment Method Selector */}
            <div className="grid gap-3">
              {paymentOptions.ssl && <MethodBtn active={paymentMethod === 'ssl'} onClick={() => setPaymentMethod('ssl')} icon={<CreditCard size={18}/>} title="Digital Payment" />}
              {paymentOptions.bkash && <MethodBtn active={paymentMethod === 'bkash'} onClick={() => setPaymentMethod('bkash')} icon={<Wallet size={18}/>} title="bKash Wallet" />}
              {paymentOptions.cod && <MethodBtn active={paymentMethod === 'cod'} onClick={() => setPaymentMethod('cod')} icon={<Truck size={18}/>} title="Cash on Delivery" />}
            </div>

            {/* Authorize Button */}
            <motion.button 
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={handlePlaceOrder} disabled={isProcessing}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-8 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl transition-all hover:bg-rose-600 hover:text-white disabled:opacity-50 flex items-center justify-center gap-4"
            >
              {isProcessing ? <Loader size="small" /> : <><ShieldCheck size={18} /> {ui.confirm}</>}
            </motion.button>
            
            <p className="text-center text-[8px] font-bold text-zinc-500 uppercase tracking-[0.3em] opacity-50 italic">Secure 256-bit encrypted settlement vault / VANGUARD OS</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🧱 Internal Utilities
function InputField({ label, value, onChange, placeholder, icon }) {
  return (
    <div className="space-y-3 w-full group">
      <div className="flex items-center gap-2 text-zinc-500 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors">
        {icon}
        <label className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</label>
      </div>
      <input 
        value={value} onChange={e => onChange?.(e.target.value)} 
        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border-2 border-transparent focus:border-zinc-900 dark:focus:border-white p-5 rounded-[1.5rem] outline-none transition-all text-xs font-bold uppercase dark:text-white shadow-inner" 
        placeholder={placeholder} 
      />
    </div>
  );
}

function QuantitySelector({ qty, onInc, onDec, disabled }) {
  if (disabled) return <span className="text-[10px] font-black uppercase text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-full">Sequence: {qty}</span>;
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-zinc-800 p-1 rounded-2xl border dark:border-white/10 shadow-sm">
      <button onClick={onDec} className="w-8 h-8 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><Minus size={14}/></button>
      <span className="font-black text-sm w-4 text-center dark:text-white tabular-nums">{qty}</span>
      <button onClick={onInc} className="w-8 h-8 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all"><Plus size={14}/></button>
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
      className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${active ? 'border-zinc-900 dark:border-white bg-white dark:bg-white/5 shadow-xl scale-[1.01]' : 'border-zinc-100 dark:border-zinc-900 opacity-40 hover:opacity-100'}`}
    >
      <div className={`p-2.5 rounded-xl ${active ? 'bg-zinc-900 text-white dark:bg-white dark:text-black' : 'bg-zinc-100 dark:bg-zinc-800'}`}>{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">{title}</span>
      {active && <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,1)]" />}
    </button>
  );
}

function EmptyState({ ui }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-[#fcfcfc] dark:bg-[#050505]">
      <div className="w-32 h-32 bg-zinc-100 dark:bg-zinc-900 rounded-[3rem] flex items-center justify-center mb-10 shadow-inner">
        <ShoppingBag size={48} className="text-zinc-300 dark:text-zinc-700" />
      </div>
      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-10 dark:text-white">{ui.empty}</h2>
      <Link href="/products" className="bg-black dark:bg-white text-white dark:text-black px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-2xl">
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