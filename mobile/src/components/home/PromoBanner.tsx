import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../../store/appStore';
import { api, getImageUrl } from '../../lib/api';
import {
  normalizeBannerSlides,
  getSlideImage,
  getAppLink,
  AutoHeightBannerImage,
} from './helpers';

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
