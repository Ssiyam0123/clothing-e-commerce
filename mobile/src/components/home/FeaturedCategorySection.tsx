import React from 'react';
import { View, Pressable, Image, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useAppStore } from '../../store/appStore';
import { getImageUrl } from '../../lib/api';

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
