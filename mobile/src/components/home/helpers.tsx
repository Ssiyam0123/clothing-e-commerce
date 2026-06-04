import React, { useState, useEffect } from 'react';
import { Image, Dimensions, View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { getImageUrl } from '../../lib/api';
import { useAppStore } from '../../store/appStore';
import { getBrandScheme } from '../../constants/designSystem';

export const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const getSlideImage = (slide: any) => {
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

export const getAppLink = (link?: string) => {
  if (!link || link === '#') return '/(tabs)/shop';
  if (link.startsWith('/products')) return link.replace('/products', '/(tabs)/shop');
  if (link.startsWith('/categories')) return '/(tabs)/shop';
  return link;
};

export const normalizeBannerSlides = (section: any, campaign: any) => {
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

export const fallbackBannerSlide = {
  image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=85',
  link: '/(tabs)/shop',
};

export function AutoHeightBannerImage({ uri }: { uri: string }) {
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

export function SectionHeader({
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
  const theme = useAppStore((s) => s.theme);
  const colors = getBrandScheme(theme);

  return (
    <View className="flex-row items-end justify-between mb-3.5 px-1">
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          {accent && (
            <View className="h-5 w-1 rounded-full bg-brand-accent" />
          )}
          <Text
            className="text-lg font-black uppercase tracking-tight"
            style={{ color: colors.text }}
          >
            {title}
          </Text>
        </View>
        {subtitle ? (
          <Text
            className="text-[11px] font-semibold uppercase tracking-wide"
            style={{ color: colors.textSecondary }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {onSeeAll ? (
        <Pressable
          onPress={onSeeAll}
          className="flex-row items-center gap-0.5 rounded-full bg-brand-light-surface px-3 py-1 active:scale-95 dark:bg-brand-dark-surface"
        >
          <Text className="text-[11px] font-bold uppercase tracking-wider text-brand-light-muted dark:text-brand-dark-muted">
            {seeAllLabel}
          </Text>
          <ChevronRight size={13} className="text-brand-light-muted dark:text-brand-dark-muted" />
        </Pressable>
      ) : null}
    </View>
  );
}
