import React from 'react';
import { View, Text, ScrollView, Pressable, Alert, Platform, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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
import { getTranslation } from '../../utils/i18n';
import { Button } from '../../components/ui/Button';
import { getBrandTokens, withAlpha } from '../../constants/designSystem';

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
  const palette = getBrandTokens(theme);
  const dangerBg = withAlpha(palette.danger, 0.08);

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
    <SafeAreaView className="flex-1" style={{ flex: 1, backgroundColor: palette.background }}>
      <View className="border-b px-4 py-4" style={{ backgroundColor: palette.nav, borderColor: palette.border }}>
        <Text className="font-heading text-lg font-black uppercase tracking-wider" style={{ color: palette.navText }}>
          {t.title || 'My Profile'}
        </Text>
      </View>

      <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false} className="flex-1 px-5 py-4">
        {isAuthenticated && user ? (
          <View className="mb-6 flex-row items-center rounded-card border p-5 shadow-card" style={{ backgroundColor: palette.surface, borderColor: palette.border }}>
            <View className="mr-4 h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: palette.primary }}>
              <Text className="text-lg font-black uppercase" style={{ color: palette.onPrimary }}>
                {user.name?.slice(0, 2) || 'US'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-black" style={{ color: palette.text }}>{user.name}</Text>
              <Text className="mt-0.5 text-xs font-semibold" style={{ color: palette.textSecondary }}>{user.email}</Text>
              <Text className="align-self-start mt-1.5 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider" style={{ backgroundColor: palette.surfaceSoft, color: palette.textSecondary }}>
                Role: {roleLabel || 'Member'}
              </Text>
            </View>
          </View>
        ) : (
          <View className="mb-6 items-center rounded-card border p-6 shadow-card" style={{ backgroundColor: palette.surface, borderColor: palette.border }}>
            <Text className="mb-2 font-heading text-base font-black uppercase tracking-wider" style={{ color: palette.text }}>
              {lang === 'bn' ? 'অতিথি সেশন' : 'Guest Session'}
            </Text>
            <Text className="mb-5 text-center text-xs" style={{ color: palette.textSecondary }}>
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
          <Text className="mb-4 text-xs font-black uppercase tracking-widest" style={{ color: palette.text }}>
            {t.settings || 'System Settings'}
          </Text>

          <View className="overflow-hidden rounded-card border shadow-card" style={{ backgroundColor: palette.surface, borderColor: palette.border }}>
            <View className="border-b p-4" style={{ borderColor: palette.border }}>
              <View className="flex-row items-center gap-3">
                <Languages size={18} color={palette.iconMuted} />
                <Text className="flex-1 text-sm font-semibold" style={{ color: palette.text }}>
                  {lang === 'bn' ? 'ভাষা' : 'Language'}
                </Text>
                <View className="flex-row rounded-full border p-1" style={{ backgroundColor: palette.surfaceSoft, borderColor: palette.border }}>
                  <Pressable
                    onPress={() => setLang('en')}
                    className="min-w-12 items-center rounded-full px-3 py-1.5"
                    style={{ backgroundColor: lang === 'en' ? palette.primary : 'transparent' }}
                  >
                    <Text className="text-[10px] font-black" style={{ color: lang === 'en' ? palette.onPrimary : palette.textSecondary }}>
                      EN
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setLang('bn')}
                    className="min-w-12 items-center rounded-full px-3 py-1.5"
                    style={{ backgroundColor: lang === 'bn' ? palette.primary : 'transparent' }}
                  >
                    <Text className="text-[10px] font-black" style={{ color: lang === 'bn' ? palette.onPrimary : palette.textSecondary }}>
                      বাংলা
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-between border-b p-4" style={{ borderColor: palette.border }}>
              <View className="flex-row items-center gap-3">
                {isDark ? (
                  <Moon size={18} color={palette.iconMuted} />
                ) : (
                  <Sun size={18} color={palette.iconMuted} />
                )}
                <View>
                  <Text className="text-sm font-semibold" style={{ color: palette.text }}>
                    {lang === 'bn' ? 'ডার্ক মোড' : 'Dark Mode'}
                  </Text>
                  <Text className="mt-0.5 text-[10px] font-semibold" style={{ color: palette.textSecondary }}>
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
                trackColor={{ false: palette.border, true: palette.primary }}
                thumbColor={isDark ? palette.accent : palette.surface}
              />
            </View>

            <MenuRow
              icon={<MapPin size={18} color={palette.iconMuted} />}
              label={t.addressBook || 'Address Book'}
              onPress={() => Alert.alert('Address Book', 'Use checkout forms to update shipping settings.')}
            />
            <MenuRow
              icon={<BookOpen size={18} color={palette.iconMuted} />}
              label={lang === 'bn' ? 'ব্লগ ও আর্টিকেল' : 'Blog & Articles'}
              onPress={() => router.push('/blog')}
              isLast={!isAuthenticated}
            />
            {isAuthenticated ? (
              <>
                <MenuRow
                  icon={<Package size={18} color={palette.iconMuted} />}
                  label={lang === 'bn' ? 'অর্ডার ইতিহাস' : 'Order History'}
                  onPress={() => router.push('/order')}
                />
                <MenuRow
                  icon={<MessageSquare size={18} color={palette.iconMuted} />}
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
              className="mt-6 flex-row items-center justify-center rounded-card border p-4 active:scale-95"
              style={{ backgroundColor: dangerBg, borderColor: palette.danger }}
            >
              <LogOut size={18} color={palette.danger} />
              <Text className="ml-2 text-sm font-bold uppercase tracking-wider" style={{ color: palette.danger }}>
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
  const theme = useAppStore((s) => s.theme);
  const palette = getBrandTokens(theme);

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between p-4 active:bg-surface-soft ${isLast ? '' : 'border-b'}`}
      style={{ borderColor: palette.border }}
    >
      <View className="flex-row items-center gap-3">
        {icon}
        <Text className="text-sm font-semibold" style={{ color: palette.text }}>{label}</Text>
      </View>
      <ChevronRight size={16} color={palette.iconMuted} />
    </Pressable>
  );
}
