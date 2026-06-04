import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Platform, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  ChevronRight,
  Languages,
  LogOut,
  MapPin,
  MessageSquare,
  Moon,
  Package,
  Sun,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { api } from '../../lib/api';
import { getTranslation } from '../../utils/i18n';
import { Button } from '../../components/ui/Button';
import { brandColors } from '../../constants/designSystem';

export default function ProfileScreen() {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const t = getTranslation('profile', lang);
  const isDark = theme === 'dark';

  const handleLogout = () => {
    const performLogout = async () => {
      try {
        await logout();
      } catch (err) {
        console.error('Logout failed:', err);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to log out?')) performLogout();
      return;
    }

    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: performLogout },
    ]);
  };

  const roleLabel = typeof user?.role === 'object' ? user.role?.name : user?.role;

  return (
    <SafeAreaView className="flex-1 bg-background" style={{ flex: 1 }}>
      <View className="border-b border-border bg-background px-4 py-4">
        <Text className="font-heading text-lg font-black uppercase tracking-wider text-main">
          {t.title || 'My Profile'}
        </Text>
      </View>

      <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false} className="flex-1 px-5 py-4">
        {isAuthenticated && user ? (
          <View className="mb-6 flex-row items-center rounded-card border border-border bg-card p-5 shadow-card">
            <View className="mr-4 h-14 w-14 items-center justify-center rounded-full bg-primary">
              <Text className="text-lg font-black uppercase text-primary-foreground">
                {user.name?.slice(0, 2) || 'US'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-black text-card-foreground">{user.name}</Text>
              <Text className="mt-0.5 text-xs font-semibold text-muted-foreground">{user.email}</Text>
              <Text className="align-self-start mt-1.5 rounded-md bg-surface-soft px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                Role: {roleLabel || 'Member'}
              </Text>
            </View>
          </View>
        ) : (
          <View className="mb-6 items-center rounded-card border border-border bg-card p-6 shadow-card">
            <Text className="mb-2 font-heading text-base font-black uppercase tracking-wider text-card-foreground">
              {lang === 'bn' ? 'অতিথি সেশন' : 'Guest Session'}
            </Text>
            <Text className="mb-5 text-center text-xs text-muted-foreground">
              {lang === 'bn'
                ? 'অর্ডার, ডেলিভারি ও সাপোর্ট দেখতে সাইন ইন করুন।'
                : 'Sign in to access your orders, wishlist and support.'}
            </Text>
            <Button
              title={lang === 'bn' ? 'সাইন ইন / রেজিস্টার' : 'Sign In / Register'}
              onPress={() => router.push('/(auth)/login')}
              className="h-10 w-2/3 rounded-button"
              size="sm"
            />
          </View>
        )}



        <View className="mb-10">
          <Text className="mb-4 text-xs font-black uppercase tracking-widest text-main">
            {t.settings || 'System Settings'}
          </Text>

          <View className="overflow-hidden rounded-card border border-border bg-card shadow-card">
            <View className="border-b border-border p-4">
              <View className="flex-row items-center gap-3">
                <Languages size={18} className="text-muted-foreground" />
                <Text className="flex-1 text-sm font-semibold text-card-foreground">
                  {lang === 'bn' ? 'ভাষা' : 'Language'}
                </Text>
                <View className="flex-row rounded-full border border-border bg-surface-soft p-1">
                  <Pressable
                    onPress={() => setLang('en')}
                    className={`min-w-12 items-center rounded-full px-3 py-1.5 ${lang === 'en' ? 'bg-primary' : ''}`}
                  >
                    <Text className={`text-[10px] font-black ${lang === 'en' ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                      EN
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setLang('bn')}
                    className={`min-w-12 items-center rounded-full px-3 py-1.5 ${lang === 'bn' ? 'bg-primary' : ''}`}
                  >
                    <Text className={`text-[10px] font-black ${lang === 'bn' ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                      বাংলা
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-between border-b border-border p-4">
              <View className="flex-row items-center gap-3">
                {isDark ? (
                  <Moon size={18} className="text-muted-foreground" />
                ) : (
                  <Sun size={18} className="text-muted-foreground" />
                )}
                <View>
                  <Text className="text-sm font-semibold text-card-foreground">
                    {lang === 'bn' ? 'ডার্ক মোড' : 'Dark Mode'}
                  </Text>
                  <Text className="mt-0.5 text-[10px] font-semibold text-muted-foreground">
                    {isDark
                      ? lang === 'bn'
                        ? 'চালু আছে'
                        : 'Enabled'
                      : lang === 'bn'
                        ? 'লাইট মোড চালু'
                        : 'Light mode active'}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: brandColors.light.border, true: '#8A6A4F' }}
                thumbColor={isDark ? brandColors.accent : brandColors.light.surface}
              />
            </View>

            <MenuRow
              icon={<MapPin size={18} className="text-muted-foreground" />}
              label={t.addressBook || 'Address Book'}
              onPress={() => Alert.alert('Address Book', 'Use checkout forms to update shipping settings.')}
            />
            <MenuRow
              icon={<BookOpen size={18} className="text-muted-foreground" />}
              label={lang === 'bn' ? 'ব্লগ ও আর্টিকেল' : 'Blog & Articles'}
              onPress={() => router.push('/blog')}
              isLast={!isAuthenticated}
            />
            {isAuthenticated ? (
              <>
                <MenuRow
                  icon={<Package size={18} className="text-muted-foreground" />}
                  label={lang === 'bn' ? 'অর্ডার ইতিহাস' : 'Order History'}
                  onPress={() => router.push('/order')}
                />
                <MenuRow
                  icon={<MessageSquare size={18} className="text-muted-foreground" />}
                  label={t.supportChat || 'Live Support Chat'}
                  onPress={() => router.push('/support/chat')}
                  isLast
                />
              </>
            ) : null}
          </View>

          {isAuthenticated ? (
            <Pressable
              onPress={handleLogout}
              className="mt-6 flex-row items-center justify-center rounded-card border border-danger bg-danger/5 p-4 active:scale-95"
            >
              <LogOut size={18} className="mr-2 text-danger" />
              <Text className="text-sm font-bold uppercase tracking-wider text-danger">
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

function MenuRow({
  icon,
  label,
  onPress,
  isLast = false,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between p-4 active:bg-surface-soft ${isLast ? '' : 'border-b border-border'}`}
    >
      <View className="flex-row items-center gap-3">
        {icon}
        <Text className="text-sm font-semibold text-card-foreground">{label}</Text>
      </View>
      <ChevronRight size={16} className="text-muted-foreground" />
    </Pressable>
  );
}
