import React from 'react';
import { ScrollView, View, Text, Platform } from 'react-native';
import { Truck, ShieldCheck, RefreshCw, Package } from 'lucide-react-native';
import { getBrandScheme } from '../../constants/designSystem';
import { useAppStore } from '../../store/appStore';

export function MobileUspCards({ config }: { config: any }) {
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const colors = getBrandScheme(theme);
  const isDark = theme === 'dark';

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
    <ScrollView overScrollMode="never"
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
              default: colors.surface,
            }),
            borderWidth: 1,
            borderColor: colors.border,
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
                default: colors.surface,
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
