import React from 'react';
import { Tabs } from 'expo-router';
import { Home, LayoutGrid, Heart, ShoppingCart, User } from 'lucide-react-native';
import { useAppStore } from '../../store/appStore';
import { useCartStore } from '../../store/cartStore';
import { View, Text, Pressable } from 'react-native';

const navTheme = {
  light: {
    surface: '#FFFFFF',
    border: '#E5E5E5',
    active: '#4A3525',
    inactive: '#6B6B6B',
  },
  dark: {
    surface: '#2C2C2E',
    border: '#3A3A3C',
    active: '#FFFFFF',
    inactive: '#A1A1A6',
  },
};

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
        className="relative h-13 w-13 items-center justify-center rounded-full border-4 border-card bg-primary shadow-nav"
      >
        <ShoppingCart size={20} className="text-primary-foreground" strokeWidth={2.4} />
        {totalCartItems > 0 ? (
          <View className="absolute -right-1 -top-1 h-4.5 min-w-4.5 items-center justify-center rounded-full bg-danger px-1">
            <Text className="text-center text-[8px] font-black text-primary-foreground">
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
  const colors = isDark ? navTheme.dark : navTheme.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,
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
