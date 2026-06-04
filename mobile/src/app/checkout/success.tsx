import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import { useAppStore } from '../../store/appStore';
import { Button } from '../../components/ui/Button';
import { useCartStore } from '../../store/cartStore';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId, status, reason } = useLocalSearchParams();
  const theme = useAppStore((s) => s.theme);
  const dangerColor = theme === 'dark' ? '#E86B6B' : '#B52323';
  const successColor = theme === 'dark' ? '#51B582' : '#217A52';

  const clearCart = useCartStore((s) => s.clearCart);
  const clearBuyNowItem = useCartStore((s) => s.clearBuyNowItem);

  const isFailed = status === 'failed';

  useEffect(() => {
    if (!isFailed) {
      clearCart();
      clearBuyNowItem();
    }
  }, [clearBuyNowItem, clearCart, isFailed]);

  return (
    <SafeAreaView className="flex-1 bg-background justify-center px-6" style={{ flex: 1 }}>
      <View className="items-center text-center">
        {isFailed ? (
          <>
            {/* Failure Card */}
            <View className="mb-6 bg-red-50 dark:bg-red-950/20 p-5 rounded-full">
              <XCircle size={64} color={dangerColor} />
            </View>

            <Text className="text-2xl font-black text-foreground italic mb-2 uppercase text-center">
              Payment Failed
            </Text>
            
            <Text className="text-sm font-semibold text-slate-500 dark:text-zinc-400 text-center mb-10 px-4">
              {reason || 'We could not process your transaction at this time. Please try again.'}
            </Text>

            <Button
              title="Return to Shop"
              onPress={() => router.replace('/(tabs)/shop')}
              className="w-full mb-3 rounded-xl"
            />
          </>
        ) : (
          <>
            {/* Success Card */}
            <View className="mb-6 bg-emerald-50 dark:bg-emerald-950/20 p-5 rounded-full">
              <CheckCircle2 size={64} color={successColor} />
            </View>

            <Text className="text-2xl font-black text-foreground italic mb-2 uppercase text-center">
              Order Placed!
            </Text>
            
            <Text className="text-sm font-semibold text-slate-500 dark:text-zinc-400 text-center mb-4">
              Thank you for shopping with us. Your invoice has been generated.
            </Text>

            {orderId ? (
              <View className="bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/40 py-2.5 px-5 rounded-xl mb-10">
                <Text className="text-xs font-mono font-bold text-foreground">
                  ID: {String(orderId).slice(-12).toUpperCase()}
                </Text>
              </View>
            ) : null}

            {orderId ? (
              <Button
                title="Track Order"
                variant="primary"
                onPress={() =>
                  router.push({
                    pathname: '/order/track',
                    params: { orderId: String(orderId) },
                  })
                }
                className="w-full mb-3 rounded-xl flex-row items-center gap-2"
              />
            ) : null}

            <Button
              title="Continue Shopping"
              variant={orderId ? 'outline' : 'primary'}
              onPress={() => router.replace('/(tabs)')}
              className="w-full rounded-xl"
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
