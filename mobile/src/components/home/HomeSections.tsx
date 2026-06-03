import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Truck,
  ShieldCheck,
  Clock,
  Zap,
  RefreshCw,
  Shirt,
  Sparkles,
  Smile,
  ArrowRight,
  Tag,
  Star,
  TrendingUp,
  Package,
  ChevronRight,
  Flame,
} from 'lucide-react-native';
import { api, getImageUrl } from '../../lib/api';
import { ProductCard } from '../ui/ProductCard';
import { Skeleton } from '../ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../../store/appStore';
import { getTranslation } from '../../utils/i18n';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getSlideImage = (slide: any) => {
  const image =
    slide?.image ||
    slide?.imageUrl ||
    slide?.mobileImage ||
    slide?.desktopImage ||
    slide?.bannerImage ||
    slide?.banner ||
    slide?.url ||
    '';
  if (typeof image === 'string') return image;
  if (image && typeof image === 'object') {
    return image.url || image.secure_url || image.src || image.path || '';
  }
  return '';
};

const getAppLink = (link?: string) => {
  if (!link || link === '#') return '/(tabs)/shop';
  if (link.startsWith('/products')) return link.replace('/products', '/(tabs)/shop');
  if (link.startsWith('/categories')) return '/(tabs)/shop';
  return link;
};

const normalizeBannerSlides = (section: any, campaign: any) => {
  const config = section?.config || {};
  const manualSlides = (section?.images || [])
    .filter((img: any) => {
      if (typeof img === 'string') return img.trim() !== '';
      return typeof img === 'object' && img !== null && getSlideImage(img)?.trim?.() !== '';
    })
    .map((img: any) => {
      const isObject = typeof img === 'object' && img !== null;
      return {
        image: isObject ? getSlideImage(img) : img,
        title: '',
        subtitle: '',
        link: getAppLink(isObject && img.link ? img.link : section?.actionLink),
      };
    });

  if (manualSlides.length > 0) return manualSlides;

  if (campaign?.slides?.length > 0) {
    return campaign.slides.map((slide: any) => ({
      ...slide,
      image: getSlideImage(slide),
      title: '',
      subtitle: '',
      link: getAppLink(slide.link || section?.actionLink),
    }));
  }

  if (section?.imageUrl) {
    return [
      {
        image: section.imageUrl,
        title: section.title || '',
        subtitle: section.subtitle || '',
        link: getAppLink(section.actionLink),
      },
    ];
  }

  const configImage =
    config.imageUrl || config.image || config.mobileImage || config.desktopImage || config.bannerImage || config.banner;
  if (configImage) {
    return [
      {
        image: configImage,
        title: '',
        subtitle: '',
        link: getAppLink(config.actionLink || config.link || section?.actionLink),
      },
    ];
  }

  if (section?.config?.slides?.length > 0) {
    return section.config.slides.map((slide: any) => ({
      ...slide,
      image: getSlideImage(slide),
      link: getAppLink(slide.link || slide.actionLink || section?.actionLink),
    }));
  }

  return [];
};

const fallbackBannerSlide = {
  image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=85',
  link: '/(tabs)/shop',
};

function AutoHeightBannerImage({ uri }: { uri: string }) {
  const [hasFailed, setHasFailed] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1.5);
  const displayUri = hasFailed ? fallbackBannerSlide.image : uri;

  useEffect(() => {
    if (!displayUri) return;
    Image.getSize(
      displayUri,
      (width, height) => {
        if (width > 0 && height > 0) setAspectRatio(width / height);
      },
      () => {}
    );
  }, [displayUri]);

  return (
    <Image
      source={{ uri: displayUri }}
      className="w-full"
      resizeMode="contain"
      style={{ aspectRatio }}
      onError={() => {
        if (!hasFailed) setHasFailed(true);
      }}
    />
  );
}

