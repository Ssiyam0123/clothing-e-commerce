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
import { getBrandTokens } from '../../constants/designSystem';

export default function RegisterScreen() {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const register = useAuthStore((s) => s.register);
  const syncGuestDataWithUser = useCartStore((s) => s.syncGuestDataWithUser);
  const t = getTranslation('auth', lang);
  const palette = getBrandTokens(theme);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

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
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(name, email, password);
      await syncGuestDataWithUser();
      router.replace('/(tabs)');
    } catch (error: any) {
      const errMsg = error.response?.data?.message || t.establishmentFailed || 'Registration failed';
      Alert.alert(t.registerTitle || 'Error', errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          overScrollMode="never"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40 }}
          style={{ flex: 1, backgroundColor: palette.background }}
        >
          <View style={{ flex: 1, justifyContent: 'center', marginVertical: 16 }}>
            <View style={{ marginBottom: 32 }}>
              <Text style={{ fontSize: 30, fontWeight: '900', marginBottom: 8, fontStyle: 'italic', color: palette.text }}>
                {t.registerTitle || 'Create Account'}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '500', color: palette.textSecondary }}>
                {t.registerSub || 'Join us and start shopping'}
              </Text>
            </View>

            <View style={{ marginBottom: 24 }}>
              <Input
                label={t.nameLabel || 'Full Name'}
                placeholder="John Doe"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                error={errors.name}
              />

              <Input
                label={t.emailLabel || 'Email'}
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
                label={t.passwordLabel || 'Password'}
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


              <View style={{ marginTop: 16 }}>
                <Button
                  title={loading ? (t.signingUp || 'Creating Account...') : (t.signUp || 'Create Account')}
                  onPress={handleRegister}
                  loading={loading}
                />
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderTopWidth: 1, borderTopColor: palette.border }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: palette.textSecondary }}>
              {t.haveAccount || 'Already have an account?'}{' '}
            </Text>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text style={{ fontSize: 14, fontWeight: '700', textDecorationLine: 'underline', color: palette.text }}>
                {t.loginNow || 'Sign In'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
