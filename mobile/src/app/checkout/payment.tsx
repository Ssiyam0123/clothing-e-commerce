import React, { useRef } from 'react';
import { View, Pressable, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { ArrowLeft } from 'lucide-react-native';
import { useCartStore } from '../../store/cartStore';
import { safeBack } from '../../utils/navigation';

export default function PaymentScreen() {
  const router = useRouter();
  const { url } = useLocalSearchParams();
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
      <SafeAreaView className="flex-1 bg-background justify-center items-center p-6" style={{ flex: 1 }}>
        <Text className="text-sm font-semibold text-slate-500">Invalid Payment Session</Text>
        <Pressable onPress={safeBack} className="mt-4 bg-primary py-2.5 px-6 rounded-xl">
          <Text className="text-white font-bold">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" style={{ flex: 1 }}>
      {/* Header bar */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-zinc-950 border-b border-slate-50 dark:border-zinc-900">
        <Pressable
          onPress={safeBack}
          className="w-9 h-9 items-center justify-center bg-slate-50 dark:bg-zinc-900 rounded-full active:scale-95"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </Pressable>
        <Text className="text-base font-black text-foreground italic uppercase tracking-wider">
          Secure Payment
        </Text>
        <View className="w-9 h-9" />
      </View>

      <WebView
        source={{ uri: String(paymentUrl) }}
        onNavigationStateChange={handleNavigationChange}
        startInLoadingState={true}
        renderLoading={() => (
          <View className="absolute inset-0 items-center justify-center bg-white dark:bg-zinc-950">
            <ActivityIndicator size="large" color="#0F0F11" />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
