import React, { memo, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Heart, Star, ImageOff, ShoppingCart, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { showMessage } from 'react-native-flash-message';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { getImageUrl } from '../../lib/api';

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

  const handleAddToCart = (event: any) => {
    event?.stopPropagation?.();
    const sizeId = getDefaultSizeId();
    if (!sizeId) {
      router.push(`/product/${product.slug}`);
      return;
    }
    addToCart(product, sizeId, 1, isAuthenticated);
    showMessage({ message: 'Added to cart', type: 'success' });
  };

  const handleInstantBuy = (event: any) => {
    event?.stopPropagation?.();
    const sizeId = getDefaultSizeId();
    if (!sizeId) {
      router.push(`/product/${product.slug}`);
      return;
    }
    // Set buyNowItem — cart page will show ONLY this item
    setBuyNowItem(product, sizeId, 1);
    router.push('/(tabs)/cart');
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`rounded-[20px] overflow-hidden flex-1 m-1 active:scale-[0.98] bg-white dark:bg-zinc-950 border border-black/[0.06] dark:border-white/[0.08] ${className}`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
      }}
    >
      <View className="relative w-full aspect-[1/1.12] bg-slate-100 dark:bg-zinc-900">
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
            <ImageOff size={38} color="#9ca3af" strokeWidth={1.2} />
          </View>
        )}

        {discount > 0 ? (
          <View className="absolute top-2.5 left-2.5 py-1.5 px-2.5 rounded-full z-10 bg-red-600">
            <Text className="text-white text-[9px] font-black tracking-wide">
              -{Math.round(discount)}%
            </Text>
          </View>
        ) : product.isNew ? (
          <View className="absolute top-2.5 left-2.5 py-1.5 px-2.5 rounded-full z-10 bg-emerald-600">
            <Text className="text-white text-[9px] font-black tracking-wide">NEW</Text>
          </View>
        ) : null}

        <Pressable
          onPress={handleWishlist}
          className="absolute top-2.5 right-2.5 w-8 h-8 items-center justify-center rounded-full z-10 active:scale-90 bg-white/90 dark:bg-black/70"
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
            className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1"
            numberOfLines={1}
          >
            {product.brand || product.category?.name}
          </Text>
        ) : null}

        <Text numberOfLines={2} className="text-[12px] font-black text-foreground leading-[1.25] min-h-[32px]">
          {product.name}
        </Text>

        <View className="mt-2 flex-row items-center justify-between gap-1.5">
          <View className="flex-row items-baseline gap-1.5 flex-1">
            <Text className="text-[15px] font-black text-foreground tracking-tight">
              {currency}
              {Math.round(discountedPrice).toLocaleString()}
            </Text>
            {discount > 0 ? (
              <Text className="text-[11px] text-slate-400 line-through font-semibold">
                {currency}
                {Math.round(productPrice).toLocaleString()}
              </Text>
            ) : null}
          </View>

          {showReviews && reviewCount > 0 ? (
            <View className="flex-row items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-500/10 px-2 py-1">
              <Star size={10} color="#F59E0B" fill="#F59E0B" />
              <Text className="text-[10px] font-black text-amber-600 dark:text-amber-400">
                {avgRating.toFixed(1)}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="mt-3 flex-row gap-2">
          <Pressable
            onPress={handleAddToCart}
            className="h-10 flex-1 items-center justify-center rounded-2xl active:scale-95"
            style={{ backgroundColor: '#E5E7EB' }}
          >
            <ShoppingCart size={16} color="#0F172A" strokeWidth={2.4} />
          </Pressable>
          <Pressable
            onPress={handleInstantBuy}
            className="h-10 flex-1 items-center justify-center rounded-2xl active:scale-95"
            style={{ backgroundColor: '#0F172A' }}
          >
            <Zap size={16} color="#FFFFFF" fill="#FFFFFF" strokeWidth={2.4} />
          </Pressable>
        </View>
      </View>
    </Pressable>
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
