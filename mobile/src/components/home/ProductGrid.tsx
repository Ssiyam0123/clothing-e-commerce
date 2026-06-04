import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAppStore } from '../../store/appStore';
import { getTranslation } from '../../utils/i18n';
import { Skeleton } from '../ui/Skeleton';
import { ProductCard } from '../ui/ProductCard';

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
    type === 'featured' ? 'isFeatured=true&limit=4' : 'sort=-createdAt&limit=8';

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
