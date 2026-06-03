import React from 'react';
import { Tabs } from 'expo-router';
import { Home, LayoutGrid, Heart, ShoppingCart, User } from 'lucide-react-native';
import { useAppStore } from '../../store/appStore';
import { useCartStore } from '../../store/cartStore';
import { View, Text, Pressable } from 'react-native';

function CustomCartTabBarButton({ onPress, totalCartItems }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        top: -12,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      className="active:scale-95"
    >
      <View
        className="w-13 h-13 rounded-full justify-center items-center shadow-lg relative border-4 border-white dark:border-zinc-950"
        style={{ backgroundColor: '#0F172A' }}
      >
        <ShoppingCart size={20} color="#FFFFFF" strokeWidth={2.4} />
        {totalCartItems > 0 ? (
          <View className="absolute -top-1 -right-1 bg-red-500 rounded-full h-4.5 min-w-4.5 px-1 items-center justify-center">
            <Text className="text-white text-[8px] font-black text-center">
              {totalCartItems}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function TabLayout() {
  const theme = useAppStore((s) => s.theme);
  const totalCartItems = useCartStore((s) => s.totalItems);

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#09090B' : '#FFFFFF';
  const inactiveColor = isDark ? '#4B5563' : '#9CA3AF';
  const borderColor = isDark ? '#27272A' : '#E2E8F0';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopColor: borderColor,
          height: 64,
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarActiveTintColor: isDark ? '#FFFFFF' : '#0F0F11',
        tabBarInactiveTintColor: inactiveColor,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => <LayoutGrid size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarButton: (props) => (
            <CustomCartTabBarButton {...props} totalCartItems={totalCartItems} />
          ),
        }}
      />

      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
