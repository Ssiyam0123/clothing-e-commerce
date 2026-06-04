import React from 'react';
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, User } from 'lucide-react-native';
import { api, getImageUrl } from '../../lib/api';
import { getBrandTokens } from '../../constants/designSystem';
import { useAppStore } from '../../store/appStore';
import { Button } from '../../components/ui/Button';
import { safeBack } from '../../utils/navigation';

// Utility to clean basic HTML tags if the content is HTML
const cleanHtml = (htmlStr?: string) => {
  if (!htmlStr) return '';
  return htmlStr
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/&nbsp;/g, ' ') // Replace nbsp
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
};

export default function BlogDetailScreen() {
  const { slug } = useLocalSearchParams();
  const theme = useAppStore((s) => s.theme);
  const palette = getBrandTokens(theme);

  // Fetch specific blog details by slug
  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blogDetails', slug],
    queryFn: async () => {
      const { data } = await api.get(`/blogs/${slug}`);
      return data?.blog || data?.data || data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: palette.background }}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  if (error || !blog) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center p-6" style={{ backgroundColor: palette.background }}>
        <Text className="text-lg font-black italic mb-4" style={{ color: palette.text }}>Article Not Found</Text>
        <Button title="Go Back" onPress={safeBack} className="w-1/2" />
      </SafeAreaView>
    );
  }

  const dateStr = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : '';
  const imageUrl = getImageUrl(blog.featuredImage || blog.image || blog.thumbnail);
  const plainBody = cleanHtml(blog.content);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: palette.background }}>
      {/* Header bar */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: palette.nav, borderColor: palette.border }}>
        <Pressable
          onPress={safeBack}
          className="w-9 h-9 items-center justify-center rounded-full active:scale-95"
          style={{ backgroundColor: palette.surfaceSoft }}
        >
          <ArrowLeft size={18} color={palette.text} />
        </Pressable>
        <Text className="text-base font-black italic uppercase tracking-wider" style={{ color: palette.navText }}>
          Article Details
        </Text>
        <View className="w-9 h-9" />
      </View>

      <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false} className="flex-1" style={{ backgroundColor: palette.background }}>
        {/* Banner image */}
        <View className="w-full h-56" style={{ backgroundColor: palette.surfaceSoft }}>
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Content Panel */}
        <View className="p-6" style={{ backgroundColor: palette.surface }}>
          {/* Metadata Row */}
          <View className="flex-row items-center gap-4 mb-4">
            <View className="flex-row items-center gap-1">
              <Calendar size={12} color={palette.iconMuted} />
              <Text className="text-[10px] font-bold uppercase" style={{ color: palette.textSecondary }}>
                {dateStr}
              </Text>
            </View>
            {blog.author ? (
              <View className="flex-row items-center gap-1">
                <User size={12} color={palette.iconMuted} />
                <Text className="text-[10px] font-bold uppercase" style={{ color: palette.textSecondary }}>
                  {blog.author?.name || blog.author}
                </Text>
              </View>
            ) : null}
          </View>

          <Text className="text-2xl font-black mb-6 leading-snug" style={{ color: palette.text }}>
            {blog.title}
          </Text>

          {/* Body content */}
          <Text className="text-sm font-medium leading-loose" style={{ color: palette.textSecondary }}>
            {plainBody}
          </Text>
        </View>
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
