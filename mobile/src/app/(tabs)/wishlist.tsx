import React from 'react';
import { View, Text, FlatList, Pressable, Image, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, ArrowLeft, Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { Button } from '../../components/ui/Button';
import { safeBack } from '../../utils/navigation';
import { getImageUrl } from '../../lib/api';
import { getBrandTokens } from '../../constants/designSystem';

export default function WishlistScreen() {
  const router = useRouter();
  const wishlistItems = useCartStore((s) => s.wishlistItems);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const palette = getBrandTokens(theme);

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
    <SafeAreaView className="flex-1" style={{ flex: 1, backgroundColor: palette.background }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2 border-b h-14 z-10" style={{ backgroundColor: palette.nav, borderColor: palette.border }}>
        <Pressable
          onPress={safeBack}
          className="w-9 h-9 items-center justify-center rounded-full active:scale-95"
        >
          <ArrowLeft size={22} color={palette.navText} />
        </Pressable>

        <Text className="text-base font-black uppercase tracking-widest" style={{ color: palette.navText }}>
          {t.title}
        </Text>

        <View className="w-9 h-9 items-center justify-center">
          <Heart size={22} color={palette.navText} />
        </View>
      </View>

      {/* Main Content */}
      {wishlistItems.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8" style={{ backgroundColor: palette.background }}>
          <View className="w-16 h-16 rounded-full items-center justify-center mb-4 border" style={{ backgroundColor: palette.surfaceSoft, borderColor: palette.border }}>
            <Heart size={28} color={palette.iconMuted} />
          </View>
          <Text className="text-lg font-black italic mb-2 text-center uppercase tracking-wider" style={{ color: palette.text }}>
            {t.emptyTitle}
          </Text>
          <Text className="text-xs text-center mb-8 max-w-[280px]" style={{ color: palette.textSecondary }}>
            {t.emptySub}
          </Text>
          <Button
            title={t.startShopping}
            onPress={() => router.push('/(tabs)/shop')}
            className="w-48"
          />
        </View>
      ) : (
        <FlatList overScrollMode="never"
          data={wishlistItems}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          style={{ backgroundColor: palette.background }}
          renderItem={({ item }) => {
            const imageUrl = getImageUrl(item.images?.[0]);
            return (
              <Pressable
                onPress={() => router.push(`/product/${item.slug}`)}
                className="flex-row border p-3 rounded-2xl mb-3 items-center"
                style={{ backgroundColor: palette.surface, borderColor: palette.border }}
              >
                {/* Left Product Image */}
                <Image
                  source={{ uri: imageUrl }}
                  className="w-20 h-20 rounded-xl"
                  style={{ backgroundColor: palette.surfaceSoft }}
                  resizeMode="cover"
                />

                {/* Middle details */}
                <View className="flex-1 ml-4 pr-1">
                  <Text numberOfLines={1} className="text-sm font-bold mb-1" style={{ color: palette.text }}>
                    {item.name}
                  </Text>
                  <Text className="text-sm font-black italic" style={{ color: palette.text }}>
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
                    <Heart size={20} color={palette.danger} fill={palette.danger} />
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
                    <Share2 size={16} color={palette.iconMuted} />
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
