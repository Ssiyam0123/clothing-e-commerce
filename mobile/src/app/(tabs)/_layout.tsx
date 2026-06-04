import React from 'react';
import { Tabs } from 'expo-router';
import { Home, LayoutGrid, Heart, ShoppingCart, User } from 'lucide-react-native';
import { useAppStore } from '../../store/appStore';
import { useCartStore } from '../../store/cartStore';
import { View, Text, Pressable } from 'react-native';

import { getBrandTokens, withAlpha } from '../../constants/designSystem';

function CustomCartTabBarButton({ onPress, totalCartItems, palette }: any) {
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
        className="relative h-13 w-13 items-center justify-center rounded-full border-4 shadow-nav"
        style={{
          backgroundColor: palette.primary,
          borderColor: palette.surface,
          shadowColor: palette.primary,
          shadowOpacity: 0.28,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
          elevation: 8,
        }}
      >
        <ShoppingCart size={20} color={palette.onPrimary} strokeWidth={2.4} />
        {totalCartItems > 0 ? (
          <View className="absolute -right-1 -top-1 h-4.5 min-w-4.5 items-center justify-center rounded-full px-1" style={{ backgroundColor: palette.danger }}>
            <Text className="text-center text-[8px] font-black" style={{ color: palette.onPrimary }}>
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
  const palette = getBrandTokens(theme);
  const tabSurface = theme === 'dark' ? palette.nav : palette.surface;
  const activeColor = theme === 'dark' ? palette.accent : palette.primary;
  const inactiveColor = theme === 'dark' ? withAlpha(palette.navText, 0.68) : palette.textSecondary;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: tabSurface,
          borderTopColor: palette.border,
          borderTopWidth: 1,
          height: 66,
          paddingBottom: 0,
          paddingTop: 0,
          shadowColor: palette.primary,
          shadowOpacity: theme === 'dark' ? 0.28 : 0.14,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: -8 },
          elevation: 18,
        },
        tabBarActiveTintColor: activeColor,
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
            <CustomCartTabBarButton {...props} totalCartItems={totalCartItems} palette={palette} />
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
