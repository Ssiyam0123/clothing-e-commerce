/* eslint-disable react-hooks/set-state-in-effect */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowUpDown,
  BadgePercent,
  Check,
  ChevronDown,
  Grid2X2,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
} from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { api, getImageUrl } from '../../lib/api';
import { ProductCard } from '../../components/ui/ProductCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';

type Category = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
};

type Subcategory = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  category?: string | { _id?: string; name?: string };
};

const sortOptions = [
  { label: 'Newest', value: '' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
];

const currency = '\u09F3';

function FilterChip({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`mr-2 h-10 flex-row items-center gap-1.5 rounded-2xl border px-4 active:scale-95 ${
        active
          ? 'border-zinc-950 bg-zinc-950'
          : 'border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950'
      }`}
    >
      {icon}
      <Text
        className={`text-[11px] font-black uppercase tracking-wider ${
          active ? 'text-white' : 'text-slate-600 dark:text-zinc-400'
        }`}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function CategoryCard({
  category,
  active,
  onPress,
}: {
  category: { name: string; slug: string; image?: string; icon?: React.ReactNode };
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`mr-2 h-14 min-w-[124px] flex-row items-center gap-2 rounded-2xl border px-2 pr-4 active:scale-95 ${
        active
          ? 'border-zinc-950 bg-zinc-950'
          : 'border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950'
      }`}
    >
      <View
        className={`h-10 w-10 items-center justify-center overflow-hidden rounded-xl ${
          active ? 'bg-white/15' : 'bg-slate-100 dark:bg-zinc-900'
        }`}
      >
        {category.image ? (
          <Image source={{ uri: getImageUrl(category.image) }} className="h-full w-full" resizeMode="cover" />
        ) : (
          category.icon
        )}
      </View>
      <Text
        className={`max-w-[76px] text-[10px] font-black uppercase tracking-wider ${
          active ? 'text-white' : 'text-slate-700 dark:text-zinc-300'
        }`}
        numberOfLines={2}
      >
        {category.name}
      </Text>
    </Pressable>
  );
}

export default function ShopScreen() {
  const params = useLocalSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    if (params.category) setSelectedCategory(params.category as string);
    if (params.subcategory) setSelectedSubcategory(params.subcategory as string);
  }, [params.category, params.subcategory]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return Array.isArray(data) ? data : data?.categories || [];
    },
  });

  const { data: subcategories = [] } = useQuery<Subcategory[]>({
    queryKey: ['subcategories'],
    queryFn: async () => {
      const { data } = await api.get('/subcategories', { params: { limit: 100 } });
      return data?.subcategories || [];
    },
  });

  const selectedCategoryObj = useMemo(
    () => categories.find((cat) => cat.slug === selectedCategory),
    [categories, selectedCategory],
  );

  const visibleSubcategories = useMemo(() => {
    if (!selectedCategoryObj) return subcategories;
    return subcategories.filter((sub) => {
      const catId = typeof sub.category === 'object' ? sub.category?._id : sub.category;
      return String(catId) === String(selectedCategoryObj._id);
    });
  }, [selectedCategoryObj, subcategories]);

  const activeFilterCount = [
    selectedCategory,
    selectedSubcategory,
    minPrice || maxPrice,
    sortBy,
  ].filter(Boolean).length;

  const fetchProducts = async ({ pageParam = 1 }) => {
    let url = `/products?page=${pageParam}&limit=20`;
    if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;
    if (selectedCategory === 'isFeatured') {
      url += '&isFeatured=true';
    } else if (selectedCategory) {
      url += `&category=${selectedCategory}`;
    }
    if (selectedSubcategory) url += `&subcategory=${selectedSubcategory}`;
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;
    if (sortBy) url += `&sort=${sortBy}`;

    const { data } = await api.get(url);
    return data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: [
      'shopProducts',
      debouncedSearch,
      selectedCategory,
      selectedSubcategory,
      minPrice,
      maxPrice,
      sortBy,
    ],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage) => {
      const currentPage = Number(lastPage.currentPage || 1);
      const totalPages = Number(lastPage.pages || 1);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 30,
  });

  const productsList = useMemo(() => {
    const seen = new Set<string>();
    const products: any[] = [];

    data?.pages.forEach((page) => {
      (page.products || []).forEach((product: any) => {
        const key = String(product?._id || product?.slug || '');
        if (!key || seen.has(key)) return;
        seen.add(key);
        products.push(product);
      });
    });

    return products;
  }, [data]);

  const endReachedLockedRef = useRef(false);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setSelectedSubcategory('');
  };

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSearchTerm('');
    setDebouncedSearch('');
  };

  const handleEndReached = useCallback(() => {
    if (endReachedLockedRef.current || !hasNextPage || isFetchingNextPage) return;
    endReachedLockedRef.current = true;
    fetchNextPage().finally(() => {
      endReachedLockedRef.current = false;
    });
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderProduct = useCallback(
    ({ item }: { item: any }) => <ProductCard product={item} />,
    [],
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="border-b border-slate-100 bg-white px-4 py-3 dark:border-zinc-900 dark:bg-zinc-950">
        <View className="flex-row items-center gap-2">
          <View className="h-12 flex-1 flex-row items-center rounded-2xl border border-slate-100 bg-slate-50 px-3 dark:border-zinc-800 dark:bg-zinc-900">
            <Search size={18} className="mr-2 text-slate-400" />
            <TextInput
              placeholder="Search products"
              placeholderTextColor="#94A3B8"
              className="flex-1 py-2 text-sm font-bold text-foreground"
              value={searchTerm}
              onChangeText={setSearchTerm}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {searchTerm ? (
              <Pressable onPress={() => setSearchTerm('')} className="h-8 w-8 items-center justify-center">
                <X size={16} className="text-slate-400" />
              </Pressable>
            ) : null}
          </View>

          <Pressable
            onPress={() => setIsFilterPanelOpen(true)}
            className="h-12 w-12 items-center justify-center rounded-2xl active:scale-95"
            style={{ backgroundColor: '#0F172A' }}
          >
            <SlidersHorizontal size={18} color="#FFFFFF" strokeWidth={2.3} />
            {activeFilterCount ? (
              <View className="absolute -right-1 -top-1 h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1">
                <Text className="text-[9px] font-black text-white">{activeFilterCount}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>

      <Modal
        visible={isFilterPanelOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFilterPanelOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <Pressable className="flex-1" onPress={() => setIsFilterPanelOpen(false)} />
          <View className="max-h-[82%] rounded-t-[30px] bg-white px-4 pb-5 pt-3 dark:bg-zinc-950">
            <View className="mb-4 flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-black uppercase tracking-tight text-foreground">
                  Filters
                </Text>
                <Text className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                  Sort, category, subcategory, price
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Pressable
                  onPress={handleClearFilters}
                  className="h-10 flex-row items-center gap-1.5 rounded-2xl bg-slate-100 px-3 active:scale-95 dark:bg-zinc-900"
                >
                  <RotateCcw size={13} className="text-slate-500 dark:text-zinc-400" />
                  <Text className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Reset
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setIsFilterPanelOpen(false)}
                  className="h-10 w-10 items-center justify-center rounded-2xl active:scale-95"
                  style={{ backgroundColor: '#0F172A' }}
                >
                  <ChevronDown size={17} color="#FFFFFF" strokeWidth={2.3} />
                </Pressable>
              </View>
            </View>

            <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false}>
              <View className="mb-5">
                <Text className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
                  Sort By
                </Text>
                <ScrollView overScrollMode="never" horizontal showsHorizontalScrollIndicator={false}>
                  {sortOptions.map((option) => {
                    const isSelected = sortBy === option.value;
                    return (
                      <Pressable
                        key={option.label}
                        onPress={() => setSortBy(option.value)}
                        className={`mr-2 h-11 flex-row items-center gap-2 rounded-2xl border px-4 active:scale-95 ${
                          isSelected
                            ? 'border-zinc-950 bg-zinc-950'
                            : 'border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900'
                        }`}
                      >
                        <ArrowUpDown
                          size={13}
                          color={isSelected ? '#FFFFFF' : '#64748B'}
                        />
                        <Text
                          className={`text-[10px] font-black uppercase tracking-wider ${
                            isSelected ? 'text-white' : 'text-slate-600 dark:text-zinc-400'
                          }`}
                        >
                          {option.label}
                        </Text>
                        {isSelected ? <Check size={13} color="#FFFFFF" /> : null}
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              <View className="mb-5">
                <Text className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
                  Category
                </Text>
                <ScrollView overScrollMode="never" horizontal showsHorizontalScrollIndicator={false}>
                  <CategoryCard
                    category={{ name: 'All', slug: '', icon: <Grid2X2 size={18} color="#64748B" /> }}
                    active={selectedCategory === ''}
                    onPress={() => handleCategoryChange('')}
                  />
                  <CategoryCard
                    category={{
                      name: 'Featured',
                      slug: 'isFeatured',
                      icon: <Sparkles size={18} color="#F59E0B" />,
                    }}
                    active={selectedCategory === 'isFeatured'}
                    onPress={() => handleCategoryChange('isFeatured')}
                  />
                  <CategoryCard
                    category={{
                      name: 'On Sale',
                      slug: 'on-sale',
                      icon: <BadgePercent size={18} color="#EF4444" />,
                    }}
                    active={selectedCategory === 'on-sale'}
                    onPress={() => handleCategoryChange('on-sale')}
                  />
                  {categories
                    .filter((cat) => cat.slug !== 'on-sale')
                    .map((cat) => (
                      <CategoryCard
                        key={cat._id}
                        category={cat}
                        active={selectedCategory === cat.slug}
                        onPress={() => handleCategoryChange(cat.slug)}
                      />
                    ))}
                </ScrollView>
              </View>

              {visibleSubcategories.length > 0 ? (
                <View className="mb-5">
                  <Text className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
                    Subcategory
                  </Text>
                  <ScrollView overScrollMode="never" horizontal showsHorizontalScrollIndicator={false}>
                    {visibleSubcategories.map((sub) => (
                      <FilterChip
                        key={sub._id}
                        label={sub.name}
                        active={selectedSubcategory === sub.slug}
                        onPress={() => setSelectedSubcategory(selectedSubcategory === sub.slug ? '' : sub.slug)}
                        icon={
                          <Tag
                            size={12}
                            color={selectedSubcategory === sub.slug ? '#FFFFFF' : '#64748B'}
                          />
                        }
                      />
                    ))}
                  </ScrollView>
                </View>
              ) : null}

              <View className="mb-5">
                <Text className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
                  Price Range
                </Text>
                <View className="flex-row items-center gap-3">
                  <View className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
                    <Text className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Min
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="mr-1 text-sm font-black text-slate-400">{currency}</Text>
                      <TextInput
                        placeholder="0"
                        placeholderTextColor="#94A3B8"
                        className="flex-1 py-1 text-base font-black text-foreground"
                        keyboardType="numeric"
                        value={minPrice}
                        onChangeText={setMinPrice}
                      />
                    </View>
                  </View>

                  <View className="h-0.5 w-4 bg-slate-300 dark:bg-zinc-700" />

                  <View className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
                    <Text className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Max
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="mr-1 text-sm font-black text-slate-400">{currency}</Text>
                      <TextInput
                        placeholder="99999"
                        placeholderTextColor="#94A3B8"
                        className="flex-1 py-1 text-base font-black text-foreground"
                        keyboardType="numeric"
                        value={maxPrice}
                        onChangeText={setMaxPrice}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>

            <Button
              title={`Show Products${activeFilterCount ? ` (${activeFilterCount})` : ''}`}
              onPress={() => setIsFilterPanelOpen(false)}
              className="mt-2 h-12 rounded-2xl"
            />
          </View>
        </View>
      </Modal>

      {isLoading ? (
        <View className="flex-row flex-wrap p-2.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View key={i} className="w-[50%] p-1.5">
              <Skeleton width="100%" height={220} className="rounded-[22px]" />
            </View>
          ))}
        </View>
      ) : productsList.length === 0 ? (
        <View className="flex-1 items-center justify-center bg-background p-8">
          <Text className="mb-2 text-lg font-black italic text-foreground">
            No Products Found
          </Text>
          <Text className="mb-6 text-center text-xs text-slate-500">
            Try adjusting your search keywords or filter values.
          </Text>
          <Button title="Reset Filters" onPress={handleClearFilters} className="w-1/2" />
        </View>
      ) : (
        <FlatList overScrollMode="never"
          data={productsList}
          keyExtractor={(item, index) => `${item._id || item.slug || 'product'}-${index}`}
          numColumns={2}
          contentContainerStyle={{ padding: 6, paddingBottom: 28 }}
          renderItem={renderProduct}
          refreshing={isRefetching}
          onRefresh={refetch}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.2}
          onMomentumScrollBegin={() => {
            endReachedLockedRef.current = false;
          }}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={50}
          windowSize={7}
          removeClippedSubviews
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="items-center py-4">
                <ActivityIndicator size="small" color="#0F0F11" />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}
