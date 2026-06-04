import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAppStore } from '../../store/appStore';
import { getTranslation } from '../../utils/i18n';
import { Skeleton } from '../ui/Skeleton';
import { ProductCard } from '../ui/ProductCard';

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
      const { data } = await api.get(`/products?${queryParam}&limit=8`);
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
