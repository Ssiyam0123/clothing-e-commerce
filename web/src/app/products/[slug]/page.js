'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Truck, ShieldCheck, Minus, Plus, Heart } from 'lucide-react';

// Stores & Utils
import api from '@/lib/api';
import { getImageUrl } from '@/utils/imageUtils';
import { swalError, swalToast } from '@/utils/swal';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { useTrackingStore } from '@/store/trackingStore';
import { useProductStore } from '@/store/productStore';

// Components
import Loader from '@/components/common/Loader';
import ProductCard from '@/components/common/ProductCard';
import ReviewSection from '@/components/store/ReviewSection';
import StarRating from '@/components/store/StarRating';

const DICTIONARY = {
  en: { add: 'Secure to Bag', buy: 'Instant Checkout', selectSize: 'Architecture', price: 'Investment', about: 'Narrative', related: 'The Sequence' },
  bn: { add: 'ব্যাগে নিন', buy: 'অর্ডার দিন', selectSize: 'সাইজ নির্বাচন', price: 'মূল্য', about: 'বিবরণ', related: 'অনুরূপ পণ্য' }
};

export default function ProductDetailsPage() {
  const { slug } = useParams(); // 🚀 Get slug from URL
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { lang, isMounted } = useAppStore();
  
  const { addToCart, initiateBuyNow, toggleWishlist, wishlistItems } = useProductStore();
  const trackViewContent = useTrackingStore((state) => state.trackViewContent);
  const trackAddToCart = useTrackingStore((state) => state.trackAddToCart);

  // 📝 Local UI States
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY['en'], [lang]);

  // 📥 1. Main Product Fetching (Using Slug)
  const { data: product, isLoading, error, refetch: refetchProduct } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => (await api.get(`/products/details/${slug}`)).data, // 🛰️ Updated Endpoint
    enabled: !!slug
  });

  // 📥 2. Related Products Fetching (Using Category ID from fetched product)
  const { data: relatedData } = useQuery({
    queryKey: ['products-related', product?.category?._id],
    queryFn: async () => {
      if (!product?.category?._id) return { products: [] };
      return (await api.get(`/products?category=${product.category._id}&limit=5`)).data;
    },
    enabled: !!product?.category?._id,
  });

  // 🕵️ Deriving ID for wishlist and reviews
  const productId = product?._id;

  const inWishlist = useMemo(() => 
    wishlistItems?.some(p => String(p._id || p.id) === String(productId)) || false, 
  [wishlistItems, productId]);

  const discountedPrice = useMemo(() => 
    product ? product.price - (product.price * (product.discount || 0)) / 100 : 0
  , [product]);

  useEffect(() => {
    if (product) {
      trackViewContent(product._id, product.name, discountedPrice, product.category?.name);
      const available = product.sizes?.find(s => s.stock > 0);
      if (available && !selectedSize) setSelectedSize(available.size._id);
    }
  }, [product]);

  // 🛒 Handlers
  const handleBagAction = async () => {
    if (!selectedSize) return swalError("Protocol Error", "Select Architecture (Size).");
    setIsAdding(true);
    try {
      await addToCart(product, selectedSize, quantity, isAuthenticated);
      swalToast(lang === 'bn' ? "ব্যাগে যোগ হয়েছে" : "Artifact Secured", "success");
      trackAddToCart(product._id, discountedPrice, quantity);
    } catch (err) { swalError("Vault Sync Failed", "Unable to secure item."); } 
    finally { setIsAdding(false); }
  };

  const handleInstantBuy = () => {
    if (!selectedSize) return swalError("Protocol Error", "Architecture required.");
    initiateBuyNow(product, selectedSize, quantity);
    router.push('/cart?type=direct');
  };

  if (!isMounted || isLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]"><Loader /></div>;
  if (error || !product) return <div className="min-h-screen flex items-center justify-center dark:text-white font-black uppercase tracking-widest text-center px-6 italic opacity-50">Protocol Null: Product Not Found</div>;

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] transition-colors duration-700">
      
      <div className="max-w-[1700px] mx-auto pt-0 lg:pt-20 px-0 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-0 lg:gap-16 xl:gap-24">
          
          {/* LEFT: Media Section */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="lg:sticky lg:top-28 w-full max-w-[620px]">
              <div className="relative aspect-[3/4] overflow-hidden lg:rounded-[3.5rem] bg-zinc-100 dark:bg-zinc-900 shadow-2xl">
                <motion.img 
                  key={selectedImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  src={getImageUrl(product.images?.[selectedImage])} 
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
                />
                {product.discount > 0 && (
                  <div className="absolute top-10 left-10 bg-rose-600 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                    -{product.discount}% DROP
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto no-scrollbar w-full py-8 px-6 lg:px-0 lg:justify-center">
                {product.images?.map((img, idx) => (
                  <button 
                    key={idx} onClick={() => setSelectedImage(idx)} 
                    className={`w-20 h-28 md:w-28 md:h-36 rounded-2xl overflow-hidden shadow-md shrink-0 transition-all border-2 ${selectedImage === idx ? 'scale-110 opacity-100 border-zinc-900 dark:border-white' : 'opacity-40 grayscale border-transparent'}`}
                  >
                    <img src={getImageUrl(img)} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Information Engine */}
          <div className="lg:col-span-5 px-6 lg:px-0 py-10 lg:py-4">
            <section className="space-y-6 mb-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-600">{product.category?.name}</span>
                   <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                   <div className="flex items-center gap-1.5 opacity-60">
                      <StarRating rating={product.averageRating || 5} size="small" />
                      <span className="text-[9px] font-black dark:text-white">{product.totalReviews || 0}</span>
                   </div>
                </div>
                <button onClick={() => toggleWishlist(product, isAuthenticated)} className={`p-3 rounded-full transition-all ${inWishlist ? 'text-rose-500 scale-110' : 'text-zinc-300 dark:text-zinc-700'}`}>
                   <Heart size={24} fill={inWishlist ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85] text-zinc-900 dark:text-white">
                  {product.name}
                </h1>
                <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium max-w-lg">
                  {product.description}
                </p>
              </div>
            </section>

            {/* Pricing Section */}
            <section className="bg-white dark:bg-white/5 p-10 rounded-[3rem] shadow-xl border border-white dark:border-white/5 mb-12">
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4">{ui.price}</p>
               <div className="flex items-baseline gap-6">
                  <span className="text-6xl font-black tracking-tighter dark:text-white">৳{discountedPrice.toFixed(0)}</span>
                  {product.discount > 0 && <span className="text-2xl font-bold text-zinc-300 dark:text-zinc-700 line-through tracking-tighter italic opacity-50">৳{product.price}</span>}
               </div>
            </section>

            {/* Size Framework */}
            <section className="space-y-6 mb-12">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">{ui.selectSize}</h3>
              <div className="grid grid-cols-4 gap-3">
                {product.sizes?.map((s) => (
                  <button 
                    key={s.size._id} disabled={s.stock <= 0}
                    onClick={() => setSelectedSize(s.size._id)}
                    className={`py-5 rounded-[1.5rem] font-black text-xs uppercase transition-all duration-500 ${selectedSize === s.size._id ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-2xl scale-105' : 'bg-white dark:bg-white/5 text-zinc-400 dark:text-zinc-600 hover:bg-zinc-100 disabled:opacity-20'}`}
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
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full"><Minus size={18}/></button>
                  <span className="w-10 text-center font-black dark:text-white text-xl tabular-nums">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full"><Plus size={18}/></button>
                </div>
                <button onClick={handleBagAction} disabled={isAdding} className="flex-1 bg-white dark:bg-white/10 dark:text-white py-5 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-zinc-900 hover:text-white transition-all shadow-md">
                  {isAdding ? <Loader size="small" /> : ui.add}
                </button>
              </div>
              <button onClick={handleInstantBuy} className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-6 rounded-full font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl hover:bg-rose-600 hover:text-white transition-all active:scale-[0.98]">
                {ui.buy}
              </button>
            </section>

            {/* narrative detail footnote */}
            <section className="mt-auto pt-10 border-t dark:border-white/5 grid grid-cols-2 gap-8">
                <div className="flex items-center gap-4 group">
                   <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-rose-500 transition-colors shadow-sm"><Truck size={22}/></div>
                   <span className="text-[9px] font-black uppercase dark:text-white tracking-[0.2em]">Global Logistics</span>
                </div>
                <div className="flex items-center gap-4 group">
                   <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-indigo-500 transition-colors shadow-sm"><ShieldCheck size={22}/></div>
                   <span className="text-[9px] font-black uppercase dark:text-white tracking-[0.2em]">Secured Origin</span>
                </div>
            </section>
          </div>
        </div>
      </div>

      {/* COMMUNITY & FOOTER */}
      <div className="max-w-[1400px] mx-auto px-6 mt-40 pb-56 lg:pb-32 space-y-48">
        {productId && <ReviewSection productId={productId} onReviewChange={() => refetchProduct()} />}
        
        <div className="space-y-16">
           <div className="text-center">
              <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter dark:text-white leading-none">{ui.related}</h2>
              <div className="mt-8 h-1 w-24 bg-rose-600 mx-auto rounded-full" />
           </div>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
             {relatedData?.products?.filter(p => p._id !== productId).slice(0, 4).map(p => <ProductCard key={p._id} product={p} lang={lang} />)}
           </div>
        </div>
      </div>

      {/* MOBILE ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[130] bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-2xl p-5 pb-10 flex items-center gap-4 shadow-2xl border-t dark:border-white/5">
        <div className="flex-1">
           <p className="text-xl font-black dark:text-white tracking-tighter leading-none">৳{discountedPrice.toFixed(0)}</p>
           <p className="text-[8px] text-zinc-500 uppercase font-black mt-1 truncate max-w-[120px]">{product.name}</p>
        </div>
        <button onClick={handleBagAction} className="w-14 h-14 bg-zinc-100 dark:bg-white/10 dark:text-white rounded-2xl flex items-center justify-center active:scale-90 transition-transform"><ShoppingBag size={22}/></button>
        <button onClick={handleInstantBuy} className="flex-[2] bg-zinc-900 dark:bg-white text-white dark:text-black h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-transform">
          {lang === 'bn' ? 'অর্ডার' : 'Checkout'}
        </button>
      </div>

    </div>
  );
}