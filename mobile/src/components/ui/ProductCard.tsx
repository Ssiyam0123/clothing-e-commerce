import React, { memo, useCallback, useState } from 'react';
import { Pressable, Text, View, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Heart, Star, ImageOff, ShoppingCart, Zap, Plus, Minus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { showMessage } from 'react-native-flash-message';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { getImageUrl } from '../../lib/api';
import { brandColors, getBrandScheme } from '../../constants/designSystem';

interface Product {
  _id: string;
  name: string;
  slug: string;
  images?: string[];
  price: number;
  discount?: number;
  brand?: string;
  category?: { name: string; slug: string };
  averageRating?: number;
  totalReviews?: number;
  showReviews?: boolean | string;
  isNew?: boolean;
  isFeatured?: boolean;
  [key: string]: any;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

function ProductCardBase({ product, className = '' }: ProductCardProps) {
  const router = useRouter();
  const theme = useAppStore((s) => s.theme);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isFavorited = useCartStore(
    useCallback((s) => s.wishlistSet.has(product._id), [product._id]),
  );
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const addToCart = useCartStore((s) => s.addToCart);
  const setBuyNowItem = useCartStore((s) => s.setBuyNowItem);

  const productPrice = Number(product.price || 0);
  const discount = Number(product.discount || 0);
  const discountedPrice =
    discount > 0 ? productPrice - (productPrice * discount) / 100 : productPrice;
  const avgRating = Number(product.averageRating || 0);
  const reviewCount = product.totalReviews || 0;
  const showReviews = product.showReviews !== false && product.showReviews !== 'false';
  const currency = '\u09F3';
  const colors = getBrandScheme(theme);
  const cardBg = theme === 'dark' ? brandColors.primary : colors.surface;
  const cardText = theme === 'dark' ? '#FFFFFF' : colors.text;
  const cardMuted = theme === 'dark' ? '#D8C8BA' : colors.textSecondary;
  const cardBorder = theme === 'dark' ? '#5B4331' : colors.border;

  const handlePress = () => {
    router.push(`/product/${product.slug}`);
  };

  const handleWishlist = (event: any) => {
    event?.stopPropagation?.();
    toggleWishlist(product, isAuthenticated);
  };

  const getDefaultSizeId = () => {
    const availableSize = product.sizes?.find((item: any) => Number(item.stock ?? 1) > 0);
    const rawSize = availableSize?.size || product.sizes?.[0]?.size || product.sizes?.[0];
    if (!rawSize) return '';
    return typeof rawSize === 'object' ? String(rawSize._id || rawSize.id || '') : String(rawSize);
  };

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectorAction, setSelectorAction] = useState<'cart' | 'buy'>('cart');
  const [selectedSizeId, setSelectedSizeId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loadingCart, setLoadingCart] = useState(false);

  const handleAddToCart = (event: any) => {
    event?.stopPropagation?.();
    setSelectorAction('cart');
    setSelectedSizeId(getDefaultSizeId());
    setQuantity(1);
    setIsSelectorOpen(true);
  };

  const handleInstantBuy = (event: any) => {
    event?.stopPropagation?.();
    setSelectorAction('buy');
    setSelectedSizeId(getDefaultSizeId());
    setQuantity(1);
    setIsSelectorOpen(true);
  };

  const executeAddToCart = () => {
    setLoadingCart(true);
    try {
      addToCart(product, selectedSizeId || '', quantity, isAuthenticated);
      showMessage({ message: 'Added to cart', type: 'success' });
      setIsSelectorOpen(false);
    } catch {
      showMessage({ message: 'Could not add item to cart', type: 'danger' });
    } finally {
      setLoadingCart(false);
    }
  };

  const executeInstantBuy = () => {
    try {
      setBuyNowItem(product, selectedSizeId || '', quantity);
      setIsSelectorOpen(false);
      router.push('/(tabs)/cart');
    } catch {
      showMessage({ message: 'Could not proceed to checkout', type: 'danger' });
    }
  };

  const handleConfirmAction = (event: any) => {
    event?.stopPropagation?.();
    if (product.sizes && product.sizes.length > 0 && !selectedSizeId) {
      showMessage({ message: 'Please select a size', type: 'warning' });
      return;
    }
    if (selectorAction === 'buy') {
      executeInstantBuy();
    } else {
      executeAddToCart();
    }
  };

  return (
    <>
      <Pressable
        onPress={handlePress}
        className={`m-1 flex-1 overflow-hidden rounded-card border border-border bg-card active:scale-[0.98] shadow-card ${className}`}
        style={{ backgroundColor: cardBg, borderColor: cardBorder }}
      >
        <View className="relative aspect-[1/1.12] w-full bg-surface-soft" style={{ backgroundColor: theme === 'dark' ? '#3A2A20' : '#F1ECE7' }}>
          {product.images && product.images.length > 0 ? (
            <Image
              source={{ uri: getImageUrl(product.images[0]) }}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={0}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <ImageOff size={38} className="text-muted-foreground" strokeWidth={1.2} />
            </View>
          )}

          {discount > 0 ? (
            <View className="absolute left-2.5 top-2.5 z-10 rounded-full bg-danger px-2.5 py-1.5">
              <Text className="text-[9px] font-black tracking-wide text-primary-foreground">
                -{Math.round(discount)}%
              </Text>
            </View>
          ) : product.isNew ? (
            <View className="absolute left-2.5 top-2.5 z-10 rounded-full bg-success px-2.5 py-1.5">
              <Text className="text-[9px] font-black tracking-wide text-primary-foreground">NEW</Text>
            </View>
          ) : null}

          <Pressable
            onPress={handleWishlist}
            className="absolute right-2.5 top-2.5 z-10 h-8 w-8 items-center justify-center rounded-full bg-card/90 active:scale-90"
            style={{ backgroundColor: theme === 'dark' ? '#2C2C2E' : '#FFFFFF' }}
          >
            <Heart
              size={15}
              color={isFavorited ? '#EF4444' : '#64748B'}
              fill={isFavorited ? '#EF4444' : 'transparent'}
            />
          </Pressable>
        </View>

        <View className="p-3">
          {product.brand || product.category?.name ? (
            <Text
              className="mb-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground"
              style={{ color: cardMuted }}
              numberOfLines={1}
            >
              {product.brand || product.category?.name}
            </Text>
          ) : null}

          <Text
            numberOfLines={2}
            className="min-h-[32px] text-[12px] font-black leading-[1.25] text-card-foreground"
            style={{ color: cardText }}
          >
            {product.name}
          </Text>

          <View className="mt-2 flex-row items-center justify-between gap-1.5">
            <View className="flex-row items-baseline gap-1.5 flex-1">
              <Text className="text-[15px] font-black tracking-tight text-card-foreground" style={{ color: cardText }}>
                {currency}
                {Math.round(discountedPrice).toLocaleString()}
              </Text>
              {discount > 0 ? (
                <Text className="text-[11px] font-semibold text-muted-foreground line-through" style={{ color: cardMuted }}>
                  {currency}
                  {Math.round(productPrice).toLocaleString()}
                </Text>
              ) : null}
            </View>

            {showReviews && reviewCount > 0 ? (
              <View className="flex-row items-center gap-1 rounded-full bg-accent px-2 py-1" style={{ backgroundColor: brandColors.accent }}>
                <Star size={10} color="#F59E0B" fill="#F59E0B" />
                <Text className="text-[10px] font-black text-accent-foreground" style={{ color: brandColors.primary }}>
                  {avgRating.toFixed(1)}
                </Text>
              </View>
            ) : null}
          </View>

          <View className="mt-3 flex-row gap-2">
            <Pressable
              onPress={handleAddToCart}
              className="h-10 flex-1 items-center justify-center rounded-button bg-accent active:scale-95"
              style={{ backgroundColor: brandColors.accent }}
            >
              <ShoppingCart size={16} color="#1A1A1A" strokeWidth={2.4} />
            </Pressable>
            <Pressable
              onPress={handleInstantBuy}
              className="h-10 flex-1 items-center justify-center rounded-button bg-primary active:scale-95"
              style={{ backgroundColor: theme === 'dark' ? '#2C1D14' : brandColors.primary }}
            >
              <Zap size={16} color="#FFFFFF" fill="#FFFFFF" strokeWidth={2.4} />
            </Pressable>
          </View>
        </View>
      </Pressable>

      {/* Bottom Sheet Size Selection Modal */}
      <Modal
        visible={isSelectorOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsSelectorOpen(false)}
      >
        <View className="flex-1 justify-end bg-overlay">
          {/* Dismiss Backdrop */}
          <Pressable 
            className="absolute inset-0" 
            onPress={(event) => {
              event?.stopPropagation?.();
              setIsSelectorOpen(false);
            }} 
          />

          {/* Bottom Sheet Container */}
          <View className="rounded-t-sheet border-t border-border bg-card p-5 pb-8 shadow-sheet">
            {/* Grabber indicator */}
            <View className="mx-auto mb-5 h-1 w-12 rounded-full bg-surface-muted" />

            {/* Header: Product details */}
            <View className="flex-row gap-4 mb-6">
              <View className="h-24 w-20 overflow-hidden rounded-card border border-border bg-surface-soft">
                {product.images && product.images.length > 0 ? (
                  <Image
                    source={{ uri: getImageUrl(product.images[0]) }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                  />
                ) : (
                  <View className="w-full h-full items-center justify-center">
                    <Text className="text-[10px] uppercase text-muted-foreground">No Image</Text>
                  </View>
                )}
              </View>

              <View className="flex-1 justify-center">
                {product.brand || product.category?.name ? (
                  <Text className="mb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {product.brand || product.category?.name}
                  </Text>
                ) : null}
                <Text numberOfLines={2} className="mb-2 text-base font-black leading-snug text-card-foreground">
                  {product.name}
                </Text>
                <Text className="text-lg font-black italic text-card-foreground">
                  {currency}{Math.round(discountedPrice).toLocaleString()}
                </Text>
              </View>
            </View>

            <View className="mb-5 h-px bg-border" />

            {/* Sizes section */}
            {product.sizes && product.sizes.length > 0 && (
              <View className="mb-5">
                <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Select Size
                </Text>
                <ScrollView overScrollMode="never" horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {product.sizes.map((sizeObj: any) => {
                    const sObj = sizeObj.size || sizeObj;
                    const sizeId = sObj._id || sObj.id || String(sObj);
                    const isSelected = selectedSizeId === String(sizeId);
                    const isOutOfStock = sizeObj.stock === 0;

                    return (
                      <Pressable
                        key={sizeId}
                        disabled={isOutOfStock}
                        onPress={(event) => {
                          event?.stopPropagation?.();
                          setSelectedSizeId(String(sizeId));
                        }}
                        className={`py-2.5 px-5 rounded-xl border items-center justify-center min-w-[55px] ${isOutOfStock
                            ? 'border-border bg-surface-soft opacity-35'
                            : isSelected
                              ? 'border-primary bg-primary'
                              : 'border-border bg-transparent'
                          }`}
                      >
                        <Text
                          className={`text-xs font-bold uppercase ${isOutOfStock
                              ? 'text-muted-foreground line-through'
                              : isSelected
                                ? 'text-primary-foreground'
                                : 'text-card-foreground'
                            }`}
                        >
                          {sObj.name || String(sObj)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* Quantity Selector */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Quantity
              </Text>
              <View className="h-10 flex-row items-center rounded-card border border-border bg-surface-soft px-1.5 py-1">
                <Pressable
                  onPress={(event) => {
                    event?.stopPropagation?.();
                    if (quantity > 1) setQuantity(quantity - 1);
                  }}
                  className="h-7 w-7 items-center justify-center rounded-button border border-border bg-card"
                >
                  <Minus size={12} className="text-card-foreground" />
                </Pressable>

                <Text className="min-w-[30px] px-4 text-center text-xs font-black text-card-foreground">
                  {quantity}
                </Text>

                <Pressable
                  onPress={(event) => {
                    event?.stopPropagation?.();
                    setQuantity(quantity + 1);
                  }}
                  className="h-7 w-7 items-center justify-center rounded-button border border-border bg-card"
                >
                  <Plus size={12} className="text-card-foreground" />
                </Pressable>
              </View>
            </View>

            {/* Confirm CTA Button */}
            <Pressable
              onPress={handleConfirmAction}
              disabled={loadingCart}
              className="h-12 w-full items-center justify-center rounded-button bg-primary active:scale-95 shadow-card"
            >
              {loadingCart ? (
                <ActivityIndicator size="small" color={selectorAction === 'buy' ? '#0F172A' : '#FFFFFF'} />
              ) : (
                <Text className="text-xs font-black uppercase tracking-widest text-primary-foreground">
                  {selectorAction === 'buy' ? 'Confirm Buy Now' : 'Confirm Add to Cart'}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

export const ProductCard = memo(ProductCardBase, (prev, next) => {
  const prevProduct = prev.product;
  const nextProduct = next.product;

  return (
    prev.className === next.className &&
    prevProduct._id === nextProduct._id &&
    prevProduct.name === nextProduct.name &&
    prevProduct.price === nextProduct.price &&
    prevProduct.discount === nextProduct.discount &&
    prevProduct.images?.[0] === nextProduct.images?.[0] &&
    prevProduct.averageRating === nextProduct.averageRating &&
    prevProduct.totalReviews === nextProduct.totalReviews
  );
});
