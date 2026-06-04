import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../../store/appStore';
import { getTranslation } from '../../utils/i18n';
import { api, getImageUrl } from '../../lib/api';
import {
  SCREEN_WIDTH,
  normalizeBannerSlides,
  getSlideImage,
  getAppLink,
  fallbackBannerSlide,
  AutoHeightBannerImage,
} from './helpers';

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
        {/* Placeholder skeleton */}
        <View className="w-full h-[180px] bg-slate-100 dark:bg-zinc-800 rounded-3xl" />
      </View>
    );
  }

  return (
    <View className="mb-7">
      <ScrollView overScrollMode="never"
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
