import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { LogOut, Package, Languages, MessageSquare, ChevronRight, MapPin, BookOpen } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { api } from '../../lib/api';
import { getTranslation } from '../../utils/i18n';
import { Button } from '../../components/ui/Button';

export default function ProfileScreen() {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const t = getTranslation('profile', lang);

  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Load orders history if authenticated
  const { data: orders, isLoading } = useQuery({
    queryKey: ['myOrders', user?._id],
    queryFn: async () => {
      const { data } = await api.get('/orders/my-orders');
      return data || [];
    },
    enabled: isAuthenticated,
  });

  const handleLangToggle = () => {
    setLang(lang === 'en' ? 'bn' : 'en');
  };

  const handleLogout = () => {
    const performLogout = async () => {
      try {
        await logout();
      } catch (err) {
        console.error('Logout failed:', err);
      }
    };

    if (Platform.OS === 'web') {
      const confirm = window.confirm('Are you sure you want to log out?');
      if (confirm) {
        performLogout();
      }
    } else {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: performLogout,
        },
      ]);
    }
  };

  // Filter orders by status
  const ordersList = Array.isArray(orders) ? orders : orders?.orders || [];
  const activeOrders = ordersList.filter(
    (o: any) => o.orderStatus === 'Pending' || o.orderStatus === 'Processing' || o.orderStatus === 'Shipped'
  );
  const completedOrders = ordersList.filter(
    (o: any) => o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled'
  );

  const displayedOrders = activeTab === 'active' ? activeOrders : completedOrders;
  const roleLabel = typeof user?.role === 'object' ? user.role?.name : user?.role;

  return (
    <SafeAreaView className="flex-1 bg-background" style={{ flex: 1 }}>
      {/* Header bar */}
      <View className="px-4 py-4 border-b border-slate-100 dark:border-zinc-900 bg-white dark:bg-zinc-950">
        <Text className="text-lg font-black text-foreground italic uppercase tracking-wider">
          {t.title || 'My Profile'}
        </Text>
      </View>

      <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false} className="flex-1 px-5 py-4">
        {/* User Card Area */}
        {isAuthenticated && user ? (
          <View className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/40 p-5 rounded-3xl flex-row items-center mb-6">
            <View className="w-14 h-14 bg-primary dark:bg-white rounded-full items-center justify-center mr-4">
              <Text className="text-white dark:text-black font-black text-lg uppercase">
                {user.name?.slice(0, 2) || 'US'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-black text-foreground">{user.name}</Text>
              <Text className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-0.5">{user.email}</Text>
              <Text className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mt-1.5 bg-slate-50 dark:bg-zinc-950 align-self-start py-0.5 px-2 rounded-md">
                Role: {roleLabel || 'Member'}
              </Text>
            </View>
          </View>
        ) : (
          <View className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-800/40 p-6 rounded-3xl items-center mb-6">
            <Text className="text-base font-black text-foreground italic uppercase tracking-wider mb-2">
              Guest Session
            </Text>
            <Text className="text-xs text-slate-500 dark:text-zinc-400 text-center mb-5">
              Login to view your purchase invoices, check delivery schedules, and start support chats.
            </Text>
            <Button
              title="Sign In / Register"
              onPress={() => router.push('/(auth)/login')}
              className="w-2/3 h-10 py-2 rounded-xl"
            />
          </View>
        )}

        {/* Order History Tabs (only when authenticated) */}
        {isAuthenticated ? (
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xs font-black text-foreground uppercase tracking-widest italic">
                {t.orders || 'Order History'}
              </Text>
              <Pressable
                onPress={() => router.push('/order')}
                className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
              >
                <Text className="text-[9px] font-black text-primary uppercase tracking-widest">
                  View All
                </Text>
                <ChevronRight size={12} className="text-primary" />
              </Pressable>
            </View>

            {/* Tab Toggles */}
            <View className="flex-row bg-slate-50 dark:bg-zinc-950 rounded-xl p-1 border border-slate-100 dark:border-zinc-900 mb-4">
              <Pressable
                onPress={() => setActiveTab('active')}
                className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === 'active' ? 'bg-white dark:bg-zinc-900 shadow-sm' : ''
                  }`}
              >
                <Text
                  className={`text-xs font-bold uppercase tracking-wider ${activeTab === 'active' ? 'text-foreground' : 'text-slate-500 dark:text-zinc-400'
                    }`}
                >
                  {t.activeOrders || 'Active'} ({activeOrders.length})
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveTab('completed')}
                className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === 'completed' ? 'bg-white dark:bg-zinc-900 shadow-sm' : ''
                  }`}
              >
                <Text
                  className={`text-xs font-bold uppercase tracking-wider ${activeTab === 'completed' ? 'text-foreground' : 'text-slate-500 dark:text-zinc-400'
                    }`}
                >
                  {t.completedOrders || 'Completed'} ({completedOrders.length})
                </Text>
              </Pressable>
            </View>

            {/* Orders Feed */}
            {isLoading ? (
              <ActivityIndicator size="small" color="#0F0F11" className="py-4" />
            ) : displayedOrders.length === 0 ? (
              <Text className="text-xs font-semibold text-slate-400 dark:text-zinc-500 italic text-center py-4">
                No orders listed.
              </Text>
            ) : (
              displayedOrders.map((order: any) => (
                <View
                  key={order._id}
                  className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/40 p-4 rounded-2xl mb-3"
                >
                  <View className="flex-row justify-between items-center mb-2.5">
                    <Text className="text-xs font-mono font-bold text-foreground">
                      ID: {order._id.slice(-10).toUpperCase()}
                    </Text>
                    <View
                      className={`py-1 px-2.5 rounded-md ${order.orderStatus === 'Delivered'
                          ? 'bg-emerald-50 dark:bg-emerald-950/20'
                          : order.orderStatus === 'Cancelled'
                            ? 'bg-red-50 dark:bg-red-950/20'
                            : 'bg-amber-50 dark:bg-amber-950/20'
                        }`}
                    >
                      <Text
                        className={`text-[9px] font-black uppercase ${order.orderStatus === 'Delivered'
                            ? 'text-emerald-600'
                            : order.orderStatus === 'Cancelled'
                              ? 'text-red-500'
                              : 'text-amber-600'
                          }`}
                      >
                        {order.orderStatus}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mb-4">
                    Date: {new Date(order.createdAt).toLocaleDateString()} • Items: {order.orderItems?.length || 1}
                  </Text>

                  <View className="flex-row justify-between items-center border-t border-slate-50 dark:border-zinc-950 pt-3">
                    <Text className="text-base font-black text-foreground italic">
                      ৳{Math.round(order.totalPrice).toLocaleString()}
                    </Text>

                    {order.orderStatus !== 'Cancelled' ? (
                      <Pressable
                        onPress={() =>
                          router.push({
                            pathname: '/order/track',
                            params: { orderId: order._id },
                          })
                        }
                        className="bg-primary/5 dark:bg-white/5 border border-slate-100 dark:border-zinc-800 py-1.5 px-4 rounded-lg active:scale-95 flex-row items-center gap-1"
                      >
                        <Package size={12} className="text-foreground" />
                        <Text className="text-[10px] font-bold text-foreground uppercase tracking-wide">
                          Track Order
                        </Text>
                      </Pressable>
                    ) : null}
                  </View>
                </View>
              ))
            )}
          </View>
        ) : null}

        {/* Quick Links / Menu Area */}
        <View className="mb-10">
          <Text className="text-xs font-black text-foreground uppercase tracking-widest italic mb-4">
            {t.settings || 'System Settings'}
          </Text>

          <View className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/40 rounded-3xl overflow-hidden">
            {/* Language Switcher */}
            <Pressable
              onPress={handleLangToggle}
              className="flex-row items-center justify-between p-4 border-b border-slate-50 dark:border-zinc-950 active:bg-slate-50 dark:active:bg-zinc-800/20"
            >
              <View className="flex-row items-center gap-3">
                <Languages size={18} className="text-slate-500 dark:text-zinc-400" />
                <Text className="text-sm font-semibold text-foreground">
                  {lang === 'en' ? 'Switch to Bangla' : 'ইংরেজিতে পরিবর্তন করুন'}
                </Text>
              </View>
              <ChevronRight size={16} className="text-slate-400" />
            </Pressable>

            {/* Address Book Mock */}
            <Pressable
              onPress={() => Alert.alert('Address Book', 'Use checkout forms to update shipping settings.')}
              className="flex-row items-center justify-between p-4 border-b border-slate-50 dark:border-zinc-950 active:bg-slate-50 dark:active:bg-zinc-800/20"
            >
              <View className="flex-row items-center gap-3">
                <MapPin size={18} className="text-slate-500 dark:text-zinc-400" />
                <Text className="text-sm font-semibold text-foreground">
                  {t.addressBook || 'Address Book'}
                </Text>
              </View>
              <ChevronRight size={16} className="text-slate-400" />
            </Pressable>

            {/* Blog & Articles link */}
            <Pressable
              onPress={() => router.push('/blog')}
              className="flex-row items-center justify-between p-4 border-b border-slate-50 dark:border-zinc-950 active:bg-slate-50 dark:active:bg-zinc-800/20"
            >
              <View className="flex-row items-center gap-3">
                <BookOpen size={18} className="text-slate-500 dark:text-zinc-400" />
                <Text className="text-sm font-semibold text-foreground">
                  Blog & Articles
                </Text>
              </View>
              <ChevronRight size={16} className="text-slate-400" />
            </Pressable>


            {/* Customer Support Chat */}
            {isAuthenticated ? (
              <Pressable
                onPress={() => router.push('/support/chat')}
                className="flex-row items-center justify-between p-4 active:bg-slate-50 dark:active:bg-zinc-800/20"
              >
                <View className="flex-row items-center gap-3">
                  <MessageSquare size={18} className="text-slate-500 dark:text-zinc-400" />
                  <Text className="text-sm font-semibold text-foreground">
                    {t.supportChat || 'Live Support Chat'}
                  </Text>
                </View>
                <ChevronRight size={16} className="text-slate-400" />
              </Pressable>
            ) : null}
          </View>

          {/* Log Out Button (Only when authenticated) */}
          {isAuthenticated ? (
            <Pressable
              onPress={handleLogout}
              className="mt-6 flex-row items-center justify-center p-4 border border-red-200 bg-red-500/5 rounded-2xl active:scale-95"
            >
              <LogOut size={18} color="#EF4444" className="mr-2" />
              <Text className="text-sm font-bold text-red-500 uppercase tracking-wider">
                {t.logout || 'Log Out'}
              </Text>
            </Pressable>
          ) : null}
        </View>
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
