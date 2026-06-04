import React, { useRef } from 'react';
import { View, Pressable, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { ArrowLeft } from 'lucide-react-native';
import { getBrandTokens } from '../../constants/designSystem';
import { useAppStore } from '../../store/appStore';
import { useCartStore } from '../../store/cartStore';
import { safeBack } from '../../utils/navigation';

export default function PaymentScreen() {
  const router = useRouter();
  const { url } = useLocalSearchParams();
  const theme = useAppStore((s) => s.theme);
  const palette = getBrandTokens(theme);
  const clearCart = useCartStore((s) => s.clearCart);
  const handledRedirectRef = useRef(false);
  const paymentUrl = Array.isArray(url) ? url[0] : url;

  const handleNavigationChange = (navState: any) => {
    if (handledRedirectRef.current) return;
    const currentUrl = navState.url;
    console.log('[WebView] Navigating to:', currentUrl);

    // 1. Success Callback Redirect
    if (currentUrl.includes('/payment/success')) {
      handledRedirectRef.current = true;
      // Extract orderId from URL query string
      let orderId = '';
      const match = currentUrl.match(/[?&]orderId=([^&]+)/);
      if (match && match[1]) {
        orderId = match[1];
      }

      // Clear local cart since purchase is completed
      clearCart();

      // Redirect to mobile success screen
      router.replace({
        pathname: '/checkout/success',
        params: { orderId, status: 'success' },
      });
    }

    // 2. Failed / Cancelled Callback Redirect
    if (currentUrl.includes('/payment/failed') || currentUrl.includes('/payment/cancel')) {
      handledRedirectRef.current = true;
      let reason = 'Payment verification failed';
      const match = currentUrl.match(/[?&]reason=([^&]+)/);
      if (match && match[1]) {
        reason = decodeURIComponent(match[1]);
      }

      router.replace({
        pathname: '/checkout/success',
        params: { status: 'failed', reason },
      });
    }
  };

  if (!paymentUrl) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center p-6" style={{ flex: 1, backgroundColor: palette.background }}>
        <Text className="text-sm font-semibold" style={{ color: palette.textSecondary }}>Invalid Payment Session</Text>
        <Pressable onPress={safeBack} className="mt-4 py-2.5 px-6 rounded-xl" style={{ backgroundColor: palette.primary }}>
          <Text className="font-bold" style={{ color: palette.onPrimary }}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ flex: 1, backgroundColor: palette.background }}>
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
          Secure Payment
        </Text>
        <View className="w-9 h-9" />
      </View>

      <WebView
        source={{ uri: String(paymentUrl) }}
        onNavigationStateChange={handleNavigationChange}
        startInLoadingState={true}
        renderLoading={() => (
          <View className="absolute inset-0 items-center justify-center" style={{ backgroundColor: palette.background }}>
            <ActivityIndicator size="large" color={palette.primary} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
