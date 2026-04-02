'use client';

import { useMemo, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { getImageUrl } from '@/utils/imageUtils';
import { useAppStore } from '@/store/appStore';
import { useTrackingStore } from '@/store/trackingStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItemSkeleton, CartSummarySkeleton } from '@/components/common/Skeletons';

const DICTIONARY = {
  en: {
    title: 'Shopping Bag', items: 'Items Selected', empty: 'The Bag is Empty',
    browse: 'Explore Collection', summary: 'Bag Summary', subtotal: 'Subtotal',
    transit: 'Transit Fee', complimentary: 'Complimentary', total: 'Final Amount',
    checkout: 'Proceed to Settlement', continue: 'Continue Browsing',
    size: 'Size', remove: 'Remove', valAssess: 'Item Total'
  },
  bn: {
    title: 'শপিং ব্যাগ', items: 'টি পণ্য বাছাই করা হয়েছে', empty: 'ব্যাগটি বর্তমানে খালি',
    browse: 'কালেকশন দেখুন', summary: 'ব্যাগের সারসংক্ষেপ', subtotal: 'উপ-মোট',
    transit: 'ডেলিভারি চার্জ', complimentary: 'ফ্রি', total: 'সর্বমোট মূল্য',
    checkout: 'পেমেন্ট ধাপে যান', continue: 'আরও কেনাকাটা করুন',
    size: 'সাইজ', remove: 'সরিয়ে ফেলুন', valAssess: 'মোট মূল্য'
  }
};

export default function CartPage() {
  const { user } = useAuth();
  const { cart, isLoading: cartLoading, updateCartItem, removeFromCart } = useCart();
  const { lang, isMounted } = useAppStore();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY['en'], [lang]);
  const isBn = lang === 'bn';

  const trackViewCart = useTrackingStore((state) => state.trackViewCart);
  const trackRemoveFromCart = useTrackingStore((state) => state.trackRemoveFromCart);

  useEffect(() => {
    if (cart?.items?.length > 0) trackViewCart(cart.items, cart.totalPrice);
  }, [cart, trackViewCart]);

  const handleRemoveItem = async (productId, sizeId, price) => {
    try {
      await removeFromCart({ productId, sizeId });
      trackRemoveFromCart(productId, price);
    } catch (err) { console.error(err); }
  };

  // 🚀 Shell Render: পেজে ঢোকার সাথে সাথে এই অংশটুকু দেখা যাবে
  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] py-12 lg:py-24 transition-colors duration-700 relative overflow-hidden">
      <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <header className="mb-20 border-b border-zinc-100 dark:border-white/5 pb-10">
           <h1 className={`text-5xl md:text-8xl font-black tracking-tighter uppercase mb-4 leading-none text-zinc-900 dark:text-white ${isBn ? 'font-sans' : ''}`}>
             {ui.title}
           </h1>
           {!cartLoading && cart?.items?.length > 0 && (
             <div className="flex items-center gap-4">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-white animate-pulse"></span>
                <p className="text-zinc-500 uppercase text-[10px] font-black tracking-[0.4em]">
                  {cart.totalItems} {ui.items}
                </p>
             </div>
           )}
        </header>

        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {cartLoading ? (
                <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                   <CartItemSkeleton />
                   <CartItemSkeleton />
                </motion.div>
              ) : !cart?.items?.length ? (
                <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center">
                  <span className="text-7xl mb-8 block grayscale opacity-20">👜</span>
                  <h2 className="text-4xl font-black uppercase mb-6 text-zinc-900 dark:text-white">{ui.empty}</h2>
                  <Link href="/products" className="text-indigo-600 border-b-2 border-indigo-600 pb-1 uppercase text-[10px] font-black tracking-widest">{ui.browse}</Link>
                </motion.div>
              ) : (
                <motion.div key="items" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                  {cart.items.map((item) => {
                    const basePrice = item.product.price;
                    const discountedPrice = item.product.discount > 0 ? basePrice - (basePrice * item.product.discount / 100) : basePrice;
                    return (
                      <div key={`${item.product._id}-${item.size?._id}`} className="group flex flex-col md:flex-row gap-8 pb-12 border-b border-zinc-100 dark:border-white/5">
                        <div className="w-full md:w-48 lg:w-52 aspect-[3/4] bg-zinc-100 dark:bg-[#0a0a0a] rounded-[2rem] overflow-hidden border dark:border-white/5 relative shrink-0">
                          <img src={getImageUrl(item.product.images?.[0])} alt={item.product.name} className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                        </div>
                        <div className="flex-1 flex flex-col py-2 min-w-0">
                          <div className="flex justify-between items-start mb-8 gap-4">
                            <div className="min-w-0">
                              <Link href={`/products/${item.product._id}`} className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white hover:text-zinc-500 transition-colors leading-tight block truncate">{item.product.name}</Link>
                              <p className="text-zinc-500 uppercase text-[9px] font-black tracking-[0.3em] mt-3">{ui.size}: <span className="text-zinc-900 dark:text-zinc-200">{item.size?.name}</span></p>
                            </div>
                            <button onClick={() => handleRemoveItem(item.product._id, item.size._id, discountedPrice)} className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-rose-500 transition-colors flex items-center justify-center shrink-0">✕</button>
                          </div>
                          <div className="mt-auto flex flex-wrap items-end justify-between gap-6">
                            <div className="flex items-center bg-white dark:bg-[#0a0a0a] rounded-full p-1 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                              <button onClick={() => updateCartItem({ productId: item.product._id, sizeId: item.size._id, quantity: item.quantity - 1 })} className="w-10 h-10 flex items-center justify-center text-lg text-zinc-400">-</button>
                              <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                              <button onClick={() => updateCartItem({ productId: item.product._id, sizeId: item.size._id, quantity: item.quantity + 1 })} className="w-10 h-10 flex items-center justify-center text-lg text-zinc-400">+</button>
                            </div>
                            <div className="text-right">
                              <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">{ui.valAssess}</p>
                              <p className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">৳{(discountedPrice * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="sticky top-32">
              {cartLoading ? (
                <CartSummarySkeleton />
              ) : cart?.items?.length > 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 md:p-12 rounded-[3rem] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-2xl border border-zinc-200 dark:border-white/5 shadow-xl">
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-6">{ui.summary}</h2>
                  <div className="space-y-6 mb-10">
                    <div className="flex justify-between text-zinc-500 uppercase text-[10px] font-black tracking-widest">
                      <span>{ui.subtotal}</span>
                      <span className="text-zinc-900 dark:text-zinc-100">৳{cart.totalPrice?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500 uppercase text-[10px] font-black tracking-widest">
                      <span>{ui.transit}</span>
                      <span className="text-emerald-600 dark:text-emerald-400">{ui.complimentary}</span>
                    </div>
                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-6"></div>
                    <div className="flex justify-between items-center">
                      <span className="uppercase text-[11px] font-black tracking-[0.3em] text-zinc-400">{ui.total}</span>
                      <span className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">৳{cart.totalPrice?.toFixed(2)}</span>
                    </div>
                  </div>
                  <Link href="/checkout" className="block w-full">
                    <div className="w-full text-center bg-zinc-900 dark:bg-white text-white dark:text-black py-6 rounded-full font-black uppercase tracking-[0.25em] text-[11px] shadow-2xl hover:scale-[1.02] transition-transform">
                      {ui.checkout}
                    </div>
                  </Link>
                </motion.div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}