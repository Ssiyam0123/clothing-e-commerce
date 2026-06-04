import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { View, Text, ActivityIndicator, Appearance } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';

import '../global.css';
import { AnimatedSplashOverlay } from '../components/animated-icon';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';

// Setup TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  },
});

export default function RootLayout() {
  const { theme, initApp, maintenanceMode, isInitialized } = useAppStore();
  const checkSession = useAuthStore((s) => s.checkSession);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const syncWithServer = useCartStore((s) => s.syncWithServer);

  // Load app settings and user session on startup
  useEffect(() => {
    const startup = async () => {
      await initApp();
      await checkSession();
    };
    startup();
  }, [checkSession, initApp]);

  // Sync cart with backend once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      syncWithServer();
    }
  }, [isAuthenticated, syncWithServer]);

  // Sync theme with native Appearance API and Web document class
  useEffect(() => {
    if (typeof window !== 'undefined' && window.document) {
      const root = window.document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      // Inject robust web scrolling style overrides
      let styleEl = window.document.getElementById('web-scroll-override');
      if (!styleEl) {
        styleEl = window.document.createElement('style');
        styleEl.id = 'web-scroll-override';
        window.document.head.appendChild(styleEl);
      }
      styleEl.innerHTML = `
        html, body, #root, #root > div {
          overflow: auto !important;
          height: 100% !important;
        }
        [class*="r-overflow"] {
          overflow: auto !important;
          overflow-y: auto !important;
        }
        div[style*="overflow: hidden"], div[style*="overflow:hidden"] {
          overflow: auto !important;
        }
      `;
    } else {
      // On native mobile, set native Appearance scheme so NativeWind `dark:` styles apply
      Appearance.setColorScheme(theme);
    }
  }, [theme]);

  // Determine active color theme
  const activeTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  if (!isInitialized) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#0F0F11" />
      </View>
    );
  }

  // 🛡️ App Maintenance Mode gate
  if (maintenanceMode) {
    return (
      <ThemeProvider value={activeTheme}>
        <View className="flex-1 items-center justify-center bg-background px-6">
          <Text className="text-3xl font-black text-foreground mb-4 text-center italic">
            Maintenance Mode
          </Text>
          <Text className="text-sm font-semibold text-slate-500 dark:text-zinc-400 text-center mb-8">
            Our systems are currently undergoing updates. Please try again later.
          </Text>
          <Button title="Retry" onPress={initApp} className="w-1/2" />
        </View>
      </ThemeProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider value={activeTheme}>
          <AnimatedSplashOverlay />

          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="(auth)/register" />
            <Stack.Screen name="product/[slug]" />
            <Stack.Screen name="checkout/index" />
            <Stack.Screen name="checkout/payment" />
            <Stack.Screen name="checkout/success" />
            <Stack.Screen name="order/track" />
            <Stack.Screen name="support/chat" />
          </Stack>

          <FlashMessage position="top" />
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
