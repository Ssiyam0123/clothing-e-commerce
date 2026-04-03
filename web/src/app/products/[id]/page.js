'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { getImageUrl } from '@/utils/imageUtils';
import Loader from '@/components/common/Loader';
import ProductCard from '@/components/store/ProductCard';
import { useAuth } from '@/hooks/useAuth';
import { useProductCondition } from '@/store/productCondition'; // ✅ new store
import ReviewSection from '@/components/store/ReviewSection';
import StarRating from '@/components/store/StarRating';
import { useAppStore } from '@/store/appStore';
import { useTrackingStore } from '@/store/trackingStore';
import { motion, AnimatePresence } from 'framer-motion';

// Dictionary (unchanged)
const DICTIONARY = {
  en: {
    home: 'Home',
    collection: 'Collection',
    notFound: 'Product Not Found',
    back: 'Back to Collection',
    add: 'Add to Bag',
    buy: 'Buy Now',
    selectSize: 'Select Size',
    price: 'Price',
    save: 'Save',
    about: 'About this item',
    freeShip: 'Free Shipping',
    freeSub: 'On orders over ৳5000',
    ecoReturn: 'Eco Returns',
    ecoSub: '30 days easy policy',
    outOfStock: 'Currently Out of Stock',
    reviews: 'Reviews',
    relatedTitle: 'You May Also Like',
    relatedSub: 'Continue Shopping',
    added: '✨ Added to bag successfully!',
    goToCart: 'Go to Cart',
  },
  bn: {
    home: 'হোম',
    collection: 'কালেকশন',
    notFound: 'প্রোডাক্ট পাওয়া যায়নি',
    back: 'কালেকশনে ফিরে যান',
    add: 'ব্যাগে যোগ করুন',
    buy: 'এখনই কিনুন',
    selectSize: 'সাইজ নির্বাচন করুন',
    price: 'মূল্য',
    save: 'সাশ্রয়',
    about: 'প্রোডাক্ট সম্পর্কে',
    freeShip: 'ফ্রি শিপিং',
    freeSub: '৳৫০০০ এর উপরের অর্ডারে',
    ecoReturn: 'ইকো রিটার্নস',
    ecoSub: '৩০ দিনের সহজ পলিসি',
    outOfStock: 'বর্তমানে স্টক নেই',
    reviews: 'রিভিউ',
    relatedTitle: 'আপনার পছন্দ হতে পারে',
    relatedSub: 'আরও কেনাকাটা করুন',
    added: '✨ ব্যাগে সফলভাবে যোগ করা হয়েছে!',
    goToCart: 'কার্টে যান',
  }
};

