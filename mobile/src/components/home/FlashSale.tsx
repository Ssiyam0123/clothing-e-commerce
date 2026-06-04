import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Zap, Clock } from 'lucide-react-native';
import { api } from '../../lib/api';
import { useAppStore } from '../../store/appStore';
import { getTranslation } from '../../utils/i18n';
import { Skeleton } from '../ui/Skeleton';
import { ProductCard } from '../ui/ProductCard';

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
