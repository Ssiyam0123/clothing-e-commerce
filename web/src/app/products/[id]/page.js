'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { getImageUrl } from '@/utils/imageUtils';
import Loader from '@/components/common/Loader';
import ProductCard from '@/components/common/ProductCard';
import { useProductCondition } from '@/store/productCondition'; 
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { useTrackingStore } from '@/store/trackingStore';

import ReviewSection from '@/components/store/ReviewSection';
import StarRating from '@/components/store/StarRating';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Zap, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';
import { swalError, swalToast } from '@/utils/swal';

const DICTIONARY = {
  en: {
    home: 'Home', collection: 'Collection', notFound: 'Product Not Found',
    back: 'Back to Collection', add: 'Add to Bag', buy: 'Order Now',
    selectSize: 'Select Size', price: 'Price', save: 'Save',
    about: 'Description', reviews: 'Reviews',
    relatedTitle: 'Related Artifacts', added: '✨ Artifact Secured in Bag',
    goToCart: 'View Settlement', outOfStock: 'Out of Stock'
  },
  bn: {
    home: 'হোম', collection: 'কালেকশন', notFound: 'প্রোডাক্ট পাওয়া যায়নি',
    back: 'কালেকশনে ফিরে যান', add: 'ব্যাগে নিন', buy: 'অর্ডার দিন',
    selectSize: 'সাইজ নির্বাচন করুন', price: 'মূল্য', save: 'সাশ্রয়',
    about: 'বিবরণ', reviews: 'রিভিউ',
    relatedTitle: 'আপনার পছন্দ হতে পারে', added: '✨ পণ্যটি ব্যাগে যোগ হয়েছে',
    goToCart: 'ব্যাগ দেখুন', outOfStock: 'স্টক নেই'
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // 🛰️ Global Stores
  const { isAuthenticated } = useAuthStore();
  const { lang, isMounted } = useAppStore();
  const { addToCart, initiateBuyNow, toggleWishlist, wishlistItems } = useProductCondition();
  
  // 📊 Tracking
  const trackViewContent = useTrackingStore((state) => state.trackViewContent);
  const trackAddToCart = useTrackingStore((state) => state.trackAddToCart);

  // 📝 Local UI State
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY['en'], [lang]);

  // 📥 Data Fetching
  const { data: product, isLoading, error, refetch: refetchProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => (await api.get(`/products/${id}`)).data,
  });

  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => (await api.get(`/reviews/product/${id}`)).data,
    enabled: !!id,
  });

  const { data: productsData } = useQuery({
    queryKey: ['products-related', product?.category?._id],
    queryFn: async () => {
      if (!product?.category?._id) return { products: [] };
      return (await api.get(`/products?category=${product.category._id}&limit=5`)).data;
    },
    enabled: !!product?.category?._id,
  });

  const inWishlist = useMemo(() => 
    wishlistItems.some(p => String(p._id) === String(id)), 
  [wishlistItems, id]);

  const relatedProducts = useMemo(() => 
    productsData?.products?.filter(p => p._id !== id).slice(0, 4) || [], 
  [productsData, id]);

  // ⚙️ Effects
  useEffect(() => {
    if (product) {
      const discPrice = product.price - (product.price * (product.discount || 0) / 100);
      trackViewContent(product._id, product.name, discPrice, product.category?.name);
      
      const availableSizes = product.sizes?.filter(s => s.stock > 0) || [];
      if (!selectedSize && availableSizes.length > 0) {
        setSelectedSize(availableSizes[0].size._id);
      }
    }
  }, [product, trackViewContent, selectedSize]);

  // 🛒 Handlers
  const handleAddToCart = async () => {
    if (!selectedSize) return swalError("Error", ui.selectSize);
    setIsAdding(true);
    try {
      await addToCart(product, selectedSize, quantity, isAuthenticated);
      setShowAddedToCart(true);
      trackAddToCart(product._id, product.price, quantity);
      setTimeout(() => setShowAddedToCart(false), 5000);
    } catch (err) {
      swalError("Failed", "Could not synchronize with bag.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) return swalError("Error", ui.selectSize);
    // 🚀 Store এ ডাটা সেট করে সরাসরি নতুন Unified Cart এ পাঠানো হচ্ছে
    initiateBuyNow(product, selectedSize, quantity);
    router.push('/cart?type=direct');
  };

  if (!isMounted || isLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]"><Loader /></div>;

  if (error || !product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#050505] text-center p-6">
      <h1 className="text-4xl font-black uppercase mb-6 dark:text-white">{ui.notFound}</h1>
      <Link href="/products" className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest">{ui.back}</Link>
    </div>
  );

  const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);
  const availableSizes = product.sizes?.filter(s => s.stock > 0) || [];
  const selectedSizeStock = availableSizes.find(s => s.size._id === selectedSize)?.stock || 0;

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] transition-colors duration-700">
      
      {/* 🌌 Atmospheric Hero Background */}
      <div className="h-[45vh] bg-zinc-900 dark:bg-black absolute w-full top-0 left-0 z-0 rounded-b-[4rem] border-b border-white/5 shadow-2xl"></div>

      <div className="max-w-[1700px] mx-auto px-4 md:px-10 py-10 relative z-10">
        
        {/* 🧭 Navigation Breadcrumb */}
        <nav className="flex items-center mb-12 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">{ui.home}</Link>
          <span className="mx-3 opacity-30">/</span>
          <Link href="/products" className="hover:text-white transition-colors">{ui.collection}</Link>
          <span className="mx-3 opacity-30">/</span>
          <span className="text-white truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* 📦 Main Product Layout */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-start">
          
          {/* --- LEFT: Visuals --- */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded-[3rem] overflow-hidden border border-zinc-200/50 dark:border-white/5 shadow-2xl group">
              <img src={getImageUrl(product.images?.[selectedImage])} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              
              {/* Wishlist Bubble */}
              <button 
                onClick={() => toggleWishlist(product, isAuthenticated)}
                className={`absolute top-8 right-8 p-4 rounded-full backdrop-blur-xl transition-all active:scale-75 ${inWishlist ? 'bg-rose-500 text-white shadow-rose-500/50 shadow-2xl' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'}`}
              >
                <Heart size={20} fill={inWishlist ? "currentColor" : "none"} strokeWidth={2.5} />
              </button>

              {product.discount > 0 && (
                <div className="absolute top-8 left-8 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl border dark:border-white/10">
                  -{product.discount}%
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {product.images?.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImage(idx)} className={`w-24 h-32 rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-zinc-900 dark:border-white scale-105' : 'border-transparent opacity-50 grayscale hover:opacity-100'}`}>
                  <img src={getImageUrl(img)} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT: Information Hub --- */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-10">
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="bg-rose-600/10 text-rose-600 dark:text-rose-500 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-600/10">
                    {product.category?.name}
                  </span>
                  <div className="flex items-center gap-2 bg-zinc-100 dark:bg-white/5 px-3 py-1 rounded-lg">
                    <StarRating rating={reviewsData?.averageRating || 0} size="small" />
                    <span className="text-[10px] font-black dark:text-white">{reviewsData?.averageRating?.toFixed(1) || '0.0'}</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none dark:text-white">
                  {product.name}
                </h1>
              </div>

              {/* Pricing Architecture */}
              <div className="p-8 bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-100 dark:border-white/5 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4">{ui.price}</p>
                <div className="flex items-end gap-6">
                  <span className="text-5xl font-black tracking-tighter dark:text-white">৳{discountedPrice.toFixed(0)}</span>
                  {product.discount > 0 && (
                    <div className="flex flex-col pb-1">
                      <span className="text-xl font-bold text-zinc-400 line-through">৳{product.price}</span>
                      <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{ui.save} ৳{(product.price - discountedPrice).toFixed(0)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Size Mapping */}
              {availableSizes.length > 0 ? (
                <div className="space-y-5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-1">{ui.selectSize}</h3>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map((s) => (
                      <button 
                        key={s.size._id} 
                        onClick={() => setSelectedSize(s.size._id)} 
                        className={`min-w-[4.5rem] py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${selectedSize === s.size._id ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-transparent shadow-xl' : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400'}`}
                      >
                        {s.size.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-2xl text-center text-rose-500 font-black uppercase text-xs tracking-widest">
                   {ui.outOfStock}
                </div>
              )}

              {/* Description */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-1">{ui.about}</h3>
                 <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">{product.description}</p>
              </div>

              {/* 🚀 Action Console */}
              <div className="space-y-4 pt-6">
                <AnimatePresence>
                  {showAddedToCart && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">{ui.added}</span>
                      <Link href="/cart" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 underline">{ui.goToCart} →</Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-4">
                  <button 
                    onClick={handleAddToCart} 
                    disabled={isAdding || availableSizes.length === 0}
                    className="flex-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-200 dark:hover:bg-white dark:hover:text-black transition-all shadow-sm flex items-center justify-center gap-3 disabled:opacity-30"
                  >
                    <ShoppingBag size={16} /> {isAdding ? '...' : ui.add}
                  </button>
                  <button 
                    onClick={handleBuyNow} 
                    disabled={availableSizes.length === 0}
                    className="flex-[1.5] bg-zinc-900 dark:bg-white text-white dark:text-black py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-rose-600 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-30"
                  >
                    <Zap size={16} fill="currentColor" /> {ui.buy}
                  </button>
                </div>
              </div>

              {/* Service Grid */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-zinc-100 dark:border-zinc-900">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-[#111] flex items-center justify-center text-zinc-400 group-hover:text-rose-500 transition-colors"><Truck size={18}/></div>
                  <div>
                    <p className="text-[9px] font-black uppercase dark:text-white tracking-widest leading-none mb-1">Eco Logistics</p>
                    <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-tighter">Fast & Sustainable</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-[#111] flex items-center justify-center text-zinc-400 group-hover:text-indigo-500 transition-colors"><RefreshCcw size={18}/></div>
                  <div>
                    <p className="text-[9px] font-black uppercase dark:text-white tracking-widest leading-none mb-1">Authentic Returns</p>
                    <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-tighter">30 Day Policy</p>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>

        {/* --- REVIEWS --- */}
        <div className="mt-32">
          <ReviewSection productId={id} onReviewChange={() => { refetchProduct(); refetchReviews(); }} />
        </div>

        {/* --- RELATED DROPS --- */}
        {relatedProducts.length > 0 && (
          <div className="mt-40 space-y-16">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter dark:text-white leading-none mb-4">{ui.relatedTitle}</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Continue the Sequence</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {relatedProducts.map(p => <ProductCard key={p._id} product={p} lang={lang} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}