import React from 'react';
import { View, Text, FlatList, SafeAreaView, Pressable, Image, Share } from 'react-native';
import { Heart, ArrowLeft, Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { Button } from '../../components/ui/Button';
import { safeBack } from '../../utils/navigation';
import { getImageUrl } from '../../lib/api';

export default function WishlistScreen() {
  const router = useRouter();
  const wishlistItems = useCartStore((s) => s.wishlistItems);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const lang = useAppStore((s) => s.lang);

  const isBn = lang === 'bn';

  const t = {
    title: isBn ? 'আমার উইশলিস্ট' : 'Wishlist',
    emptyTitle: isBn ? 'আপনার উইশলিস্ট খালি' : 'Your Wishlist is Empty',
    emptySub: isBn
      ? 'আপনার পছন্দের পণ্যগুলো এখানে সংরক্ষণ করতে হৃদপিণ্ড আইকনটিতে ক্লিক করুন।'
      : 'Tap the heart icon on any product to save it here for later.',
    startShopping: isBn ? 'কেনাকাটা শুরু করুন' : 'Start Shopping',
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2 bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-900 h-14 z-10">
        <Pressable
          onPress={safeBack}
          className="w-9 h-9 items-center justify-center rounded-full active:scale-95"
        >
          <ArrowLeft size={22} className="text-foreground" />
        </Pressable>

        <Text className="text-base font-black text-foreground uppercase tracking-widest">
          {t.title}
        </Text>

        <View className="w-9 h-9 items-center justify-center">
          <Heart size={22} className="text-foreground" />
        </View>
      </View>

      {/* Main Content */}
      {wishlistItems.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8 bg-background">
          <View className="w-16 h-16 bg-slate-50 dark:bg-zinc-900 rounded-full items-center justify-center mb-4 border border-slate-100 dark:border-zinc-800">
            <Heart size={28} className="text-slate-400 dark:text-zinc-500" />
          </View>
          <Text className="text-lg font-black text-foreground italic mb-2 text-center uppercase tracking-wider">
            {t.emptyTitle}
          </Text>
          <Text className="text-xs text-slate-500 dark:text-zinc-400 text-center mb-8 max-w-[280px]">
            {t.emptySub}
          </Text>
          <Button
            title={t.startShopping}
            onPress={() => router.push('/shop')}
            className="w-48"
          />
        </View>
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => {
            const imageUrl = getImageUrl(item.images?.[0]);
            return (
              <Pressable
                onPress={() => router.push(`/product/${item.slug}`)}
                className="flex-row bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/40 p-3 rounded-2xl mb-3 items-center"
              >
                {/* Left Product Image */}
                <Image
                  source={{ uri: imageUrl }}
                  className="w-20 h-20 rounded-xl bg-slate-50 dark:bg-zinc-950"
                  resizeMode="cover"
                />

                {/* Middle details */}
                <View className="flex-1 ml-4 pr-1">
                  <Text numberOfLines={1} className="text-sm font-bold text-foreground mb-1">
                    {item.name}
                  </Text>
                  <Text className="text-sm font-black text-foreground italic">
                    ৳{Math.round(item.price).toLocaleString()}
                  </Text>
                </View>

                {/* Right side actions */}
                <View className="h-20 justify-between items-end pl-2">
                  {/* Heart toggle */}
                  <Pressable
                    onPress={() => toggleWishlist(item, isAuthenticated)}
                    className="p-1 active:scale-90"
                  >
                    <Heart size={20} color="#EF4444" fill="#EF4444" />
                  </Pressable>

                  {/* Share button */}
                  <Pressable
                    onPress={async () => {
                      try {
                        await Share.share({
                          message: `Check out ${item.name} on Vanguard! Only ৳${item.price}`,
                        });
                      } catch (err: any) {
                        console.warn(err);
                      }
                    }}
                    className="p-1 active:scale-90"
                  >
                    <Share2 size={16} className="text-slate-400 dark:text-zinc-500" />
                  </Pressable>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
