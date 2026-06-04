import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator, TextInput, Alert, Share, Button, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Star,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Heart,
  Share2,
  MessageSquare,
  Send,
  Trash2,
  Edit3,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react-native';
import { showMessage } from 'react-native-flash-message';
import { api, getImageUrl } from '../../lib/api';
import { trackEvent } from '../../lib/tracker';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { getTranslation } from '../../utils/i18n';
import { ProductCard } from '../../components/ui/ProductCard';
import { safeBack } from '../../utils/navigation';

export default function ProductDetailScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { slug } = useLocalSearchParams();
  const lang = useAppStore((s) => s.lang);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const addToCart = useCartStore((s) => s.addToCart);
  const totalCartItems = useCartStore((s) => s.totalItems);
  const wishlistSet = useCartStore((s) => s.wishlistSet);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const setBuyNowItem = useCartStore((s) => s.setBuyNowItem);

  const t = getTranslation('product', lang);

  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const containerWidth = SCREEN_WIDTH - 32;
  const imageScrollRef = useRef<ScrollView>(null);

  // Fetch product data by slug
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['productDetails', slug],
    queryFn: async () => {
      const { data } = await api.get(`/products/details/${slug}`);

      // Dispatch server-side analytics event for ViewContent on detail load
      if (data) {
        trackEvent('ViewContent', {
          content_ids: [data._id],
          content_name: data.name,
          content_type: 'product',
          value: data.price,
        });
      }

      return data;
    },
    enabled: !!slug,
  });

  // Component UI States
  const [selectedSizeId, setSelectedSizeId] = useState<string>('');

  // Auto-select first in-stock size when product loads
  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      const available = product.sizes.find((s: any) => s && s.stock > 0);
      const sizeId = available ? (available.size?._id || available.size) : '';
      if (sizeId) {
        setTimeout(() => {
          setSelectedSizeId(String(sizeId));
        }, 0);
      }
    }
  }, [product]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleThumbnailPress = (idx: number) => {
    setActiveImageIndex(idx);
    imageScrollRef.current?.scrollTo({
      x: idx * containerWidth,
      animated: true,
    });
  };

  const handleImageScrollEnd = (e: any) => {
    const offset = e.nativeEvent.contentOffset.x;
    const idx = Math.round(offset / containerWidth);
    if (idx >= 0 && idx < (product?.images?.length || 0)) {
      setActiveImageIndex(idx);
    }
  };

  const [isDescExpanded, setIsDescExpanded] = useState(true);
  const [isSpecExpanded, setIsSpecExpanded] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  const [reviewsPage, setReviewsPage] = useState(1);
  useEffect(() => {
    setReviewsPage(1);
  }, [product?._id]);

  // Fetch product reviews
  const { data: reviewsData } = useQuery({
    queryKey: ['productReviews', product?._id, reviewsPage],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/product/${product._id}?page=${reviewsPage}&limit=5`);
      return data || {};
    },
    enabled: !!product?._id,
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['relatedProducts', product?._id, product?.category?.slug],
    queryFn: async () => {
      const categorySlug = product?.category?.slug;
      if (!categorySlug) return [];
      const { data } = await api.get(`/products?category=${categorySlug}&limit=8`);
      return (data?.products || [])
        .filter((item: any) => item._id !== product._id)
        .slice(0, 4);
    },
    enabled: !!product?._id && !!product?.category?.slug,
  });

  const resetReviewForm = () => {
    setShowReviewForm(false);
    setIsEditingReview(false);
    setReviewRating(5);
    setReviewComment('');
    setReviewError('');
  };

  const reviewMutation = useMutation({
    mutationFn: async () => {
      if (!product) return null;
      const formData = new FormData();
      formData.append('productId', String(product._id));
      formData.append('rating', String(reviewRating));
      formData.append('comment', reviewComment.trim());

      const userReview = reviewsData?.userReview;
      if (userReview && isEditingReview) {
        const { data } = await api.put(`/reviews/${userReview._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
      }

      const { data } = await api.post('/reviews', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: async () => {
      resetReviewForm();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['productReviews', product?._id] }),
        queryClient.invalidateQueries({ queryKey: ['productDetails', slug] }),
      ]);
      showMessage({
        message: isEditingReview ? 'Review updated' : 'Review published',
        type: 'success',
      });
    },
    onError: (err: any) => {
      setReviewError(err?.response?.data?.message || 'Could not publish review. Please try again.');
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => api.delete(`/reviews/${reviewId}`),
    onSuccess: async () => {
      resetReviewForm();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['productReviews', product?._id] }),
        queryClient.invalidateQueries({ queryKey: ['productDetails', slug] }),
      ]);
      showMessage({ message: 'Review removed', type: 'success' });
    },
    onError: (err: any) => {
      showMessage({
        message: err?.response?.data?.message || 'Could not delete review',
        type: 'danger',
      });
    },
  });

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSizeId) {
      showMessage({
        message: t.selectSize || 'Please select a size',
        type: 'warning',
      });
      return;
    }

    setLoadingCart(true);
    try {
      addToCart(product, selectedSizeId, quantity, isAuthenticated);

      // Dispatch AddToCart analytics
      trackEvent('AddToCart', {
        content_ids: [product._id],
        content_name: product.name,
        value: product.price * quantity,
      });

      showMessage({
        message: t.addToCart ? 'Added to Cart' : 'Item added to your shopping cart!',
        type: 'success',
      });
    } catch {
      showMessage({
        message: 'Could not add item to cart',
        type: 'danger',
      });
    } finally {
      setLoadingCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!selectedSizeId) {
      showMessage({
        message: t.selectSize || 'Please select a size',
        type: 'warning',
      });
      return;
    }

    try {
      // Set buyNowItem — cart page will show ONLY this item
      setBuyNowItem(product, selectedSizeId, quantity);

      trackEvent('AddToCart', {
        content_ids: [product._id],
        content_name: product.name,
        value: product.price * quantity,
      });

      router.push('/(tabs)/cart');
    } catch {
      showMessage({
        message: 'Could not proceed to checkout',
        type: 'danger',
      });
    }
  };

  const handleShareProduct = async () => {
    if (!product) return;
    try {
      await Share.share({
        title: product.name,
        message: `${product.name}\n${product.description || ''}`,
      });
    } catch {
      showMessage({ message: 'Could not open share sheet', type: 'danger' });
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(product, isAuthenticated);
    showMessage({
      message: wishlistSet.has(product._id) ? 'Removed from wishlist' : 'Added to wishlist',
      type: 'success',
    });
  };

  const handleStartReview = () => {
    if (!isAuthenticated) {
      showMessage({ message: 'Please login to write a review', type: 'warning' });
      router.push('/login');
      return;
    }
    setIsEditingReview(false);
    setReviewRating(5);
    setReviewComment('');
    setReviewError('');
    setShowReviewForm(true);
  };

  const handleEditReview = () => {
    const userReview = reviewsData?.userReview;
    if (!userReview) return;
    setIsEditingReview(true);
    setReviewRating(Number(userReview.rating || 5));
    setReviewComment(userReview.comment || '');
    setReviewError('');
    setShowReviewForm(true);
  };

  const handleSubmitReview = () => {
    if (!isAuthenticated) {
      showMessage({ message: 'Please login to write a review', type: 'warning' });
      router.push('/login');
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError('Please write your experience before publishing.');
      return;
    }
    setReviewError('');
    reviewMutation.mutate();
  };

  const handleDeleteReview = () => {
    const userReview = reviewsData?.userReview;
    if (!userReview?._id) return;
    Alert.alert('Delete review', 'Remove your review permanently?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteReviewMutation.mutate(userReview._id),
      },
    ]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#0F0F11" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-lg font-black text-foreground italic mb-4">Product Not Found</Text>
        <Button title="Go Back" onPress={safeBack} className="w-1/2" />
      </SafeAreaView>
    );
  }

  const discount = Number(product.discount || 0);
  const discountedPrice = discount > 0 ? product.price - (product.price * discount) / 100 : product.price;
  const images: string[] = product.images || [];
  const currency = '\u09F3';
  const showReviews = product.showReviews !== false && product.showReviews !== 'false';
  const isFavorited = wishlistSet.has(product._id);

  // Average Rating calculation
  const reviewsList = reviewsData?.reviews || [];
  const userReview = reviewsData?.userReview || null;
  const totalReviews = Number(reviewsData?.totalReviews || product.totalReviews || reviewsList.length || 0);
  const avgRating = Number(reviewsData?.averageRating || product.averageRating || 0).toFixed(1);
  const specs = product.specifications && typeof product.specifications === 'object'
    ? product.specifications
    : {};
  const specificationItems = [
    ['Brand', product.brand],
    ['Material', product.material],
    ['Color', product.color],
    ['Gender', product.gender],
    ['Fit', specs.fit],
    ['Sleeve', specs.sleeve],
    ['Pattern', specs.pattern],
    ['Collar', specs.collar],
  ].filter(([, value]) => Boolean(value));
  const faqItems = Array.isArray(product.faqs) && product.faqs.length > 0
    ? product.faqs
    : [
      {
        question: 'Composition',
        answer: product.material
          ? `Crafted with ${product.material}.`
          : 'Premium selected fabric with comfort-focused finishing.',
      },
      {
        question: 'Maintenance',
        answer: 'Wash gently, avoid bleach, and dry in shade to keep the product fresh longer.',
      },
    ];

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background">
      {/* Top Header Bar */}
      <View className="flex-row items-center justify-between px-4 py-2 bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-900 h-14 z-10">
        <Pressable
          onPress={safeBack}
          className="w-9 h-9 items-center justify-center rounded-full active:scale-95"
        >
          <ArrowLeft size={22} className="text-foreground" />
        </Pressable>

        <Text className="text-base font-black text-foreground uppercase tracking-widest">
          Product Details
        </Text>

        <Pressable
          onPress={() => router.push('/(tabs)/cart')}
          className="w-9 h-9 items-center justify-center rounded-full active:scale-95 relative"
        >
          <ShoppingCart size={22} className="text-foreground" />
          {totalCartItems > 0 ? (
            <View className="absolute top-1 right-1 bg-red-500 rounded-full h-4 min-w-4 px-1 items-center justify-center">
              <Text className="text-white text-[8px] font-black text-center">{totalCartItems}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        {/* ENLARGED Image Gallery Section */}
        <View className="w-full bg-gradient-to-b from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-950">
          {/* Main Large Display */}
          <View className="px-4 pt-6 pb-4">
            <View className="w-full aspect-[3/4] rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl relative">
              {images.length > 0 ? (
                <ScrollView overScrollMode="never"
                  ref={imageScrollRef}
                  horizontal
                  decelerationRate="fast"
                  snapToInterval={containerWidth}
                  snapToAlignment="center"
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={handleImageScrollEnd}
                  scrollEventThrottle={16}
                  style={{ width: '100%', height: '100%' }}
                >
                  {images.map((img, idx) => (
                    <View key={idx} style={{ width: containerWidth }} className="h-full">
                      <Image
                        source={{ uri: getImageUrl(img) }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View className="w-full h-full items-center justify-center bg-slate-100 dark:bg-zinc-800">
                  <Text className="text-slate-400 text-xs font-bold uppercase">No Image Available</Text>
                </View>
              )}

              {/* Discount Badge */}
              {discount > 0 && (
                <View className="absolute top-4 right-4 bg-red-500 rounded-full px-4 py-2 shadow-lg z-20">
                  <Text className="text-white text-[11px] font-black uppercase tracking-wider">
                    {discount}% OFF
                  </Text>
                </View>
              )}
            </View>

            {/* Navigation Dots */}
            {images.length > 1 && (
              <View className="flex-row justify-center gap-2 mt-5">
                {images.map((_, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => handleThumbnailPress(idx)}
                    className={`h-2 rounded-full transition-all ${activeImageIndex === idx
                        ? 'w-6 bg-zinc-900 dark:bg-white'
                        : 'w-2 bg-slate-300 dark:bg-zinc-600'
                      }`}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Horizontal Thumbnail Scroll */}
          {images.length > 1 && (
            <View className="px-4 pb-4">
              <ScrollView overScrollMode="never"
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                contentContainerStyle={{ gap: 12 }}
              >
                {images.map((img, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => handleThumbnailPress(idx)}
                    className={`h-20 w-16 rounded-xl overflow-hidden border-2 active:scale-95 shadow-md flex-shrink-0 ${activeImageIndex === idx
                        ? 'border-zinc-900 dark:border-white ring-2 ring-zinc-900 dark:ring-white ring-offset-2 dark:ring-offset-zinc-950'
                        : 'border-slate-200 dark:border-zinc-800 opacity-60'
                      }`}
                  >
                    <Image
                      source={{ uri: getImageUrl(img) }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Info panel */}
        <View className="p-5 bg-white dark:bg-zinc-950">
          {product.brand ? (
            <Text className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
              {product.brand}
            </Text>
          ) : null}

          <Text className="text-2xl font-black text-foreground mb-3 leading-tight">
            {product.name}
          </Text>

          <View className="flex-row gap-2 mb-4">
            <Pressable
              onPress={handleToggleWishlist}
              className="h-11 px-4 rounded-2xl border border-slate-200 bg-white flex-row items-center justify-center gap-2 active:scale-95"
            >
              <Heart
                size={16}
                color={isFavorited ? '#EF4444' : '#0F172A'}
                fill={isFavorited ? '#EF4444' : 'transparent'}
              />
              <Text className="text-[11px] font-black uppercase" style={{ color: '#0F172A' }}>Wishlist</Text>
            </Pressable>
            <Pressable
              onPress={handleShareProduct}
              className="h-11 px-4 rounded-2xl border border-slate-200 bg-white flex-row items-center justify-center gap-2 active:scale-95"
            >
              <Share2 size={16} color="#0F172A" />
              <Text className="text-[11px] font-black uppercase" style={{ color: '#0F172A' }}>Share</Text>
            </Pressable>
          </View>

          {/* Pricing Row */}
          <View className="flex-row items-baseline gap-2 mb-4">
            <Text className="text-2xl font-black text-foreground italic">
              {currency}{Math.round(discountedPrice).toLocaleString()}
            </Text>
            {discount > 0 ? (
              <>
                <Text className="text-sm font-semibold text-slate-400 line-through">
                  {currency}{Math.round(product.price).toLocaleString()}
                </Text>
                <View className="bg-red-500 py-0.5 px-2 rounded-md">
                  <Text className="text-white text-[9px] font-black uppercase">
                    {discount}% OFF
                  </Text>
                </View>
              </>
            ) : null}
          </View>

          {/* Rating summary */}
          <View className="flex-row items-center gap-1 mb-5">
            <Star size={16} color="#D4AF37" fill="#D4AF37" />
            <Text className="text-sm font-bold text-foreground">{avgRating}</Text>
            <Text className="text-xs font-semibold text-slate-400 dark:text-zinc-500">
              ({totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'})
            </Text>
          </View>

          {/* Divider */}
          <View className="h-px bg-slate-100 dark:bg-zinc-900 my-2" />

          {/* Size Pills */}
          <View className="py-4">
            <Text className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
              {t.selectSize || 'Select Size'}
            </Text>
            <ScrollView overScrollMode="never" horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {product.sizes?.map((sizeObj: any) => {
                const sObj = sizeObj.size || sizeObj;
                const sizeId = sObj._id;
                const isSelected = selectedSizeId === sizeId;
                const isOutOfStock = sizeObj.stock === 0;

                return (
                  <Pressable
                    key={sizeId}
                    disabled={isOutOfStock}
                    onPress={() => setSelectedSizeId(sizeId)}
                    className={`py-2.5 px-5 rounded-xl border items-center justify-center min-w-[55px] ${isOutOfStock
                        ? 'border-slate-100 bg-slate-50 opacity-35 dark:border-zinc-900 dark:bg-zinc-950'
                        : isSelected
                          ? 'bg-primary border-primary dark:bg-white dark:border-white'
                          : 'bg-transparent border-slate-200 dark:border-zinc-800'
                      }`}
                  >
                    <Text
                      className={`text-xs font-bold uppercase ${isOutOfStock
                          ? 'text-slate-300 line-through dark:text-zinc-700'
                          : isSelected
                            ? 'text-white dark:text-black'
                            : 'text-foreground'
                        }`}
                    >
                      {sObj.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Description Accordion */}
          <View className="border-t border-slate-100 dark:border-zinc-900 py-3.5">
            <Pressable
              onPress={() => setIsDescExpanded(!isDescExpanded)}
              className="flex-row justify-between items-center"
            >
              <Text className="text-xs font-black text-foreground uppercase tracking-widest italic">
                {t.description || 'Description'}
              </Text>
              {isDescExpanded ? (
                <ChevronUp size={16} className="text-slate-400" />
              ) : (
                <ChevronDown size={16} className="text-slate-400" />
              )}
            </Pressable>
            {isDescExpanded ? (
              <Text className="text-sm font-medium text-slate-600 dark:text-zinc-400 mt-2.5 leading-relaxed">
                {product.description || 'No description provided.'}
              </Text>
            ) : null}
          </View>

          {/* Spec details accordion */}
          {specificationItems.length > 0 ? (
            <View className="border-t border-slate-100 dark:border-zinc-900 py-3.5">
              <Pressable
                onPress={() => setIsSpecExpanded(!isSpecExpanded)}
                className="flex-row justify-between items-center"
              >
                <Text className="text-xs font-black text-foreground uppercase tracking-widest italic">
                  Specifications
                </Text>
                {isSpecExpanded ? (
                  <ChevronUp size={16} className="text-slate-400" />
                ) : (
                  <ChevronDown size={16} className="text-slate-400" />
                )}
              </Pressable>
              {isSpecExpanded ? (
                <View className="mt-3 flex-row flex-wrap" style={{ gap: 8 }}>
                  {specificationItems.map(([label, value]) => (
                    <View key={label} style={{ width: '48%' }}>
                      <View className="rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-3 min-h-[66px]">
                        <Text className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">
                          {label}
                        </Text>
                        <Text className="text-xs font-black text-foreground" numberOfLines={2}>
                          {String(value)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}

          <View className="border-t border-slate-100 dark:border-zinc-900 py-4">
            <View className="flex-row flex-wrap" style={{ gap: 8 }}>
              {[
                { icon: ShieldCheck, title: 'Authentic', desc: 'Verified quality' },
                { icon: Truck, title: 'Express', desc: 'Fast delivery' },
                { icon: RotateCcw, title: 'Returns', desc: 'Easy support' },
                { icon: Star, title: 'Curated', desc: 'Picked collection' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <View key={item.title} style={{ width: '48%' }}>
                    <View className="rounded-2xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 p-3">
                      <View className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-950 items-center justify-center mb-2">
                        <Icon size={16} color="#0F172A" />
                      </View>
                      <Text className="text-[10px] font-black uppercase text-foreground">
                        {item.title}
                      </Text>
                      <Text className="text-[9px] font-semibold text-slate-400 dark:text-zinc-500 mt-0.5">
                        {item.desc}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {faqItems.length > 0 ? (
            <View className="border-t border-slate-100 dark:border-zinc-900 py-4">
              <Text className="text-xs font-black text-foreground uppercase tracking-widest italic mb-3">
                Product Notes
              </Text>
              {faqItems.map((faq: any, idx: number) => (
                <View
                  key={`${faq.question || 'faq'}-${idx}`}
                  className="rounded-2xl bg-slate-50 dark:bg-zinc-900/70 border border-slate-100 dark:border-zinc-800 p-3.5 mb-2"
                >
                  <Text className="text-[10px] font-black uppercase tracking-wider text-foreground mb-1.5">
                    {faq.question}
                  </Text>
                  <Text className="text-xs font-semibold text-slate-500 dark:text-zinc-400 leading-normal">
                    {faq.answer}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {showReviews ? (
            <View className="border-t border-slate-100 dark:border-zinc-900 py-4 mb-4">
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-xs font-black text-foreground uppercase tracking-widest italic">
                    {t.reviews || 'Customer Reviews'}
                  </Text>
                  <View className="flex-row items-center gap-1 mt-1">
                    <Star size={13} color="#D4AF37" fill="#D4AF37" />
                    <Text className="text-xs font-black text-foreground">{avgRating}</Text>
                    <Text className="text-[10px] font-bold text-slate-400">
                      {totalReviews} reports
                    </Text>
                  </View>
                </View>

                {!userReview && !showReviewForm ? (
                  <Pressable
                    onPress={handleStartReview}
                    className="h-10 px-3 rounded-2xl bg-zinc-900 flex-row items-center gap-2 active:scale-95"
                  >
                    <MessageSquare size={14} color="#FFFFFF" />
                    <Text className="text-[10px] font-black text-white uppercase">Review</Text>
                  </Pressable>
                ) : null}
              </View>

              {userReview && !showReviewForm ? (
                <View className="rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 p-3.5 mb-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                      Your Review
                    </Text>
                    <View className="flex-row gap-2">
                      <Pressable onPress={handleEditReview} className="w-8 h-8 rounded-full bg-white dark:bg-zinc-950 items-center justify-center">
                        <Edit3 size={13} color="#0F172A" />
                      </Pressable>
                      <Pressable onPress={handleDeleteReview} className="w-8 h-8 rounded-full bg-white dark:bg-zinc-950 items-center justify-center">
                        <Trash2 size={13} color="#EF4444" />
                      </Pressable>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={13}
                        color="#D4AF37"
                        fill={star <= Number(userReview.rating || 0) ? '#D4AF37' : 'transparent'}
                      />
                    ))}
                  </View>
                  <Text className="text-xs font-semibold text-slate-600 dark:text-zinc-300 leading-normal">
                    {userReview.comment}
                  </Text>
                </View>
              ) : null}

              {showReviewForm ? (
                <View className="rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-4 mb-4">
                  <Text className="text-xs font-black text-foreground uppercase tracking-widest mb-3">
                    {isEditingReview ? 'Update Review' : 'Share Your Experience'}
                  </Text>
                  <View className="flex-row gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Pressable key={star} onPress={() => setReviewRating(star)} className="active:scale-90">
                        <Star
                          size={26}
                          color="#D4AF37"
                          fill={star <= reviewRating ? '#D4AF37' : 'transparent'}
                        />
                      </Pressable>
                    ))}
                  </View>
                  <TextInput
                    value={reviewComment}
                    onChangeText={setReviewComment}
                    placeholder="Write your product experience..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    textAlignVertical="top"
                    className="min-h-[112px] rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-3 text-sm font-semibold text-foreground"
                  />
                  {reviewError ? (
                    <Text className="text-xs font-bold text-red-500 mt-2">{reviewError}</Text>
                  ) : null}
                  <View className="flex-row gap-2 mt-4">
                    <Pressable
                      onPress={resetReviewForm}
                      className="h-11 px-4 rounded-2xl border border-slate-200 dark:border-zinc-800 items-center justify-center"
                    >
                      <Text className="text-[10px] font-black uppercase text-foreground">Cancel</Text>
                    </Pressable>
                    <Pressable
                      onPress={handleSubmitReview}
                      disabled={reviewMutation.isPending}
                      className="h-11 flex-1 rounded-2xl bg-zinc-900 flex-row items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send size={14} color="#FFFFFF" />
                      <Text className="text-[10px] font-black uppercase text-white">
                        {reviewMutation.isPending ? 'Publishing...' : 'Publish'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : null}

              {reviewsList.length === 0 ? (
                <Text className="text-xs font-semibold text-slate-400 dark:text-zinc-500 italic">
                  {t.noReviews || 'No reviews yet for this product.'}
                </Text>
              ) : (
                <>
                  {reviewsList.map((rev: any) => (
                    <View key={rev._id} className="mb-3 bg-slate-50 dark:bg-zinc-900/40 p-3.5 rounded-2xl">
                      <View className="flex-row justify-between items-center mb-1.5">
                        <Text className="text-xs font-bold text-foreground">
                          {rev.user?.name || 'Customer'}
                        </Text>
                        <View className="flex-row items-center">
                          <Star size={10} color="#D4AF37" fill="#D4AF37" />
                          <Text className="text-[10px] font-bold text-foreground ml-1">
                            {rev.rating || 5}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-xs font-semibold text-slate-500 dark:text-zinc-400 leading-normal">
                        {rev.comment}
                      </Text>
                    </View>
                  ))}

                  {/* Reviews Pagination Controls */}
                  {reviewsData?.pages && reviewsData.pages > 1 && (
                    <View className="flex-row items-center justify-between mt-4 px-1">
                      <Pressable
                        onPress={() => setReviewsPage(prev => Math.max(prev - 1, 1))}
                        disabled={reviewsPage === 1}
                        className={`h-9 px-4 rounded-xl items-center justify-center border ${
                          reviewsPage === 1
                            ? 'border-slate-100 dark:border-zinc-900 bg-slate-50 dark:bg-zinc-950 opacity-40'
                            : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 active:scale-95'
                        }`}
                      >
                        <Text className={`text-[10px] font-black uppercase ${
                          reviewsPage === 1 ? 'text-slate-300 dark:text-zinc-700' : 'text-foreground'
                        }`}>
                          Previous
                        </Text>
                      </Pressable>

                      <Text className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                        {reviewsPage} / {reviewsData.pages}
                      </Text>

                      <Pressable
                        onPress={() => setReviewsPage(prev => Math.min(prev + 1, reviewsData.pages))}
                        disabled={reviewsPage >= reviewsData.pages}
                        className={`h-9 px-4 rounded-xl items-center justify-center border ${
                          reviewsPage >= reviewsData.pages
                            ? 'border-slate-100 dark:border-zinc-900 bg-slate-50 dark:bg-zinc-950 opacity-40'
                            : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 active:scale-95'
                        }`}
                      >
                        <Text className={`text-[10px] font-black uppercase ${
                          reviewsPage >= reviewsData.pages ? 'text-slate-300 dark:text-zinc-700' : 'text-foreground'
                        }`}>
                          Next
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </>
              )}
            </View>
          ) : null}
        </View>

        {relatedProducts.length > 0 ? (
          <View className="px-4 py-6 bg-background">
            <Text className="text-xl font-black text-foreground uppercase italic mb-4">
              Related Products
            </Text>
            <View className="-mx-1 flex-row flex-wrap">
              {relatedProducts.map((item: any) => (
                <View key={item._id} className="w-1/2 p-1">
                  <ProductCard product={item} className="m-0" />
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Sticky Bottom Panel */}
      <View className="px-5 py-4 border-t border-slate-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex-col gap-4">
        {/* Row 1: Quantity selector */}
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
            Quantity
          </Text>
          <View className="flex-row items-center bg-slate-50 dark:bg-zinc-900 rounded-2xl py-1 px-1.5 border border-slate-100 dark:border-zinc-800 h-10">
            <Pressable
              onPress={() => {
                if (quantity > 1) setQuantity(quantity - 1);
              }}
              className="w-7 h-7 items-center justify-center rounded-lg bg-white dark:bg-zinc-950 border border-slate-150 dark:border-zinc-800/60"
            >
              <Minus size={12} className="text-foreground" />
            </Pressable>

            <Text className="text-xs font-black text-foreground px-4 text-center min-w-[30px]">
              {quantity}
            </Text>

            <Pressable
              onPress={() => setQuantity(quantity + 1)}
              className="w-7 h-7 items-center justify-center rounded-lg bg-white dark:bg-zinc-950 border border-slate-150 dark:border-zinc-800/60"
            >
              <Plus size={12} className="text-foreground" />
            </Pressable>
          </View>
        </View>

        {/* Row 2: Action Buttons */}
        <View className="flex-row gap-3 items-center">
          {/* Wishlist toggle */}
          <Pressable
            onPress={handleToggleWishlist}
            className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 items-center justify-center active:scale-95"
          >
            <Heart
              size={20}
              color={isFavorited ? '#EF4444' : '#64748B'}
              fill={isFavorited ? '#EF4444' : 'transparent'}
            />
          </Pressable>

          {/* Add to Cart */}
          <Pressable
            onPress={handleAddToCart}
            disabled={loadingCart}
            className="flex-1 h-12 rounded-2xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 items-center justify-center active:scale-95"
            style={{ opacity: loadingCart ? 0.5 : 1 }}
          >
            {loadingCart ? (
              <ActivityIndicator size="small" color="#0F172A" />
            ) : (
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                className="text-[10px] font-black uppercase text-foreground tracking-wider px-1 text-center"
              >
                {t.addToCart || 'Add to Cart'}
              </Text>
            )}
          </Pressable>

          {/* Buy Now */}
          <Pressable
            onPress={handleBuyNow}
            className="flex-1 h-12 rounded-2xl bg-zinc-900 dark:bg-white items-center justify-center active:scale-95 px-1"
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              className="text-[10px] font-black uppercase text-white dark:text-zinc-900 tracking-wider text-center"
            >
              Buy Now
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
