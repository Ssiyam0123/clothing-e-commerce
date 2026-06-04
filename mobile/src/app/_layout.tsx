import React, { useEffect, useMemo } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { View, Text, ActivityIndicator, Appearance } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';
import { VariableContextProvider } from 'nativewind';

import '../global.css';
import { AnimatedSplashOverlay } from '../components/animated-icon';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';
import { getBrandScheme, getNativeThemeVars } from '../constants/designSystem';

const loaderColor = '#4A3525';

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
  const { theme, lang, initApp, maintenanceMode, isInitialized } = useAppStore();
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
      root.lang = lang;
      root.classList.toggle('dark', theme === 'dark');
      root.classList.toggle('font-bn', lang === 'bn');

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
  }, [lang, theme]);

  // Determine active color theme
  const activeTheme = theme === 'dark' ? DarkTheme : DefaultTheme;
  const nativeThemeVars = useMemo(() => getNativeThemeVars(theme), [theme]);
  const scheme = getBrandScheme(theme);

  if (!isInitialized) {
    return (
      <View className="flex-1 items-center justify-center bg-background" style={{ backgroundColor: scheme.background }}>
        <ActivityIndicator size="large" color={loaderColor} />
      </View>
    );
  }

  // 🛡️ App Maintenance Mode gate
  if (maintenanceMode) {
    return (
      <ThemeProvider value={activeTheme}>
        <View className="flex-1 items-center justify-center bg-background px-6" style={{ backgroundColor: scheme.background }}>
          <Text className="mb-4 text-center font-heading text-3xl font-black text-main">
            Maintenance Mode
          </Text>
          <Text className="mb-8 text-center text-sm font-semibold text-muted-foreground">
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
        <VariableContextProvider value={nativeThemeVars as any}>
          <ThemeProvider value={activeTheme}>
            <View className="flex-1 bg-background" style={{ backgroundColor: scheme.background }}>
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
            </View>
          </ThemeProvider>
        </VariableContextProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
