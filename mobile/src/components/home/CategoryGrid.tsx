import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../../store/appStore';
import { getTranslation } from '../../utils/i18n';
import { api, getImageUrl } from '../../lib/api';

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
      <ScrollView overScrollMode="never"
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
