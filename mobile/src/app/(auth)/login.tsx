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

export default function LoginScreen() {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const login = useAuthStore((s) => s.login);
  const syncGuestDataWithUser = useCartStore((s) => s.syncGuestDataWithUser);
  const t = getTranslation('auth', lang);
  const palette = getBrandTokens(theme);

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
      await syncGuestDataWithUser();
      router.replace('/(tabs)');
    } catch (error: any) {
      const errMsg = error.response?.data?.message || t.invalidCredentials || 'Login failed';
      Alert.alert(t.loginFailed || 'Error', errMsg);
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
          <View style={{ flex: 1, justifyContent: 'center', marginVertical: 32 }}>
            <View style={{ marginBottom: 40 }}>
              <Text style={{ fontSize: 30, fontWeight: '900', marginBottom: 8, fontStyle: 'italic', color: palette.text }}>
                {t.loginTitle || 'Welcome Back'}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '500', color: palette.textSecondary }}>
                {t.loginSub || 'Sign in to your account'}
              </Text>
            </View>

            <View style={{ marginBottom: 24 }}>
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

              <Pressable
                onPress={() => Alert.alert('Forgot Password', 'Please use the web app to reset password.')}
                style={{ alignSelf: 'flex-end', marginTop: 4, marginBottom: 24 }}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', textAlign: 'right', color: palette.textSecondary }}>
                  {t.forgotPassword || 'Forgot password?'}
                </Text>
              </Pressable>

              <Button
                title={loading ? (t.signingIn || 'Signing In...') : (t.signIn || 'Sign In')}
                onPress={handleLogin}
                loading={loading}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderTopWidth: 1, borderTopColor: palette.border }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: palette.textSecondary }}>
              {t.noAccount || "Don't have an account?"}{' '}
            </Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text style={{ fontSize: 14, fontWeight: '700', textDecorationLine: 'underline', color: palette.text }}>
                {t.createAccount || 'Create Account'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
