import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  SafeAreaView, 
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Calendar, Clock, Package } from 'lucide-react-native';
import { useOrders } from '../../hooks/useOrders';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import { getTranslation } from '../../utils/i18n';

const formatDateTime = (dateString: string) => {
  if (!dateString) return { date: 'N/A', time: 'N/A' };
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
  const formattedTime = date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });
  return { date: formattedDate, time: formattedTime };
};

export default function OrderListScreen() {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const { user, isAuthenticated } = useAuthStore();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const { 
    orders, 
    total, 
    totalPages,
    myOrdersLoading, 
    myOrdersError,
    refetch 
  } = useOrders(page, 5);

  const t = getTranslation('orders', lang);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  if (myOrdersError) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-black">
        <View className="flex-1 items-center justify-center px-6">
          <Package size={48} className="text-red-400 mb-4" />
          <Text className="text-lg font-black text-foreground mb-2">
            {t?.errorTitle || 'Failed to Load Orders'}
          </Text>
          <Text className="text-sm text-slate-500 dark:text-zinc-400 text-center mb-6">
            {myOrdersError?.message || 'Unable to fetch your orders'}
          </Text>
          <Pressable 
            onPress={() => refetch()}
            className="px-8 py-3 bg-red-500 dark:bg-red-600 rounded-full active:scale-95"
          >
            <Text className="text-white font-black text-sm uppercase tracking-widest">
              {t?.retry || 'Retry'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <Pressable 
          onPress={() => router.back()}
          className="p-2"
        >
          <ChevronLeft size={24} className="text-foreground" />
        </Pressable>
        <Text className="text-base font-black text-foreground uppercase tracking-wider">
          {t?.title || 'My Orders'}
        </Text>
        <View className="w-8" />
      </View>

      {/* Orders List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !myOrdersLoading && (
            <View className="flex-1 items-center justify-center py-20 px-6">
              <Package size={48} className="text-slate-400 dark:text-zinc-500 mb-4" />
              <Text className="text-base font-black text-foreground mb-2">
                {t?.noOrders || 'No Orders Yet'}
              </Text>
              <Text className="text-xs text-slate-500 dark:text-zinc-400 text-center mb-6">
                {t?.noOrdersDesc || 'Start shopping to see your orders here'}
              </Text>
              <Pressable 
                onPress={() => router.push('/(tabs)/shop')}
                className="px-8 py-3 bg-blue-600 dark:bg-blue-500 rounded-full active:scale-95"
              >
                <Text className="text-white font-black text-xs uppercase tracking-widest">
                  {t?.shopNow || 'Shop Now'}
                </Text>
              </Pressable>
            </View>
          )
        }
        ListFooterComponent={
          myOrdersLoading ? (
            <View className="flex-1 items-center justify-center py-6">
              <ActivityIndicator size="large" color="#2563EB" />
            </View>
          ) : null
        }
        renderItem={({ item: order }) => {
          const { date, time } = formatDateTime(order.createdAt);
          const statusColors = {
            'Pending': { bg: 'bg-yellow-50 dark:bg-yellow-950/20', text: 'text-yellow-700 dark:text-yellow-400' },
            'Processing': { bg: 'bg-blue-50 dark:bg-blue-950/20', text: 'text-blue-700 dark:text-blue-400' },
            'Shipped': { bg: 'bg-purple-50 dark:bg-purple-950/20', text: 'text-purple-700 dark:text-purple-400' },
            'Delivered': { bg: 'bg-green-50 dark:bg-green-950/20', text: 'text-green-700 dark:text-green-400' },
            'Cancelled': { bg: 'bg-red-50 dark:bg-red-950/20', text: 'text-red-700 dark:text-red-400' },
          };

          const status = statusColors[order.orderStatus as keyof typeof statusColors] || {
            bg: 'bg-gray-50 dark:bg-gray-950/20',
            text: 'text-gray-700 dark:text-gray-400'
          };

          return (
            <Pressable 
              onPress={() => router.push(`/order/track?orderId=${order._id}`)}
              className="mx-4 mb-3 p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl active:opacity-70"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-xs font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </Text>
                  <Text className="text-sm font-black text-foreground">
                    ৳ {order.totalPrice?.toFixed(0) || '0'}
                  </Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${status.bg}`}>
                  <Text className={`text-[10px] font-black uppercase tracking-widest ${status.text}`}>
                    {order.orderStatus}
                  </Text>
                </View>
              </View>

              {/* Date & Time */}
              <View className="flex-row gap-4 mb-3 pt-3 border-t border-slate-200 dark:border-zinc-800">
                <View className="flex-row items-center gap-2">
                  <Calendar size={12} className="text-slate-400 dark:text-zinc-500" />
                  <Text className="text-[10px] font-bold text-slate-600 dark:text-zinc-400">
                    {date}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Clock size={12} className="text-slate-400 dark:text-zinc-500" />
                  <Text className="text-[10px] font-bold text-slate-600 dark:text-zinc-400">
                    {time}
                  </Text>
                </View>
              </View>

              {/* Items Preview */}
              <View className="flex-row gap-2">
                {order.orderItems?.slice(0, 3).map((item: any, idx: number) => (
                  <View key={idx} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                    {item.product?.images?.[0] && (
                      <Text className="text-[8px] text-slate-500 dark:text-zinc-400 text-center pt-1">
                        {item.product?.name?.substring(0, 1)}
                      </Text>
                    )}
                  </View>
                ))}
                {order.orderItems?.length > 3 && (
                  <View className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 items-center justify-center">
                    <Text className="text-[8px] font-black text-slate-600 dark:text-zinc-400">
                      +{order.orderItems.length - 3}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Pagination Info */}
      {totalPages > 1 && (
        <View className="flex-row justify-between items-center px-4 py-4 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <Pressable 
            disabled={page === 1}
            onPress={() => setPage(page - 1)}
            className={`px-4 py-2 rounded-lg ${page === 1 ? 'bg-slate-100 dark:bg-zinc-800' : 'bg-blue-600 dark:bg-blue-500'}`}
          >
            <Text className={`text-xs font-black uppercase tracking-widest ${page === 1 ? 'text-slate-400 dark:text-zinc-500' : 'text-white'}`}>
              Previous
            </Text>
          </Pressable>
          <Text className="text-xs font-bold text-slate-600 dark:text-zinc-400">
            {t?.page || 'Page'} {page} / {totalPages}
          </Text>
          <Pressable 
            disabled={page >= totalPages}
            onPress={() => setPage(page + 1)}
            className={`px-4 py-2 rounded-lg ${page >= totalPages ? 'bg-slate-100 dark:bg-zinc-800' : 'bg-blue-600 dark:bg-blue-500'}`}
          >
            <Text className={`text-xs font-black uppercase tracking-widest ${page >= totalPages ? 'text-slate-400 dark:text-zinc-500' : 'text-white'}`}>
              Next
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
