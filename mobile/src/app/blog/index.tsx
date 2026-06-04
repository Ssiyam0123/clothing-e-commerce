import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, Calendar } from 'lucide-react-native';
import { api, getImageUrl } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { safeBack } from '../../utils/navigation';

export default function BlogListingScreen() {
  const router = useRouter();

  // Fetch blogs list
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data } = await api.get('/blogs');
      return data || [];
    },
  });

  const blogsList = Array.isArray(blogs) ? blogs : blogs?.blogs || [];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#0F0F11" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header bar */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-zinc-950 border-b border-slate-50 dark:border-zinc-900">
        <Pressable
          onPress={safeBack}
          className="w-9 h-9 items-center justify-center bg-slate-50 dark:bg-zinc-900 rounded-full active:scale-95"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </Pressable>
        <Text className="text-base font-black text-foreground italic uppercase tracking-wider">
          Blog & Articles
        </Text>
        <View className="w-9 h-9" />
      </View>

      {error || blogsList.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8 bg-background">
          <BookOpen size={48} className="text-slate-300 mb-4" />
          <Text className="text-sm font-semibold text-slate-500 mb-6 text-center">
            No articles published yet. Check back later!
          </Text>
          <Button title="Go Back" onPress={() => router.back()} className="w-1/2" />
        </View>
      ) : (
        <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false} className="flex-1 px-5 py-4">
          {blogsList.map((post: any) => {
            const dateStr = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '';
            const imageUrl = getImageUrl(post.featuredImage || post.image || post.thumbnail);

            return (
              <Pressable
                key={post._id}
                onPress={() => router.push(`/blog/${post.slug}`)}
                className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/40 rounded-3xl overflow-hidden mb-5 active:scale-[0.99]"
              >
                <View className="w-full h-44 bg-slate-50">
                  <Image
                    source={{ uri: imageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>

                <View className="p-5">
                  <View className="flex-row items-center gap-1.5 mb-2.5">
                    <Calendar size={12} className="text-slate-400" />
                    <Text className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase">
                      {dateStr}
                    </Text>
                  </View>

                  <Text className="text-lg font-black text-foreground mb-2 leading-snug">
                    {post.title}
                  </Text>

                  {post.excerpt ? (
                    <Text numberOfLines={2} className="text-xs font-semibold text-slate-500 dark:text-zinc-400 leading-relaxed">
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
