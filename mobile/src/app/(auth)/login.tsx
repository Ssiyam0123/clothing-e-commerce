import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useAppStore } from '../../store/appStore';
import { getTranslation } from '../../utils/i18n';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function LoginScreen() {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const login = useAuthStore((s) => s.login);
  const syncGuestDataWithUser = useCartStore((s) => s.syncGuestDataWithUser);
  const t = getTranslation('auth', lang);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const nextErrors: typeof errors = {};
    if (!email) {
      nextErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      nextErrors.email = 'Email address is invalid';
    }
    if (!password) {
      nextErrors.password = 'Password is required';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      // Migrate cart data
      await syncGuestDataWithUser();
      
      // Navigate to tabs
      router.replace('/(tabs)');
    } catch (error: any) {
      const errMsg = error.response?.data?.message || t.invalidCredentials || 'Login failed';
      Alert.alert(t.loginFailed || 'Error', errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView overScrollMode="never" contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-10">
          <View className="flex-1 justify-center my-8">
            <View className="mb-10">
              <Text className="text-3xl font-black text-foreground mb-2 italic">
                {t.loginTitle}
              </Text>
              <Text className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                {t.loginSub}
              </Text>
            </View>

            <View className="mb-6">
              <Input
                label={t.emailLabel}
                placeholder="you@example.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <Input
                label={t.passwordLabel}
                placeholder="••••••••"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                isPassword
                autoCapitalize="none"
                error={errors.password}
              />

              <Pressable
                onPress={() => Alert.alert('Forgot Password', 'Please use the web app to reset password.')}
                className="align-self-end mt-1 mb-6"
              >
                <Text className="text-sm font-semibold text-slate-500 dark:text-zinc-400 text-right">
                  {t.forgotPassword}
                </Text>
              </Pressable>

              <Button
                title={loading ? t.signingIn : t.signIn}
                onPress={handleLogin}
                loading={loading}
              />
            </View>
          </View>

          <View className="flex-row justify-center items-center py-4 border-t border-slate-100 dark:border-zinc-800">
            <Text className="text-sm font-medium text-slate-500 dark:text-zinc-400">
              {t.noAccount}{' '}
            </Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text className="text-sm font-bold text-foreground underline">
                {t.createAccount}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
