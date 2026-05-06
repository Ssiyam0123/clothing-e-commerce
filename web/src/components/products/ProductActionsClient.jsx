'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { useProductStore } from '@/store/productStore';
import { useTrackingStore } from '@/store/trackingStore';
import { swalError, swalToast } from '@/utils/swal';
import Loader from '@/components/common/Loader';

const DICTIONARY = {
  en: { add: 'Secure to Bag', buy: 'Instant Checkout', selectSize: 'Architecture', price: 'Investment' },
  bn: { add: 'ব্যাগে নিন', buy: 'অর্ডার দিন', selectSize: 'সাইজ নির্বাচন', price: 'মূল্য' }
};

export default function ProductActionsClient({ product }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { lang } = useAppStore();
  const { addToCart, initiateBuyNow } = useProductStore();
  const trackAddToCart = useTrackingStore((state) => state.trackAddToCart);

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY.en, [lang]);
  const discountedPrice = useMemo(() => 
    product ? product.price - (product.price * (product.discount || 0)) / 100 : 0,
    [product]
  );

  useEffect(() => {
    if (product) {
      const available = product.sizes?.find(s => s.stock > 0);
      if (available && !selectedSize) setSelectedSize(available.size._id);
    }
  }, [product]);

  const handleBagAction = async () => {
    if (!selectedSize) return swalError("Protocol Error", "Select Architecture (Size).");
    setIsAdding(true);
    try {
      await addToCart(product, selectedSize, quantity, isAuthenticated);
      swalToast(lang === 'bn' ? "ব্যাগে যোগ হয়েছে" : "Artifact Secured", "success");
      trackAddToCart(product._id, discountedPrice, quantity);
    } catch (err) { 
      swalError("Vault Sync Failed", "Unable to secure item."); 
    } finally { 
      setIsAdding(false); 
    }
  };

  const handleInstantBuy = () => {
    if (!selectedSize) return swalError("Protocol Error", "Architecture required.");
    initiateBuyNow(product, selectedSize, quantity);
    router.push('/cart?type=direct');
  };

  return (
    <>
      {/* Pricing Section */}
      <section className="bg-white dark:bg-white/5 p-6 md:p-10 rounded-[2.5rem] lg:rounded-[3rem] shadow-xl border border-white dark:border-white/5 mb-12">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4">{ui.price}</p>
        <div className="flex items-baseline gap-4 md:gap-6">
          <span className="text-5xl md:text-6xl font-black tracking-tighter dark:text-white">৳{discountedPrice.toFixed(0)}</span>
          {product.discount > 0 && (
            <span className="text-xl md:text-2xl font-bold text-zinc-300 dark:text-zinc-700 line-through tracking-tighter italic opacity-50">৳{product.price}</span>
          )}
        </div>
      </section>

      {/* Size Framework */}
      <section className="space-y-6 mb-12">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">{ui.selectSize}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {product.sizes?.map((s) => (
            <button 
              key={s.size._id} 
              disabled={s.stock <= 0}
              onClick={() => setSelectedSize(s.size._id)}
              className={`py-4 md:py-5 rounded-2xl md:rounded-[1.5rem] font-black text-xs uppercase transition-all duration-500 ${
                selectedSize === s.size._id 
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-2xl scale-105' 
                  : 'bg-white dark:bg-white/5 text-zinc-400 dark:text-zinc-600 hover:bg-zinc-100 disabled:opacity-20'
              }`}
              aria-label={`Size ${s.size.name}${s.stock <= 0 ? ' (out of stock)' : ''}`}
            >
              {s.size.name}
            </button>
          ))}
        </div>
      </section>

      {/* Action Console */}
      <section className="flex flex-col gap-4 mb-16">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white dark:bg-white/5 rounded-full p-1.5 border dark:border-white/5">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))} 
              className="w-12 h-12 flex items-center justify-center dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full"
              aria-label="Decrease quantity"
            >
              <Minus size={18}/>
            </button>
            <span className="w-10 text-center font-black dark:text-white text-xl tabular-nums">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)} 
              className="w-12 h-12 flex items-center justify-center dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full"
              aria-label="Increase quantity"
            >
              <Plus size={18}/>
            </button>
          </div>
          <button 
            onClick={handleBagAction} 
            disabled={isAdding} 
            className="flex-1 bg-white dark:bg-white/10 dark:text-white py-5 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-zinc-900 hover:text-white transition-all shadow-md disabled:opacity-50"
          >
            {isAdding ? <Loader size="small" /> : ui.add}
          </button>
        </div>
        <button 
          onClick={handleInstantBuy} 
          className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-6 rounded-full font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl hover:bg-rose-600 hover:text-white transition-all active:scale-[0.98]"
        >
          {ui.buy}
        </button>
      </section>

      {/* Footnote */}
      <section className="mt-auto pt-10 border-t dark:border-white/5 grid grid-cols-2 gap-8">
        <div className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-rose-500 transition-colors shadow-sm">
            <Truck size={22}/>
          </div>
          <span className="text-[9px] font-black uppercase dark:text-white tracking-[0.2em]">Global Logistics</span>
        </div>
        <div className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-indigo-500 transition-colors shadow-sm">
            <ShieldCheck size={22}/>
          </div>
          <span className="text-[9px] font-black uppercase dark:text-white tracking-[0.2em]">Secured Origin</span>
        </div>
      </section>

      {/* MOBILE ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[130] bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-2xl p-4 pb-8 flex items-center gap-3 shadow-2xl border-t dark:border-white/5">
        <div className="flex-1 min-w-0">
          <p className="text-xl font-black dark:text-white tracking-tighter leading-none">৳{discountedPrice.toFixed(0)}</p>
          <p className="text-[9px] text-zinc-500 uppercase font-black mt-1 truncate">{product.name}</p>
        </div>
        <button 
          onClick={handleBagAction} 
          className="aspect-square h-12 md:h-14 bg-zinc-100 dark:bg-white/10 dark:text-white rounded-xl md:rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
          aria-label="Add to bag"
        >
          <ShoppingBag size={20}/>
        </button>
        <button 
          onClick={handleInstantBuy} 
          className="flex-[2] bg-zinc-900 dark:bg-white text-white dark:text-black h-12 md:h-14 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-transform"
        >
          {lang === 'bn' ? 'অর্ডার' : 'Checkout'}
        </button>
      </div>
    </>
  );
}
