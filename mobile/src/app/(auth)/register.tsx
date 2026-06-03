import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useAppStore } from '../../store/appStore';
import { getTranslation } from '../../utils/i18n';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function RegisterScreen() {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const register = useAuthStore((s) => s.register);
  const syncGuestDataWithUser = useCartStore((s) => s.syncGuestDataWithUser);
  const t = getTranslation('auth', lang);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});

  const validate = () => {
    const nextErrors: typeof errors = {};
    if (!name) {
      nextErrors.name = 'Full name is required';
    }
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
    if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(name, email, password);
      // Migrate cart data
      await syncGuestDataWithUser();
      
      // Navigate to tabs
      router.replace('/(tabs)');
    } catch (error: any) {
      const errMsg = error.response?.data?.message || t.establishmentFailed || 'Registration failed';
      Alert.alert(t.registerTitle || 'Error', errMsg);
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-10">
          <View className="flex-1 justify-center my-4">
            <View className="mb-8">
              <Text className="text-3xl font-black text-foreground mb-2 italic">
                {t.registerTitle}
              </Text>
              <Text className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                {t.registerSub}
              </Text>
            </View>

            <View className="mb-6">
              <Input
                label={t.nameLabel}
                placeholder="John Doe"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                error={errors.name}
              />

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

              <Input
                label={t.confirmPasswordLabel}
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                }}
                isPassword
                autoCapitalize="none"
                error={errors.confirmPassword}
              />

              <View className="mt-4">
                <Button
                  title={loading ? t.signingUp : t.signUp}
                  onPress={handleRegister}
                  loading={loading}
                />
              </View>
            </View>
          </View>

          <View className="flex-row justify-center items-center py-4 border-t border-slate-100 dark:border-zinc-800">
            <Text className="text-sm font-medium text-slate-500 dark:text-zinc-400">
              {t.haveAccount}{' '}
            </Text>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text className="text-sm font-bold text-foreground underline">
                {t.loginNow}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