// Framer Motion Variants (unchanged)
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { lang, isMounted } = useAppStore();
  const trackViewContent = useTrackingStore((state) => state.trackViewContent);
  const trackAddToCart = useTrackingStore((state) => state.trackAddToCart);

  // ✅ Use Zustand store for cart actions
  const addToCart = useProductCondition((state) => state.addToCart);

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY['en'], [lang]);
  const isBn = lang === 'bn';

  // Data fetching (unchanged)
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
    queryKey: ['products', product?.category?._id],
    queryFn: async () => {
      if (!product?.category?._id) return { products: [] };
      return (await api.get(`/products?category=${product.category._id}&limit=4`)).data;
    },
    enabled: !!product?.category?._id,
  });

  useEffect(() => {
    if (productsData?.products) {
      setRelatedProducts(productsData.products.filter(p => p._id !== id).slice(0, 4));
    }
  }, [productsData, id]);

  useEffect(() => {
    if (product) {
      const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);
      trackViewContent(product._id, product.name, discountedPrice, product.category?.name);
      
      const availableSizes = product.sizes?.filter(s => s.stock > 0) || [];
      if (!selectedSize && availableSizes.length > 0) {
        setSelectedSize(availableSizes[0].size._id);
      }
    }
  }, [product, trackViewContent, selectedSize]);

  // ✅ Updated add to cart handler using Zustand store
  const handleAddToCart = async () => {
    const availableSizes = product.sizes?.filter(s => s.stock > 0) || [];
    if (!selectedSize && availableSizes.length > 0) {
      alert('Please select a size first.');
      return;
    }
    setIsAdding(true);
    try {
      // Optimistic add to cart via Zustand store
      await addToCart(product, selectedSize, quantity);
      
      setShowAddedToCart(true);
      const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);
      trackAddToCart(product._id, discountedPrice, quantity);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setShowAddedToCart(false), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    const availableSizes = product.sizes?.filter(s => s.stock > 0) || [];
    if (!selectedSize && availableSizes.length > 0) {
      alert('Please select a size first.');
      return;
    }
    const directItem = {
      product,
      size: availableSizes.find(s => s.size._id === selectedSize)?.size,
      quantity
    };
    sessionStorage.setItem('buyNowItem', JSON.stringify(directItem));
    router.push('/checkout?type=direct');
  };

  // Loading & error states (unchanged)
  if (!isMounted || isLoading) return <div className="min-h-screen flex items-center justify-center dark:bg-[#050505]"><Loader /></div>;

  if (error || !product) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#fcfcfc] dark:bg-[#050505] px-6 text-center transition-colors duration-700">
      <span className="text-6xl block mb-6 opacity-20 grayscale">🔍</span>
      <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-tight">{ui.notFound}</h1>
      <Link href="/products" className="inline-block bg-zinc-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all">
        {ui.back}
      </Link>
    </div>
  );

  const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);
  const availableSizes = product.sizes?.filter(s => s.stock > 0) || [];
  const selectedSizeData = availableSizes.find(s => s.size._id === selectedSize);
  const maxQuantity = selectedSizeData?.stock || 0;

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] font-sans pb-20 transition-colors duration-700 relative overflow-hidden">
      {/* Background decorations (unchanged) */}
      <div className="h-[40vh] bg-zinc-900 dark:bg-black absolute w-full top-0 left-0 -z-10 rounded-b-[3rem] sm:rounded-b-[5rem] opacity-95 dark:opacity-100 transition-colors duration-700 border-b border-zinc-200/10 dark:border-white/5 shadow-2xl"></div>
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 relative z-10">
        {/* Breadcrumb (unchanged) */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center mb-10 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400"
        >
          <Link href="/" className="hover:text-white transition-colors">{ui.home}</Link>
          <span className="mx-2 sm:mx-3 opacity-30">/</span>
          <Link href="/products" className="hover:text-white transition-colors">{ui.collection}</Link>
          <span className="mx-2 sm:mx-3 opacity-30">/</span>
          <span className="text-white truncate max-w-[150px] sm:max-w-[250px]">{product.name}</span>
        </motion.nav>

        {/* Main Product Container (mostly unchanged, only success message changed) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-3xl rounded-[2rem] sm:rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden"
        >
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 p-6 sm:p-10 lg:p-16">
            {/* LEFT: Media Gallery (unchanged) */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
              <motion.div variants={fadeUp} className="relative aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden group border border-zinc-200/50 dark:border-white/5">
                {product.images && product.images[selectedImage] ? (
                  <img
                    src={getImageUrl(product.images[selectedImage])}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-in-out"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-300 text-6xl">👕</div>
                )}
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white px-4 py-2 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg border border-zinc-200 dark:border-zinc-800">
                    -{product.discount}%
                  </div>
                )}
                {product.isFeatured && (
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg">
                    Featured
                  </div>
                )}
              </motion.div>
              {product.images && product.images.length > 1 && (
                <motion.div variants={fadeUp} className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {product.images.map((img, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative h-20 w-16 sm:h-24 sm:w-20 flex-shrink-0 rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === idx
                          ? 'border-zinc-900 dark:border-white shadow-md grayscale-0'
                          : 'border-transparent opacity-60 hover:opacity-100 grayscale'
                      }`}
                    >
                      <img src={getImageUrl(img)} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* RIGHT: Product Details (unchanged except success message) */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col h-full">
              {/* Category & Rating (unchanged) */}
              <motion.div variants={fadeUp} className="mb-6 flex flex-wrap gap-2 sm:gap-3 items-center">
                <Link
                  href={`/products?category=${product.category?.slug}`}
                  className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 px-3 sm:px-4 py-1.5 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  {product.category?.name}
                </Link>
                {product.subcategory && (
                  <>
                    <span className="text-zinc-300 dark:text-zinc-700">→</span>
                    <Link
                      href={`/products?subcategory=${product.subcategory?.slug}`}
                      className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 text-zinc-500 px-3 sm:px-4 py-1.5 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-colors"
                    >
                      {product.subcategory?.name}
                    </Link>
                  </>
                )}
              </motion.div>

              <motion.h1 variants={fadeUp} className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white mb-4 sm:mb-6 tracking-tighter leading-[1.1] ${isBn ? 'font-sans' : 'uppercase'}`}>
                {product.name}
              </motion.h1>

              <motion.div variants={fadeUp} className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
                <div className="bg-zinc-50 dark:bg-[#111] px-3 py-1.5 rounded-xl flex items-center gap-2 border border-zinc-100 dark:border-zinc-800 shadow-inner">
                  <StarRating rating={reviewsData?.averageRating || 0} size="small" />
                  <span className="text-sm font-black text-zinc-700 dark:text-zinc-300">
                    {reviewsData?.averageRating ? reviewsData.averageRating.toFixed(1) : 'New'}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  {reviewsData?.totalReviews || 0} {ui.reviews}
                </span>
              </motion.div>

              <motion.div variants={fadeUp} className="mb-8 sm:mb-10 p-6 sm:p-8 bg-zinc-50 dark:bg-[#0d0d0d] rounded-[2rem] sm:rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-inner">
                <p className="text-[8px] sm:text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-2">{ui.price}</p>
                <div className="flex flex-wrap items-end gap-4 sm:gap-6">
                  <span className="text-4xl sm:text-5xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">
                    ৳{discountedPrice.toFixed(2)}
                  </span>
                  {product.discount > 0 && (
                    <div className="flex flex-col pb-1">
                      <span className="text-lg sm:text-xl font-bold text-zinc-400 line-through leading-none">
                        ৳{product.price.toFixed(2)}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1">
                        {ui.save} ৳{(product.price - discountedPrice).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mb-10 sm:mb-12">
                <h3 className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3 sm:mb-4">{ui.about}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium text-xs sm:text-sm">
                  {product.description}
                </p>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5 sm:mt-6">
                    {product.tags.map((tag, idx) => (
                      <span key={idx} className="text-[8px] sm:text-[9px] font-black text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg uppercase tracking-[0.2em] shadow-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div variants={fadeUp} className="mt-auto border-t border-zinc-100 dark:border-zinc-800/80 pt-8">
                {availableSizes.length > 0 ? (
                  <div className="mb-8 sm:mb-10">
                    <h3 className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4">{ui.selectSize}</h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {availableSizes.map((sizeItem) => (
                        <motion.button
                          whileHover={{ scale: selectedSize === sizeItem.size._id ? 1 : 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          key={sizeItem.size._id}
                          onClick={() => {
                            setSelectedSize(sizeItem.size._id);
                            setQuantity(1);
                          }}
                          className={`min-w-[4rem] sm:min-w-[4.5rem] h-10 sm:h-12 px-3 sm:px-4 rounded-[1rem] sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all border-2 ${
                            selectedSize === sizeItem.size._id
                              ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-transparent shadow-md'
                              : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-[#111]'
                          }`}
                        >
                          {sizeItem.size.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-8 sm:mb-10 p-6 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 font-black text-center uppercase tracking-[0.2em] text-[9px] sm:text-[10px] text-zinc-500 shadow-inner">
                    {ui.outOfStock}
                  </div>
                )}

                {availableSizes.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                    <div className="flex items-center justify-between bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-full w-full sm:w-36 h-12 sm:h-14 px-2 shadow-inner">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-lg sm:text-xl font-light text-zinc-400 hover:text-black dark:hover:text-white transition-all">-</button>
                      <span className="font-black text-zinc-900 dark:text-white text-xs sm:text-sm">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(maxQuantity || 1, quantity + 1))} className="w-10 h-10 flex items-center justify-center text-lg sm:text-xl font-light text-zinc-400 hover:text-black dark:hover:text-white transition-all">+</button>
                    </div>

                    <div className="flex flex-1 w-full gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        disabled={isAdding || !selectedSize}
                        className="flex-1 bg-zinc-100 dark:bg-[#111] text-zinc-900 dark:text-white h-12 sm:h-14 rounded-full font-black uppercase tracking-[0.2em] text-[9px] sm:text-[10px] hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all disabled:opacity-50 border border-zinc-200 dark:border-zinc-800"
                      >
                        {isAdding ? '...' : ui.add}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBuyNow}
                        disabled={!selectedSize}
                        className="flex-1 bg-zinc-900 dark:bg-white text-white dark:text-black h-12 sm:h-14 rounded-full font-black uppercase tracking-[0.2em] text-[9px] sm:text-[10px] transition-all disabled:opacity-50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
                      >
                        {ui.buy}
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* ✅ Updated Success Message with "Go to Cart" link */}
                <AnimatePresence>
                  {showAddedToCart && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: 10, height: 0 }}
                      className="mt-4 sm:mt-6 overflow-hidden"
                    >
                      <div className="p-3 sm:p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                        <p className="text-emerald-600 dark:text-emerald-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2">
                          {ui.added}
                        </p>
                        <Link
                          href="/cart"
                          className="inline-block text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300 underline underline-offset-2 hover:text-emerald-800 transition-colors"
                        >
                          {ui.goToCart} →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Service Promises (unchanged) */}
                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-xl sm:text-2xl grayscale opacity-60">✈️</span>
                    <div>
                      <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">{ui.freeShip}</p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-zinc-500">{ui.freeSub}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-xl sm:text-2xl grayscale opacity-60">♻️</span>
                    <div>
                      <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">{ui.ecoReturn}</p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-zinc-500">{ui.ecoSub}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Review Section (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 sm:mt-20"
        >
          <ReviewSection productId={id} onReviewChange={() => { refetchProduct(); refetchReviews(); }} />
        </motion.div>

        {/* Related Products (unchanged) */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-24 sm:mt-32"
          >
            <div className="text-center mb-10 sm:mb-16">
              <p className="text-zinc-500 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.4em] mb-3 sm:mb-4">{ui.relatedSub}</p>
              <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">{ui.relatedTitle}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}