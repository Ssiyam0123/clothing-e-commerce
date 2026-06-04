import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell, Languages, Moon, Sun } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { api } from '../../lib/api';
import { useAppStore } from '../../store/appStore';
import { getBrandScheme, brandColors } from '../../constants/designSystem';
import {
  MobileHeroSlider,
  MobileUspCards,
  MobileCategoryGrid,
  MobileFlashSale,
  MobileProductGrid,
  MobilePromoBanner,
  MobileSaleProducts,
  MobileCategoryCollection,
  MobileCustomProducts,
  MobileSectionHeader,
  MobileFeaturedCategorySection,
} from '../../components/home/HomeSections';

function AnimatedThemeToggle({ isDark, onPress, colors }: { isDark: boolean; onPress: () => void; colors: any }) {
  const rotation = useSharedValue(isDark ? 360 : 0);

  React.useEffect(() => {
    rotation.value = withSpring(isDark ? 360 : 0, { damping: 15, stiffness: 120 });
  }, [isDark, rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
      ]
    };
  });

  return (
    <Pressable
      onPress={() => {
        onPress();
      }}
      className="h-9 w-9 items-center justify-center rounded-full bg-brand-light-bg dark:bg-brand-dark-bg active:scale-95"
    >
      <Animated.View style={animatedStyle}>
        {isDark ? (
          <Moon size={18} color={colors.text} />
        ) : (
          <Sun size={18} color={brandColors.primary} />
        )}
      </Animated.View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const theme = useAppStore((s) => s.theme);
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const siteName = useAppStore((s) => s.settings?.branding?.siteName) || 'VANGUARD';
  const isDark = theme === 'dark';
  const colors = getBrandScheme(theme);

  // Fetch dynamic home layout configuration from backend
  const {
    data: layoutData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['homeLayout'],
    queryFn: async () => {
      const { data } = await api.get('/home-layouts/active');
      return data;
    },
  });

  const renderSection = (section: any, headerSection?: any, index = 0) => {
    const sectionKey = `${section.type}-${section._id || section.id || index}-${index}`;
    const sectionProps = { config: section.config, section };
    const withHeader = (node: React.ReactNode) => (
      <React.Fragment key={sectionKey}>
        {headerSection ? <MobileSectionHeader section={headerSection} /> : null}
        {node}
      </React.Fragment>
    );

    switch (section.type) {
      // Hero & Banner types
      case 'HERO':
      case 'BANNER_SLIDER':
        return withHeader(<MobileHeroSlider section={section} config={section.config} />);

      // Promo Banner
      case 'PROMO_BANNER':
        return withHeader(<MobilePromoBanner section={section} config={section.config} />);

      // USP / Trust badges
      case 'USP':
        return withHeader(<MobileUspCards config={section.config} />);

      // Category grid
      case 'CATEGORY_GRID':
        return withHeader(<MobileCategoryGrid config={section.config} />);

      // Flash sale
      case 'FLASH_SALE':
        return withHeader(<MobileFlashSale config={section.config} />);

      // Featured products
      case 'FEATURED_PRODUCTS':
        return withHeader(
          <MobileProductGrid
            type="featured"
            config={section.config}
          />
        );

      // New arrivals
      case 'NEW_ARRIVALS':
        return withHeader(
          <MobileProductGrid
            type="new"
            config={section.config}
          />
        );

      // Sale products
      case 'SALE_PRODUCTS':
        return withHeader(<MobileSaleProducts config={section.config} />);

      // Category collection
      case 'CATEGORY_COLLECTION':
        return withHeader(<MobileCategoryCollection {...sectionProps} />);

      // Custom products
      case 'CUSTOM_PRODUCTS':
        return withHeader(<MobileCustomProducts {...sectionProps} />);

      // Featured category section
      case 'FEATURED_CATEGORY_SECTION':
        return withHeader(<MobileFeaturedCategorySection {...sectionProps} />);

      // Section header (text divider)
      case 'HEADER':
        return null;

      default:
        return null;
    }
  };

  const sections = layoutData?.sections?.filter((s: any) => s.isVisible) || [];
  const renderedSections = [];
  let pendingHeader = null;

  for (const [index, section] of sections.entries()) {
    if (section.type === 'HEADER') {
      pendingHeader = section;
      continue;
    }
    renderedSections.push(renderSection(section, pendingHeader, index));
    pendingHeader = null;
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-light-bg dark:bg-brand-dark-bg" style={{ backgroundColor: colors.background }}>
      {/* 🍎 Premium Glass Header Bar */}
      <View
        className="h-14 flex-row items-center justify-between px-4 py-2.5"
        style={{ backgroundColor: colors.surface }}
      >
        {/* Brand / Menu */}
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          <Text
            className="text-base font-black uppercase tracking-[0.15em]"
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {siteName}
          </Text>
        </View>

        {/* Right actions */}
        <View className="flex-row items-center gap-1">
          <AnimatedThemeToggle
            isDark={isDark}
            onPress={toggleTheme}
            colors={colors}
          />

          <Pressable
            onPress={() => {
              requestAnimationFrame(() => {
                setLang(lang === 'en' ? 'bn' : 'en');
              });
            }}
            className="h-9 flex-row items-center justify-center gap-0.5 rounded-full bg-brand-light-bg px-2 active:scale-90 dark:bg-brand-dark-bg"
          >
            <Languages size={14} color={isDark ? colors.text : brandColors.primary} />
            <Text className="text-[9px] font-black uppercase text-brand-light-text dark:text-brand-dark-text">
              {lang === 'en' ? 'BN' : 'EN'}
            </Text>
          </Pressable>

          {/* Search */}
          <Pressable
            onPress={() => router.push('/(tabs)/shop')}
            className="h-9 w-9 items-center justify-center rounded-full bg-brand-light-bg active:scale-90 dark:bg-brand-dark-bg"
          >
            <Search size={20} color={isDark ? colors.text : brandColors.primary} />
          </Pressable>

          {/* Notifications */}
          <Pressable className="relative h-9 w-9 items-center justify-center rounded-full active:scale-90">
            <Bell size={20} color={isDark ? colors.text : brandColors.primary} />
            <View className="absolute top-1.5 right-1.5 bg-accent-crimson rounded-full h-4 min-w-4 px-1 items-center justify-center">
              <Text className="text-white text-[8px] font-black text-center">
                3
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Main Content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center bg-brand-light-bg dark:bg-brand-dark-bg">
          <ActivityIndicator size="large" color={isDark ? colors.text : brandColors.primary} />
        </View>
      ) : (
        <FlatList overScrollMode="never"
          data={sections.length > 0 ? renderedSections : [
            <MobileHeroSlider key="hero" config={{ slides: [] }} />,
            <MobileUspCards key="usp" config={{}} />,
            <MobileCategoryGrid key="categories" config={{}} />,
            <MobileFlashSale key="flash" config={{}} />,
            <MobileProductGrid key="feat" type="featured" />,
            <MobileProductGrid key="new" type="new" />,
            <MobileSaleProducts key="sale" config={{}} />,
          ]}
          renderItem={({ item }) => item}
          keyExtractor={(_, index) => String(index)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 48 }}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              tintColor={isDark ? colors.text : brandColors.primary}
              colors={[brandColors.primary]}
            />
          }
          removeClippedSubviews={true}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={5}
        />
      )}
    </SafeAreaView>
  );
}
