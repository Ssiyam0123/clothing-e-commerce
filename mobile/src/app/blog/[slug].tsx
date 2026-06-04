import React from 'react';
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, User } from 'lucide-react-native';
import { api, getImageUrl } from '../../lib/api';
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
  const router = useRouter();
  const { slug } = useLocalSearchParams();

  // Fetch specific blog details by slug
  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blogDetails', slug],
    queryFn: async () => {
      const { data } = await api.get(`/blogs/${slug}`);
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#0F0F11" />
      </View>
    );
  }

  if (error || !blog) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-lg font-black text-foreground italic mb-4">Article Not Found</Text>
        <Button title="Go Back" onPress={safeBack} className="w-1/2" />
      </SafeAreaView>
    );
  }

  const dateStr = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : '';
  const imageUrl = getImageUrl(blog.featuredImage || blog.image || blog.thumbnail);
  const plainBody = cleanHtml(blog.content);

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
          Article Details
        </Text>
        <View className="w-9 h-9" />
      </View>

      <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false} className="flex-1">
        {/* Banner image */}
        <View className="w-full h-56 bg-slate-50">
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Content Panel */}
        <View className="p-6 bg-white dark:bg-zinc-950">
          {/* Metadata Row */}
          <View className="flex-row items-center gap-4 mb-4">
            <View className="flex-row items-center gap-1">
              <Calendar size={12} className="text-slate-400" />
              <Text className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase">
                {dateStr}
              </Text>
            </View>
            {blog.author ? (
              <View className="flex-row items-center gap-1">
                <User size={12} className="text-slate-400" />
                <Text className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase">
                  {blog.author?.name || blog.author}
                </Text>
              </View>
            ) : null}
          </View>

          <Text className="text-2xl font-black text-foreground mb-6 leading-snug">
            {blog.title}
          </Text>

          {/* Body content */}
          <Text className="text-sm font-medium text-slate-600 dark:text-zinc-400 leading-loose">
            {plainBody}
          </Text>
        </View>
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
