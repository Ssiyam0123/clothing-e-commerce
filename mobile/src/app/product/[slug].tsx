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
import { getBrandTokens, withAlpha } from '../../constants/designSystem';

export default function ProductDetailScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { slug } = useLocalSearchParams();
  const productSlug = Array.isArray(slug) ? slug[0] : slug;
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const tokens = getBrandTokens(theme);
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
    queryKey: ['productDetails', productSlug],
    queryFn: async () => {
      const { data } = await api.get(`/products/details/${productSlug}`);

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
    enabled: !!productSlug,
    placeholderData: () => queryClient.getQueryData(['productPreview', productSlug]),
    staleTime: 30 * 1000,
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

  const [reviewsPager, setReviewsPager] = useState({ productId: '', page: 1 });
  const reviewsPage = reviewsPager.productId === product?._id ? reviewsPager.page : 1;
  const setReviewsPage = (nextPage: number | ((page: number) => number)) => {
    setReviewsPager((current) => {
      const currentProductId = product?._id || '';
      const currentPage = current.productId === currentProductId ? current.page : 1;
      const page = typeof nextPage === 'function' ? nextPage(currentPage) : nextPage;
      return { productId: currentProductId, page };
    });
  };

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
        queryClient.invalidateQueries({ queryKey: ['productDetails', productSlug] }),
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
        queryClient.invalidateQueries({ queryKey: ['productDetails', productSlug] }),
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
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: tokens.background }}>
        <ActivityIndicator size="large" color={tokens.primary} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center p-6" style={{ backgroundColor: tokens.background }}>
        <Text className="text-lg font-black italic mb-4" style={{ color: tokens.text }}>Product Not Found</Text>
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
  const detailBg = tokens.background;
  const detailSurface = tokens.surface;
  const detailSoft = tokens.surfaceSoft;
  const dangerColor = tokens.danger;
  const goldColor = tokens.warning;
  const detailText = tokens.text;
  const detailMuted = tokens.textSecondary;
  const detailBorder = tokens.border;
  const detailPrimary = tokens.primary;
  const onPrimary = tokens.onPrimary;
  const selectedSoft = withAlpha(tokens.primary, 0.1);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: detailBg }}>
      {/* Top Header Bar */}
      <View
        className="z-10 h-14 flex-row items-center justify-between border-b px-4 py-2"
        style={{ backgroundColor: tokens.nav, borderBottomColor: detailBorder }}
      >
        <Pressable
          onPress={safeBack}
          className="w-9 h-9 items-center justify-center rounded-full active:scale-95"
        >
          <ArrowLeft size={22} color={tokens.navText} />
        </Pressable>

        <Text className="text-base font-black uppercase tracking-widest" style={{ color: tokens.navText }}>
          Product Details
        </Text>

        <Pressable
          onPress={() => router.push('/(tabs)/cart')}
          className="w-9 h-9 items-center justify-center rounded-full active:scale-95 relative"
        >
          <ShoppingCart size={22} color={tokens.navText} />
          {totalCartItems > 0 ? (
            <View className="absolute top-1 right-1 rounded-full h-4 min-w-4 px-1 items-center justify-center" style={{ backgroundColor: dangerColor }}>
              <Text className="text-[8px] font-black text-center" style={{ color: onPrimary }}>{totalCartItems}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        {/* ENLARGED Image Gallery Section */}
        <View className="w-full" style={{ backgroundColor: detailBg }}>
          {/* Main Large Display */}
          <View className="px-4 pt-6 pb-4">
            <View
              className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border shadow-xl"
              style={{ backgroundColor: detailSurface, borderColor: detailBorder }}
            >
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
                <View className="h-full w-full items-center justify-center" style={{ backgroundColor: detailSoft }}>
                  <Text className="text-xs font-bold uppercase" style={{ color: detailMuted }}>No Image Available</Text>
                </View>
              )}

              {/* Discount Badge */}
              {discount > 0 && (
                <View className="absolute top-4 right-4 rounded-full px-4 py-2 shadow-lg z-20" style={{ backgroundColor: dangerColor }}>
                  <Text className="text-[11px] font-black uppercase tracking-wider" style={{ color: onPrimary }}>
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
                    className={`h-2 rounded-full transition-all ${activeImageIndex === idx ? 'w-6' : 'w-2'}`}
                    style={{ backgroundColor: activeImageIndex === idx ? detailPrimary : detailBorder }}
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
                    className={`h-20 w-16 rounded-xl overflow-hidden border-2 active:scale-95 shadow-md flex-shrink-0 ${activeImageIndex === idx ? '' : 'opacity-60'}`}
                    style={{ borderColor: activeImageIndex === idx ? detailPrimary : detailBorder }}
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
        <View className="p-5" style={{ backgroundColor: detailSurface }}>
          {product.brand ? (
            <Text className="mb-1.5 text-[10px] font-black uppercase tracking-widest" style={{ color: detailMuted }}>
              {product.brand}
            </Text>
          ) : null}

          <Text className="mb-3 text-2xl font-black leading-tight" style={{ color: detailText }}>
            {product.name}
          </Text>

          <View className="flex-row gap-2 mb-4">
            <Pressable
              onPress={handleToggleWishlist}
              className="h-11 flex-row items-center justify-center gap-2 rounded-2xl border px-4 active:scale-95"
              style={{ backgroundColor: detailSurface, borderColor: detailBorder }}
            >
              <Heart
                size={16}
                color={isFavorited ? dangerColor : detailText}
                fill={isFavorited ? dangerColor : 'transparent'}
              />
              <Text className="text-[11px] font-black uppercase" style={{ color: detailText }}>Wishlist</Text>
            </Pressable>
            <Pressable
              onPress={handleShareProduct}
              className="h-11 flex-row items-center justify-center gap-2 rounded-2xl border px-4 active:scale-95"
              style={{ backgroundColor: detailSurface, borderColor: detailBorder }}
            >
              <Share2 size={16} color={detailText} />
              <Text className="text-[11px] font-black uppercase" style={{ color: detailText }}>Share</Text>
            </Pressable>
          </View>

          {/* Pricing Row */}
          <View className="flex-row items-baseline gap-2 mb-4">
            <Text className="text-2xl font-black italic" style={{ color: detailText }}>
              {currency}{Math.round(discountedPrice).toLocaleString()}
            </Text>
            {discount > 0 ? (
              <>
                <Text className="text-sm font-semibold line-through" style={{ color: detailMuted }}>
                  {currency}{Math.round(product.price).toLocaleString()}
                </Text>
                <View className="py-0.5 px-2 rounded-md" style={{ backgroundColor: dangerColor }}>
                  <Text className="text-[9px] font-black uppercase" style={{ color: onPrimary }}>
                    {discount}% OFF
                  </Text>
                </View>
              </>
            ) : null}
          </View>

          {/* Rating summary */}
          <View className="flex-row items-center gap-1 mb-5">
            <Star size={16} color={goldColor} fill={goldColor} />
            <Text className="text-sm font-bold" style={{ color: detailText }}>{avgRating}</Text>
            <Text className="text-xs font-semibold" style={{ color: detailMuted }}>
              ({totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'})
            </Text>
          </View>

          {/* Divider */}
          <View className="my-2 h-px" style={{ backgroundColor: detailBorder }} />

          {/* Size Pills */}
          <View className="py-4">
            <Text className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: detailMuted }}>
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
                    className="min-w-[55px] items-center justify-center rounded-xl border px-5 py-2.5"
                    style={{
                      backgroundColor: isOutOfStock ? detailSoft : isSelected ? detailPrimary : selectedSoft,
                      borderColor: isSelected ? detailPrimary : detailBorder,
                      opacity: isOutOfStock ? 0.35 : 1,
                    }}
                  >
                    <Text
                      className={`text-xs font-bold uppercase ${isOutOfStock ? 'line-through' : ''}`}
                      style={{ color: isSelected ? onPrimary : isOutOfStock ? detailMuted : detailText }}
                    >
                      {sObj.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Description Accordion */}
          <View className="border-t py-3.5" style={{ borderTopColor: detailBorder }}>
            <Pressable
              onPress={() => setIsDescExpanded(!isDescExpanded)}
              className="flex-row justify-between items-center"
            >
              <Text className="text-xs font-black uppercase tracking-widest italic" style={{ color: detailText }}>
                {t.description || 'Description'}
              </Text>
              {isDescExpanded ? (
                <ChevronUp size={16} color={detailMuted} />
              ) : (
                <ChevronDown size={16} color={detailMuted} />
              )}
            </Pressable>
            {isDescExpanded ? (
              <Text className="mt-2.5 text-sm font-medium leading-relaxed" style={{ color: detailMuted }}>
                {product.description || 'No description provided.'}
              </Text>
            ) : null}
          </View>

          {/* Spec details accordion */}
          {specificationItems.length > 0 ? (
            <View className="border-t py-3.5" style={{ borderTopColor: detailBorder }}>
              <Pressable
                onPress={() => setIsSpecExpanded(!isSpecExpanded)}
                className="flex-row justify-between items-center"
              >
                <Text className="text-xs font-black uppercase tracking-widest italic" style={{ color: detailText }}>
                  Specifications
                </Text>
                {isSpecExpanded ? (
                  <ChevronUp size={16} color={detailMuted} />
                ) : (
                  <ChevronDown size={16} color={detailMuted} />
                )}
              </Pressable>
              {isSpecExpanded ? (
                <View className="mt-3 flex-row flex-wrap" style={{ gap: 8 }}>
                  {specificationItems.map(([label, value]) => (
                    <View key={label} style={{ width: '48%' }}>
                      <View className="rounded-2xl border p-3 min-h-[66px]" style={{ backgroundColor: detailSoft, borderColor: detailBorder }}>
                        <Text className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: detailMuted }}>
                          {label}
                        </Text>
                        <Text className="text-xs font-black" style={{ color: detailText }} numberOfLines={2}>
                          {String(value)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}

          <View className="border-t py-4" style={{ borderTopColor: detailBorder }}>
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
                    <View className="rounded-2xl border p-3" style={{ backgroundColor: detailSoft, borderColor: detailBorder }}>
                      <View className="w-9 h-9 rounded-xl items-center justify-center mb-2" style={{ backgroundColor: detailSurface }}>
                        <Icon size={16} color={detailPrimary} />
                      </View>
                      <Text className="text-[10px] font-black uppercase" style={{ color: detailText }}>
                        {item.title}
                      </Text>
                      <Text className="text-[9px] font-semibold mt-0.5" style={{ color: detailMuted }}>
                        {item.desc}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {faqItems.length > 0 ? (
            <View className="border-t py-4" style={{ borderTopColor: detailBorder }}>
              <Text className="text-xs font-black uppercase tracking-widest italic mb-3" style={{ color: detailText }}>
                Product Notes
              </Text>
              {faqItems.map((faq: any, idx: number) => (
                <View
                  key={`${faq.question || 'faq'}-${idx}`}
                  className="rounded-2xl border p-3.5 mb-2"
                  style={{ backgroundColor: detailSoft, borderColor: detailBorder }}
                >
                  <Text className="text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color: detailText }}>
                    {faq.question}
                  </Text>
                  <Text className="text-xs font-semibold leading-normal" style={{ color: detailMuted }}>
                    {faq.answer}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {showReviews ? (
            <View className="border-t py-4 mb-4" style={{ borderTopColor: detailBorder }}>
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-xs font-black uppercase tracking-widest italic" style={{ color: detailText }}>
                    {t.reviews || 'Customer Reviews'}
                  </Text>
                  <View className="flex-row items-center gap-1 mt-1">
                    <Star size={13} color={goldColor} fill={goldColor} />
                    <Text className="text-xs font-black" style={{ color: detailText }}>{avgRating}</Text>
                    <Text className="text-[10px] font-bold" style={{ color: detailMuted }}>
                      {totalReviews} reports
                    </Text>
                  </View>
                </View>

                {!userReview && !showReviewForm ? (
                  <Pressable
                    onPress={handleStartReview}
                    className="h-10 px-3 rounded-2xl flex-row items-center gap-2 active:scale-95"
                    style={{ backgroundColor: detailPrimary }}
                  >
                    <MessageSquare size={14} color={onPrimary} />
                    <Text className="text-[10px] font-black uppercase" style={{ color: onPrimary }}>Review</Text>
                  </Pressable>
                ) : null}
              </View>

              {userReview && !showReviewForm ? (
                <View className="rounded-2xl border p-3.5 mb-4" style={{ backgroundColor: withAlpha(tokens.accent, 0.12), borderColor: withAlpha(tokens.accent, 0.28) }}>
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-[10px] font-black uppercase tracking-wider" style={{ color: detailPrimary }}>
                      Your Review
                    </Text>
                    <View className="flex-row gap-2">
                      <Pressable onPress={handleEditReview} className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: detailSurface }}>
                        <Edit3 size={13} color={detailPrimary} />
                      </Pressable>
                      <Pressable onPress={handleDeleteReview} className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: detailSurface }}>
                        <Trash2 size={13} color={dangerColor} />
                      </Pressable>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={13}                          color={goldColor}
                          fill={star <= Number(userReview.rating || 0) ? goldColor : 'transparent'}
                      />
                    ))}
                  </View>
                  <Text className="text-xs font-semibold leading-normal" style={{ color: detailMuted }}>
                    {userReview.comment}
                  </Text>
                </View>
              ) : null}

              {showReviewForm ? (
                <View className="rounded-3xl border p-4 mb-4" style={{ backgroundColor: detailSoft, borderColor: detailBorder }}>
                  <Text className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: detailText }}>
                    {isEditingReview ? 'Update Review' : 'Share Your Experience'}
                  </Text>
                  <View className="flex-row gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Pressable key={star} onPress={() => setReviewRating(star)} className="active:scale-90">
                        <Star
                          size={26}
                          color={goldColor}
                          fill={star <= reviewRating ? goldColor : 'transparent'}
                        />
                      </Pressable>
                    ))}
                  </View>
                  <TextInput
                    value={reviewComment}
                    onChangeText={setReviewComment}
                    placeholder="Write your product experience..."
                    placeholderTextColor={detailMuted}
                    multiline
                    textAlignVertical="top"
                    className="min-h-[112px] rounded-2xl border p-3 text-sm font-semibold"
                    style={{ backgroundColor: detailSurface, borderColor: detailBorder, color: detailText }}
                  />
                  {reviewError ? (
                    <Text className="text-xs font-bold mt-2" style={{ color: dangerColor }}>{reviewError}</Text>
                  ) : null}
                  <View className="flex-row gap-2 mt-4">
                    <Pressable
                      onPress={resetReviewForm}
                      className="h-11 px-4 rounded-2xl border items-center justify-center"
                      style={{ borderColor: detailBorder }}
                    >
                      <Text className="text-[10px] font-black uppercase" style={{ color: detailText }}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      onPress={handleSubmitReview}
                      disabled={reviewMutation.isPending}
                      className="h-11 flex-1 rounded-2xl flex-row items-center justify-center gap-2 disabled:opacity-50"
                      style={{ backgroundColor: detailPrimary }}
                    >
                      <Send size={14} color={onPrimary} />
                      <Text className="text-[10px] font-black uppercase" style={{ color: onPrimary }}>
                        {reviewMutation.isPending ? 'Publishing...' : 'Publish'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : null}

              {reviewsList.length === 0 ? (
                <Text className="text-xs font-semibold italic" style={{ color: detailMuted }}>
                  {t.noReviews || 'No reviews yet for this product.'}
                </Text>
              ) : (
                <>
                  {reviewsList.map((rev: any) => (
                    <View key={rev._id} className="mb-3 p-3.5 rounded-2xl" style={{ backgroundColor: detailSoft }}>
                      <View className="flex-row justify-between items-center mb-1.5">
                        <Text className="text-xs font-bold" style={{ color: detailText }}>
                          {rev.user?.name || 'Customer'}
                        </Text>
                        <View className="flex-row items-center">
                          <Star size={10} color={goldColor} fill={goldColor} />
                          <Text className="text-[10px] font-bold ml-1" style={{ color: detailText }}>
                            {rev.rating || 5}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-xs font-semibold leading-normal" style={{ color: detailMuted }}>
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
                        className={`h-9 px-4 rounded-xl items-center justify-center border ${reviewsPage === 1 ? 'opacity-40' : 'active:scale-95'}`}
                        style={{ backgroundColor: reviewsPage === 1 ? detailSoft : detailSurface, borderColor: detailBorder }}
                      >
                        <Text className="text-[10px] font-black uppercase" style={{ color: reviewsPage === 1 ? detailMuted : detailText }}>
                          Previous
                        </Text>
                      </Pressable>

                      <Text className="text-xs font-bold" style={{ color: detailMuted }}>
                        {reviewsPage} / {reviewsData.pages}
                      </Text>

                      <Pressable
                        onPress={() => setReviewsPage(prev => Math.min(prev + 1, reviewsData.pages))}
                        disabled={reviewsPage >= reviewsData.pages}
                        className={`h-9 px-4 rounded-xl items-center justify-center border ${reviewsPage >= reviewsData.pages ? 'opacity-40' : 'active:scale-95'}`}
                        style={{ backgroundColor: reviewsPage >= reviewsData.pages ? detailSoft : detailSurface, borderColor: detailBorder }}
                      >
                        <Text className="text-[10px] font-black uppercase" style={{ color: reviewsPage >= reviewsData.pages ? detailMuted : detailText }}>
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
          <View className="px-4 py-6" style={{ backgroundColor: detailBg }}>
            <Text className="text-xl font-black uppercase italic mb-4" style={{ color: detailText }}>
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
      <View
        className="flex-col gap-4 border-t px-5 py-4"
        style={{ backgroundColor: detailSurface, borderTopColor: detailBorder }}
      >
        {/* Row 1: Quantity selector */}
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-bold uppercase tracking-wider" style={{ color: detailMuted }}>
            Quantity
          </Text>
          <View
            className="h-10 flex-row items-center rounded-2xl border px-1.5 py-1"
            style={{ backgroundColor: detailSoft, borderColor: detailBorder }}
          >
            <Pressable
              onPress={() => {
                if (quantity > 1) setQuantity(quantity - 1);
              }}
              className="h-7 w-7 items-center justify-center rounded-lg border"
              style={{ backgroundColor: detailSurface, borderColor: detailBorder }}
            >
              <Minus size={12} color={detailText} />
            </Pressable>

            <Text className="min-w-[30px] px-4 text-center text-xs font-black" style={{ color: detailText }}>
              {quantity}
            </Text>

            <Pressable
              onPress={() => setQuantity(quantity + 1)}
              className="h-7 w-7 items-center justify-center rounded-lg border"
              style={{ backgroundColor: detailSurface, borderColor: detailBorder }}
            >
              <Plus size={12} color={detailText} />
            </Pressable>
          </View>
        </View>

        {/* Row 2: Action Buttons */}
        <View className="flex-row gap-3 items-center">
          {/* Wishlist toggle */}
          <Pressable
            onPress={handleToggleWishlist}
            className="h-12 w-12 items-center justify-center rounded-2xl border active:scale-95"
            style={{ backgroundColor: detailSurface, borderColor: detailBorder }}
          >
            <Heart
              size={20}
              color={isFavorited ? dangerColor : detailMuted}
              fill={isFavorited ? dangerColor : 'transparent'}
            />
          </Pressable>

          {/* Add to Cart */}
          <Pressable
            onPress={handleAddToCart}
            disabled={loadingCart}
            className="h-12 flex-1 items-center justify-center rounded-2xl border active:scale-95"
            style={{ backgroundColor: detailSurface, borderColor: detailBorder, opacity: loadingCart ? 0.5 : 1 }}
          >
            {loadingCart ? (
              <ActivityIndicator size="small" color={detailText} />
            ) : (
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                className="px-1 text-center text-[10px] font-black uppercase tracking-wider"
                style={{ color: detailText }}
              >
                {t.addToCart || 'Add to Cart'}
              </Text>
            )}
          </Pressable>

          {/* Buy Now */}
          <Pressable
            onPress={handleBuyNow}
            className="h-12 flex-1 items-center justify-center rounded-2xl px-1 active:scale-95"
            style={{ backgroundColor: detailPrimary }}
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              className="text-center text-[10px] font-black uppercase tracking-wider"
              style={{ color: onPrimary }}
            >
              Buy Now
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
