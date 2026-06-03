import React from 'react';
import { View, Text, ScrollView, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, Circle, Clock } from 'lucide-react-native';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { safeBack } from '../../utils/navigation';

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  // Fetch specific order details
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['orderDetails', orderId],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${orderId}`);
      return data;
    },
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#0F0F11" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-lg font-black text-foreground italic mb-4">Order Record Not Found</Text>
        <Button title="Go Back" onPress={safeBack} className="w-1/2" />
      </SafeAreaView>
    );
  }

  const status = order.orderStatus; // Pending, Processing, Shipped, Delivered, Cancelled
  const orderDate = new Date(order.createdAt);
  const expectedDate = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000); // Placed + 3 days

  // Helper to determine status step completion
  const getStepStatus = (step: 'placed' | 'confirmed' | 'shipped' | 'delivered') => {
    if (status === 'Cancelled') return 'inactive';

    switch (step) {
      case 'placed':
        return 'completed'; // always completed if not cancelled
      case 'confirmed':
        return ['Processing', 'Shipped', 'Delivered'].includes(status) ? 'completed' : 'pending';
      case 'shipped':
        return ['Shipped', 'Delivered'].includes(status) ? 'completed' : 'pending';
      case 'delivered':
        return status === 'Delivered' ? 'completed' : 'pending';
      default:
        return 'pending';
    }
  };

  const steps = [
    {
      key: 'placed',
      title: 'Order Placed',
      desc: 'We have received your order.',
      dateStr: orderDate.toLocaleDateString(),
    },
    {
      key: 'confirmed',
      title: 'Processing / Confirmed',
      desc: 'Your payment was validated and items packed.',
      dateStr: getStepStatus('confirmed') === 'completed' ? 'Processed' : '--',
    },
    {
      key: 'shipped',
      title: 'Shipped / Out for Delivery',
      desc: 'Courier dropped parcel and it is in transit.',
      dateStr: getStepStatus('shipped') === 'completed' ? 'In Transit' : '--',
    },
    {
      key: 'delivered',
      title: 'Delivered',
      desc: 'Parcel was successfully delivered to your hands.',
      dateStr: getStepStatus('delivered') === 'completed' ? 'Delivered' : '--',
    },
  ];

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
          Order Tracking
        </Text>
        <View className="w-9 h-9" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5 py-4">
        {/* Order Details Banner */}
        <View className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/40 p-5 rounded-3xl mb-6 shadow-sm">
          <Text className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
            Invoice details
          </Text>
          <Text className="text-lg font-black text-foreground mb-4">
            ID: #{order._id.slice(-10).toUpperCase()}
          </Text>
          
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Order Placed</Text>
            <Text className="text-xs font-bold text-foreground">{orderDate.toLocaleDateString()}</Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Expected Delivery</Text>
            <Text className="text-xs font-bold text-foreground">{expectedDate.toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Cancelled Flag */}
        {status === 'Cancelled' ? (
          <View className="bg-red-50 dark:bg-red-950/20 border border-red-200/50 p-4 rounded-2xl flex-row items-center gap-3 mb-6">
            <Text className="text-sm font-bold text-red-500 uppercase tracking-wider">
              ⚠️ Order has been Cancelled
            </Text>
          </View>
        ) : null}

        {/* Timeline Tracks */}
        <View className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/40 p-6 rounded-3xl mb-6">
          <Text className="text-xs font-black text-foreground uppercase tracking-widest italic mb-6">
            Delivery Schedule
          </Text>

          <View className="relative">
            {steps.map((step, idx) => {
              const stepState = getStepStatus(step.key as any);
              const isCompleted = stepState === 'completed';
              const isLast = idx === steps.length - 1;

              return (
                <View key={step.key} className="flex-row items-start mb-6 position-relative">
                  {/* Left Icon Tracker Column */}
                  <View className="items-center mr-4">
                    <View className="z-10 bg-white dark:bg-zinc-900 rounded-full">
                      {isCompleted ? (
                        <CheckCircle2 size={22} color="#10B981" fill="#10B981" />
                      ) : (
                        <Circle size={22} color="#94A3B8" />
                      )}
                    </View>
                    
                    {/* Connecting Vertical Bar */}
                    {!isLast ? (
                      <View
                        className={`w-0.5 h-16 absolute top-5 -bottom-5 ${
                          isCompleted ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800'
                        }`}
                      />
                    ) : null}
                  </View>

                  {/* Text descriptions */}
                  <View className="flex-1 pb-2">
                    <View className="flex-row justify-between items-baseline mb-1">
                      <Text
                        className={`text-sm font-bold ${
                          isCompleted ? 'text-foreground' : 'text-slate-400 dark:text-zinc-500'
                        }`}
                      >
                        {step.title}
                      </Text>
                      <Text className="text-[10px] font-bold text-slate-400 dark:text-zinc-500">{step.dateStr}</Text>
                    </View>
                    <Text className="text-xs font-medium text-slate-500 dark:text-zinc-400 leading-normal">
                      {step.desc}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
