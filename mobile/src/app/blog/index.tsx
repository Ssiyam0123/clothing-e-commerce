import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, Calendar } from 'lucide-react-native';
import { api, getImageUrl } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { safeBack } from '../../utils/navigation';
import { getBrandTokens } from '../../constants/designSystem';
import { useAppStore } from '../../store/appStore';

export default function BlogListingScreen() {
  const router = useRouter();
  const theme = useAppStore((s) => s.theme);
  const palette = getBrandTokens(theme);

  // Fetch blogs list
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data } = await api.get('/blogs');
      return data?.blogs || data?.data || data || [];
    },
  });

  const blogsList = Array.isArray(blogs) ? blogs : blogs?.blogs || blogs?.data || [];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: palette.background }}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

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
          Blog & Articles
        </Text>
        <View className="w-9 h-9" />
      </View>

      {error || blogsList.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8" style={{ backgroundColor: palette.background }}>
          <BookOpen size={48} color={palette.iconMuted} />
          <Text className="mt-4 text-sm font-semibold mb-6 text-center" style={{ color: palette.textSecondary }}>
            No articles published yet. Check back later!
          </Text>
          <Button title="Go Back" onPress={() => router.back()} className="w-1/2" />
        </View>
      ) : (
        <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false} className="flex-1 px-5 py-4" style={{ backgroundColor: palette.background }}>
          {blogsList.map((post: any) => {
            const dateStr = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '';
            const imageUrl = getImageUrl(post.featuredImage || post.image || post.thumbnail);

            return (
              <Pressable
                key={post._id}
                onPress={() => router.push(`/blog/${post.slug}`)}
                className="border rounded-3xl overflow-hidden mb-5 active:scale-[0.99]"
                style={{ backgroundColor: palette.surface, borderColor: palette.border }}
              >
                <View className="w-full h-44" style={{ backgroundColor: palette.surfaceSoft }}>
                  <Image
                    source={{ uri: imageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>

                <View className="p-5">
                  <View className="flex-row items-center gap-1.5 mb-2.5">
                    <Calendar size={12} color={palette.iconMuted} />
                    <Text className="text-[10px] font-bold uppercase" style={{ color: palette.textSecondary }}>
                      {dateStr}
                    </Text>
                  </View>

                  <Text className="text-lg font-black mb-2 leading-snug" style={{ color: palette.text }}>
                    {post.title}
                  </Text>

                  {post.excerpt ? (
                    <Text numberOfLines={2} className="text-xs font-semibold leading-relaxed" style={{ color: palette.textSecondary }}>
                      {post.excerpt}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            );
          })}
          <View className="h-6" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