// ═══════════════════════════════════════════
// 🍎 Section Header
// ═══════════════════════════════════════════
function SectionHeader({
  title,
  subtitle,
  onSeeAll,
  seeAllLabel = 'See All',
  accent = false,
}: {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
  seeAllLabel?: string;
  accent?: boolean;
}) {
  return (
    <View className="flex-row items-end justify-between mb-3.5 px-1">
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          {accent && (
            <View className="w-1 h-5 bg-accent-crimson rounded-full" />
          )}
          <Text className="text-lg font-black text-foreground uppercase tracking-tight">
            {title}
          </Text>
        </View>
        {subtitle ? (
          <Text className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {onSeeAll ? (
        <Pressable
          onPress={onSeeAll}
          className="flex-row items-center gap-0.5 py-1 px-3 rounded-full bg-slate-100/80 dark:bg-zinc-800/60 active:scale-95"
        >
          <Text className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
            {seeAllLabel}
          </Text>
          <ChevronRight size={13} className="text-slate-400 dark:text-zinc-500" />
        </Pressable>
      ) : null}
    </View>
  );
}

// ═══════════════════════════════════════════
// 1. 🍎 HERO SLIDER — BANNER_SLIDER / HERO
// ═══════════════════════════════════════════
export function MobileHeroSlider({ config, section }: { config?: any; section?: any }) {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const t = getTranslation('home', lang);
  const resolvedConfig = section?.config || config || {};
  const campaignId = resolvedConfig?.campaignId;
  const [activeIndex, setActiveIndex] = useState(0);
  const hasLocalBanner =
    (section?.images?.length > 0) || !!section?.imageUrl || (resolvedConfig?.slides?.length > 0);

  const { data: campaign, isLoading: isCampaignLoading } = useQuery({
    queryKey: ['homeBannerCampaign', section?.id, campaignId || 'active'],
    queryFn: async () => {
      const endpoint = campaignId
        ? `/banner-campaigns/${campaignId}/public`
        : '/banner-campaigns/active';
      const { data } = await api.get(endpoint);
      return data;
    },
    enabled: (!!campaignId || !hasLocalBanner) && (section?.type === 'HERO' || section?.type === 'BANNER_SLIDER'),
  });

  const rawSlides = normalizeBannerSlides(section || { config: resolvedConfig }, campaign);

  const slides =
    rawSlides.length > 0
      ? rawSlides
      : [
          {
            title: lang === 'bn' ? 'প্রিমিয়াম কালেকশন' : 'Premium Collection',
            subtitle: lang === 'bn' ? 'নতুন ক্যাম্পেইন' : 'New Campaign',
            buttonText: t.heroBtn || 'Shop Now',
            link: '/(tabs)/shop',
            image: null,
          },
        ];

  const validSlides = slides.filter((slide: any) => getSlideImage(slide));
  const renderSlides = validSlides.length > 0 ? validSlides : [fallbackBannerSlide];

  if (isCampaignLoading && validSlides.length === 0) {
    return (
      <View className="mb-7 px-4">
        <Skeleton width="100%" height={180} className="rounded-3xl" />
      </View>
    );
  }

  return (
    <View className="mb-7">
      {/* Hero Carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const offset = e.nativeEvent.contentOffset.x;
          const idx = Math.round(offset / SCREEN_WIDTH);
          setActiveIndex(idx);
        }}
        scrollEventThrottle={16}
      >
        {renderSlides.map((slide: any, idx: number) => {
          const imagePath = getSlideImage(slide);
          const imageUri = getImageUrl(imagePath);

          return (
            <Pressable
              key={idx}
              onPress={() => router.push(getAppLink(slide.link || section?.actionLink) as any)}
              style={{ width: SCREEN_WIDTH }}
              className="bg-black overflow-hidden active:scale-[0.98]"
            >
              <AutoHeightBannerImage key={imageUri} uri={imageUri} />
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Dots */}
      {renderSlides.length > 1 ? (
        <View className="flex-row justify-center gap-1.5 mt-3.5">
          {renderSlides.map((_: any, idx: number) => (
            <View
              key={idx}
              className={`rounded-full transition-all ${
                activeIndex === idx
                  ? 'w-6 h-1.5 bg-zinc-900 dark:bg-white'
                  : 'w-1.5 h-1.5 bg-slate-300/70 dark:bg-zinc-700/70'
              }`}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

// ═══════════════════════════════════════════
// 2. 🍎 PROMO BANNER — PROMO_BANNER
// ═══════════════════════════════════════════
export function MobilePromoBanner({ config, section }: { config?: any; section?: any }) {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const resolvedSection = section || { config };
  const resolvedConfig = resolvedSection?.config || config || {};
  const campaignId = resolvedConfig?.campaignId;

  const { data: campaign } = useQuery({
    queryKey: ['homePromoCampaign', resolvedSection?.id, campaignId || 'active'],
    queryFn: async () => {
      const endpoint = campaignId
        ? `/banner-campaigns/${campaignId}/public`
        : '/banner-campaigns/active';
      const { data } = await api.get(endpoint);
      return data;
    },
    enabled: !!campaignId || (!(resolvedSection?.images?.length > 0) && !resolvedSection?.imageUrl),
  });

  const slide = normalizeBannerSlides(resolvedSection, campaign)[0];

  const resolvedImageUrl = getSlideImage(slide) || resolvedSection?.imageUrl || resolvedConfig?.imageUrl;
  const imageUrl = resolvedImageUrl
    ? getImageUrl(getSlideImage(slide) || resolvedSection?.imageUrl || resolvedConfig?.imageUrl)
    : 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&q=80';
  const link = slide?.link || resolvedSection?.actionLink || resolvedConfig?.actionLink || resolvedConfig?.link || '/(tabs)/shop';

  return (
    <View className="mb-7">
      <Pressable
        onPress={() => router.push(getAppLink(link) as any)}
        className="overflow-hidden bg-black active:scale-[0.98]"
      >
        <AutoHeightBannerImage key={imageUrl} uri={imageUrl} />
      </Pressable>
    </View>
  );
}

// ═══════════════════════════════════════════
// 3. 🍎 USP CARDS — USP
// ═══════════════════════════════════════════
export function MobileUspCards({ config }: { config: any }) {
  const lang = useAppStore((s) => s.lang);

  const defaultItems = [
    {
      icon: 'Truck',
      title: lang === 'bn' ? 'ফ্রি শিপিং' : 'Free Shipping',
      subtitle: lang === 'bn' ? '২০০০ টাকার বেশি অর্ডারে' : 'On orders over ৳2000',
    },
    {
      icon: 'ShieldCheck',
      title: lang === 'bn' ? 'নিরাপদ পেমেন্ট' : 'Secure Checkout',
      subtitle: lang === 'bn' ? '১০০% এনক্রিপ্টেড SSL' : '100% Encrypted SSL',
    },
    {
      icon: 'RefreshCw',
      title: lang === 'bn' ? 'সহজ রিটার্ন' : 'Easy Returns',
      subtitle: lang === 'bn' ? '৭ দিনের রিটার্ন পলিসি' : '7 Days Return Policy',
    },
  ];

  const items = config?.items?.length ? config.items : defaultItems;

  const iconComponent = (icon: string) => {
    switch (icon) {
      case 'ShieldCheck':
        return <ShieldCheck size={18} className="text-foreground" />;
      case 'RefreshCw':
        return <RefreshCw size={18} className="text-foreground" />;
      case 'Headset':
        return <Package size={18} className="text-foreground" />;
      default:
        return <Truck size={18} className="text-foreground" />;
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-7 px-4"
      contentContainerStyle={{ paddingRight: 32, gap: 10 }}
    >
      {items.map((item: any, idx: number) => (
        <View
          key={idx}
          style={{
            width: 200,
            backgroundColor: Platform.select({
              ios: 'rgba(248,250,252,0.75)',
              default: '#F8FAFC',
            }),
            borderWidth: 1,
            borderColor: Platform.select({
              ios: 'rgba(0,0,0,0.04)',
              default: 'rgba(0,0,0,0.05)',
            }),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 2,
          }}
          className="flex-row items-center py-3.5 px-4 rounded-2xl"
        >
          {/* Icon */}
          <View
            className="w-10 h-10 items-center justify-center rounded-xl mr-3.5"
            style={{
              backgroundColor: Platform.select({
                ios: 'rgba(255,255,255,0.9)',
                default: '#FFFFFF',
              }),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {iconComponent(item.icon)}
          </View>
          {/* Text */}
          <View className="flex-1">
            <Text className="text-xs font-bold text-foreground mb-0.5">
              {item.title}
            </Text>
            <Text className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
              {item.subtitle}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// ═══════════════════════════════════════════
// 4. 🍎 CATEGORY GRID — CATEGORY_GRID
// ═══════════════════════════════════════════
export function MobileCategoryGrid({ config }: { config: any }) {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const t = getTranslation('home', lang);
  const [selected, setSelected] = useState('men');

  // Fetch actual categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return Array.isArray(data) ? data : data?.categories || [];
    },
  });

  const displayCategories =
    categories?.length
      ? categories.filter((cat: any) => cat.slug !== 'on-sale').map((cat: any) => ({
          id: cat._id,
          name: lang === 'bn' && cat.nameBn ? cat.nameBn : cat.name,
          slug: cat.slug,
          image: cat.image,
        }))
      : [
          { id: 'men', name: lang === 'bn' ? 'পুরুষ' : 'Men', slug: 'men' },
          { id: 'women', name: lang === 'bn' ? 'নারী' : 'Women', slug: 'women' },
          { id: 'kids', name: lang === 'bn' ? 'শিশু' : 'Kids', slug: 'kids' },
          {
            id: 'accessories',
            name: lang === 'bn' ? 'এক্সেসরিজ' : 'Accessories',
            slug: 'accessories',
          },
        ];

  const visibleCategories = displayCategories;

  return (
    <View className="mb-7">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 14, gap: 14, paddingRight: 22 }}
      >
        {visibleCategories.map((cat: any) => {
          const isSelected = selected === (cat.slug || cat.id);
          return (
            <Pressable
              key={cat.slug || cat.id}
              onPress={() => {
                setSelected(cat.slug || cat.id);
                router.push(`/(tabs)/shop?category=${cat.slug}`);
              }}
              className="w-[78px] items-center active:scale-95"
            >
              <View
                className={`h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-full border-2 bg-slate-100 dark:bg-zinc-900 ${
                  isSelected ? 'border-white' : 'border-zinc-800 dark:border-zinc-700'
                }`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: isSelected ? 0.22 : 0.1,
                  shadowRadius: isSelected ? 14 : 8,
                  elevation: isSelected ? 6 : 2,
                }}
              >
                <Image
                  source={{ uri: getImageUrl(cat.image) }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
                {isSelected ? <View className="absolute inset-0 bg-black/10" /> : null}
              </View>
              <Text
                className="mt-2 min-h-[28px] text-center text-[10px] font-black uppercase leading-[14px] text-foreground"
                numberOfLines={2}
              >
                {cat.name}
              </Text>
              {isSelected ? (
                <View
                  className="mt-1 h-1 w-6 rounded-full"
                  style={{ backgroundColor: '#FFFFFF' }}
                />
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════
// 5. 🍎 FLASH SALE — FLASH_SALE
// ═══════════════════════════════════════════
export function MobileFlashSale({ config }: { config: any }) {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const t = getTranslation('home', lang);

  const { data: flashSaleBundle, isLoading } = useQuery({
    queryKey: ['activeFlashSale', config?.saleId, config?.subcategoryId],
    queryFn: async () => {
      const { data } = await api.get('/flash-sales/active');
      const allSales = Array.isArray(data)
        ? data
        : data?.flashSale
          ? [data.flashSale]
          : data
            ? [data]
            : [];
      const activeSale = config?.saleId
        ? allSales.find((sale: any) => String(sale._id) === String(config.saleId))
        : allSales.find((sale: any) => sale.isActive) || allSales[0];
      const sourceProducts = activeSale?.products || data?.products || [];
      const products = sourceProducts.filter((item: any) => {
        if (!config?.subcategoryId) return true;
        const prod = item.product || item;
        const subId = prod?.subcategory?._id || prod?.subcategory;
        return String(subId) === String(config.subcategoryId);
      });
      return { activeSale, products };
    },
  });

  const flashSale = flashSaleBundle?.activeSale;
  const flashSaleProducts = flashSaleBundle?.products || [];

  const [timeLeft, setTimeLeft] = useState('');
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    if (!flashSale?.endDate) return;
    const interval = setInterval(() => {
      const diff = new Date(flashSale.endDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('ENDED');
        clearInterval(interval);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      );
      setIsEnding(hours === 0 && mins < 30);
    }, 1000);
    return () => clearInterval(interval);
  }, [flashSale]);

  if (isLoading) {
    return (
      <View className="mb-7 px-4">
        <Skeleton width="100%" height={170} className="rounded-2xl" />
      </View>
    );
  }

  if (!flashSale || timeLeft === 'ENDED' || flashSaleProducts.length === 0) return null;

  const saleName =
    lang === 'bn' && flashSale.nameBn ? flashSale.nameBn : flashSale.name || t.flashSale;
  const discountRate = flashSale.discountRate || config?.discountRate || 0;

  return (
    <View className="mb-7 px-4">
      {/* Flash Sale Header Card - Glassy Red */}
      <View
        className="rounded-2xl p-4 mb-4 flex-row items-center justify-between overflow-hidden"
        style={{
          backgroundColor: isEnding ? '#DC2626' : '#EF4444',
          shadowColor: '#EF4444',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        {/* Subtle glass overlay */}
        <View
          className="absolute inset-0 rounded-2xl"
          style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)',
          }}
        />

        <View className="flex-row items-center gap-2 z-10">
          <View
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
          >
            <Zap size={18} color="white" fill="white" />
          </View>
          <View>
            <Text className="text-white text-[15px] font-black italic uppercase tracking-wide">
              {saleName}
            </Text>
            <Text className="text-white/70 text-[10px] font-semibold uppercase tracking-wider">
              {lang === 'bn' ? 'সীমিত সময়ের অফার' : 'Limited Time Offers'}
            </Text>
          </View>
        </View>

        <View
          className="py-2 px-3.5 rounded-xl flex-row items-center gap-1.5 z-10"
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)',
          }}
        >
          <Clock size={13} color="white" />
          <Text className="text-white font-mono font-black text-[13px] tracking-tight">
            {timeLeft}
          </Text>
        </View>
      </View>

      {/* Products Grid */}
      <View className="-mx-1 flex-row flex-wrap">
        {flashSaleProducts.slice(0, 6).map((item: any, idx: number) => {
          const prod = item.product || item;
          const saleProduct = {
            ...prod,
            price: prod.price,
            discount: item.discountRate || discountRate || prod.discount || 0,
          };
          return (
            <View key={`flash-${prod._id || item._id || idx}-${idx}`} className="w-1/2 p-1">
              <ProductCard product={saleProduct} className="m-0" />
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════
// 6. 🍎 PRODUCT GRID — FEATURED_PRODUCTS / NEW_ARRIVALS
// ═══════════════════════════════════════════
export function MobileProductGrid({
  type,
  config,
}: {
  type: 'featured' | 'new';
  config?: any;
}) {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const t = getTranslation('home', lang);

  const queryKey = type === 'featured' ? 'featuredProducts' : 'newArrivals';
  const apiQuery =
    type === 'featured' ? 'isFeatured=true&limit=4' : 'sort=-createdAt&limit=12';

  const { data: products, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data } = await api.get(`/products?${apiQuery}`);
      return data.products || [];
    },
  });

  const title = type === 'featured' ? t.featTitle || 'Trending Now' : t.newTitle || 'New Arrivals';
  const subtitle =
    type === 'featured'
      ? t.featSub || 'Curated for you'
      : t.newSub || 'Fresh drops just landed';

  if (isLoading) {
    return (
      <View className="mb-7 px-4">
        <View className="-mx-1 flex-row flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="w-1/2 p-1">
              <Skeleton width="100%" height={200} className="rounded-2xl" />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <View className="mb-7 px-4">
      <View className="-mx-1 flex-row flex-wrap">
        {products.map((prod: any, idx: number) => (
          <View key={`${type}-${prod._id || idx}-${idx}`} className="w-1/2 p-1">
            <ProductCard product={prod} className="m-0" />
          </View>
        ))}
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════
// 7. 🍎 SALE PRODUCTS — SALE_PRODUCTS
// ═══════════════════════════════════════════
export function MobileSaleProducts({ config }: { config: any }) {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const t = getTranslation('home', lang);

  const { data: products, isLoading } = useQuery({
    queryKey: ['saleProducts'],
    queryFn: async () => {
      const { data } = await api.get('/products?onSale=true&limit=12');
      return data.products || [];
    },
  });

  if (isLoading) {
    return (
      <View className="mb-7 px-4">
        <View className="-mx-1 flex-row flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="w-1/2 p-1">
              <Skeleton width="100%" height={200} className="rounded-2xl" />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <View className="mb-7 px-4">
      <View className="-mx-1 flex-row flex-wrap">
        {products.map((prod: any, idx: number) => (
          <View key={`sale-${prod._id || idx}-${idx}`} className="w-1/2 p-1">
            <ProductCard product={prod} className="m-0" />
          </View>
        ))}
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════
// 8. 🍎 CATEGORY COLLECTION — CATEGORY_COLLECTION
// ═══════════════════════════════════════════
export function MobileCategoryCollection({ section }: { section?: any }) {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const t = getTranslation('home', lang);
  const config = section?.config || {};

  const queryParam = config?.subcategoryId
    ? `subcategory=${config.subcategoryId}`
    : `category=${config.categoryId || config.slug || ''}`;

  const title =
    lang === 'bn' && section?.titleBn ? section.titleBn : section?.title || 'Collection';

  const { data: products, isLoading } = useQuery({
    queryKey: ['categoryCollection', queryParam],
    queryFn: async () => {
      if (!config?.categoryId && !config?.slug && !config?.subcategoryId) return [];
      const { data } = await api.get(`/products?${queryParam}&limit=12`);
      return data.products || [];
    },
    enabled: !!(config?.categoryId || config?.slug || config?.subcategoryId),
  });

  if (!config?.categoryId && !config?.slug && !config?.subcategoryId) return null;
  if (isLoading) {
    return (
      <View className="mb-7 px-4">
        <View className="-mx-1 flex-row flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="w-1/2 p-1">
              <Skeleton width="100%" height={200} className="rounded-2xl" />
            </View>
          ))}
        </View>
      </View>
    );
  }
  if (!products || products.length === 0) return null;

  return (
    <View className="mb-7 px-4">
      <View className="-mx-1 flex-row flex-wrap">
        {products.map((prod: any, idx: number) => (
          <View key={`collection-${section?._id || config?.categoryId || config?.subcategoryId || 'default'}-${prod._id || idx}-${idx}`} className="w-1/2 p-1">
            <ProductCard product={prod} className="m-0" />
          </View>
        ))}
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════
// 9. 🍎 CUSTOM PRODUCTS — CUSTOM_PRODUCTS
// ═══════════════════════════════════════════
export function MobileCustomProducts({ section }: { section?: any }) {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const t = getTranslation('home', lang);
  const config = section?.config || {};
  const productIds = config?.productIds || [];

  const title =
    lang === 'bn' && section?.titleBn ? section.titleBn : section?.title || t.featCatTitle || 'Featured Collection';

  const { data: products, isLoading } = useQuery({
    queryKey: ['customProducts', productIds.join(',')],
    queryFn: async () => {
      if (!productIds.length) return [];
      const { data } = await api.get(`/products?ids=${productIds.join(',')}`);
      return data.products || [];
    },
    enabled: productIds.length > 0,
  });

  if (!productIds.length) return null;
  if (isLoading) {
    return (
      <View className="mb-7 px-4">
        <View className="-mx-1 flex-row flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="w-1/2 p-1">
              <Skeleton width="100%" height={200} className="rounded-2xl" />
            </View>
          ))}
        </View>
      </View>
    );
  }
  if (!products || products.length === 0) return null;

  return (
    <View className="mb-7 px-4">
      <View className="-mx-1 flex-row flex-wrap">
        {products.map((prod: any, idx: number) => (
          <View key={`custom-${section?._id || productIds.join('-')}-${prod._id || idx}-${idx}`} className="w-1/2 p-1">
            <ProductCard product={prod} className="m-0" />
          </View>
        ))}
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════
// 10. 🍎 HEADER SECTION — HEADER
// ═══════════════════════════════════════════
export function MobileSectionHeader({ section }: { config?: any; section?: any }) {
  const lang = useAppStore((s) => s.lang);
  const title =
    lang === 'bn' && section?.titleBn ? section.titleBn : section?.title || '';
  const subtitle =
    lang === 'bn' && section?.subtitleBn
      ? section.subtitleBn
      : section?.subtitle || '';

  if (!title) return null;

  return (
    <View className="px-4 mt-2 mb-3">
      <Text className="text-[22px] font-black text-foreground uppercase tracking-tight leading-[26px]">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-[12px] font-semibold text-slate-500 dark:text-zinc-400 mt-1 leading-[16px]">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

// ═══════════════════════════════════════════
// 11. 🍎 FEATURED CATEGORY SECTION
// ═══════════════════════════════════════════
export function MobileFeaturedCategorySection({ section }: { config?: any; section?: any }) {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const config = section?.config || {};
  const imageUrl = config?.imageUrl
    ? getImageUrl(config.imageUrl)
    : 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80';
  const title =
    lang === 'bn' && section?.titleBn ? section.titleBn : section?.title || 'Featured Category';
  const link = config?.actionLink || section?.actionLink || '/(tabs)/shop';

  return (
    <View className="mb-7 px-4">
      <Pressable
        onPress={() => router.push(link)}
        className="rounded-3xl overflow-hidden h-[160px] active:scale-[0.98]"
      >
        <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
        <View className="absolute inset-0 bg-black/25" />
        <View
          className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl"
          style={{
            backgroundColor: Platform.select({
              ios: 'rgba(255,255,255,0.22)',
              default: 'rgba(255,255,255,0.28)',
            }),
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.15)',
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white/80 text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">
                {lang === 'bn' ? 'এক্সপ্লোর করুন' : 'Explore'}
              </Text>
              <Text className="text-white text-base font-black uppercase tracking-tight">
                {title}
              </Text>
            </View>
            <ArrowRight size={18} color="white" />
          </View>
        </View>
      </Pressable>
    </View>
  );
}
