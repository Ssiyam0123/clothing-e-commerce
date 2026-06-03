import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CreditCard, Banknote } from 'lucide-react-native';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { api } from '../../lib/api';
import { trackEvent } from '../../lib/tracker';
import { getTranslation } from '../../utils/i18n';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { safeBack } from '../../utils/navigation';

export default function CheckoutScreen() {
  const router = useRouter();
  const {
    coupon,
    discountAmount: discountAmountParam,
    name: nameParam,
    email: emailParam,
    phone: phoneParam,
    address: addressParam,
    deliveryZone: deliveryZoneParam,
    shippingPrice: shippingPriceParam,
  } = useLocalSearchParams();
  const lang = useAppStore((s) => s.lang);
  const settings = useAppStore((s) => s.settings);
  const user = useAuthStore((s) => s.user);
  
  const itemsMap = useCartStore((s) => s.itemsMap);
  const totalCartPrice = useCartStore((s) => s.totalPrice);
  const clearCart = useCartStore((s) => s.clearCart);
  
  const t = getTranslation('checkout', lang);

  // Form states
  const [name, setName] = useState(String(nameParam || user?.name || ''));
  const [phone, setPhone] = useState(String(phoneParam || user?.phone || ''));
  const [email] = useState(String(emailParam || user?.email || ''));
  const [city, setCity] = useState(String(deliveryZoneParam || ''));
  const [area, setArea] = useState('');
  const [detailedAddress, setDetailedAddress] = useState(String(addressParam || ''));
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'ssl'>('cod');
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string }>({});

  const cartList = Object.values(itemsMap);
  const hasCartShippingInfo = !!(nameParam || phoneParam || addressParam);
  const subtotal = totalCartPrice;
  const paymentOptions = settings?.paymentOptions || { cod: true, online: true, bkash: true };
  const enabledPaymentMethods = useMemo(
    () => ({
      cod: paymentOptions.cod !== false,
      bkash: paymentOptions.bkash !== false,
      ssl: paymentOptions.online !== false,
    }),
    [paymentOptions.bkash, paymentOptions.cod, paymentOptions.online],
  );
  const shippingSettings = settings?.shipping || {};
  const isInsideDhaka = city.trim().toLowerCase() === 'dhaka';
  const shippingFee = subtotal === 0
    ? 0
    : Number(shippingPriceParam || (isInsideDhaka ? shippingSettings.insideDhaka ?? 60 : shippingSettings.outsideDhaka ?? 120));
  const discountAmount = Number(discountAmountParam || 0);
  const grandTotal = Number((subtotal + shippingFee - discountAmount).toFixed(2));

  const effectivePaymentMethod =
    enabledPaymentMethods[paymentMethod]
      ? paymentMethod
      : ((Object.keys(enabledPaymentMethods) as (keyof typeof enabledPaymentMethods)[])
          .find((method) => enabledPaymentMethods[method]) || 'cod');

  const validate = () => {
    const nextErrors: typeof errors = {};
    if (!name) nextErrors.name = 'Full name is required';
    if (!phone) nextErrors.phone = 'Phone number is required';
    else if (phone.length < 10) nextErrors.phone = 'Invalid phone number';
    if (!detailedAddress) nextErrors.address = 'Complete shipping address is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    setOrderError('');

    const orderItems = cartList.map((item) => ({
      product: item.product._id,
      size: item.size._id,
      quantity: item.quantity,
    }));

    const shippingAddress = {
      name,
      phone,
      address: [detailedAddress, area, city].filter(Boolean).join(', '),
      email,
    };

    const couponCode = coupon ? String(coupon) : undefined;

    // Track InitiateCheckout
    trackEvent('InitiateCheckout', {
      content_ids: orderItems.map(i => i.product),
      value: grandTotal,
    });

    try {
      const { data } = await api.post('/orders/init', {
        orderItems,
        shippingAddress,
        paymentMethod: effectivePaymentMethod,
        couponCode,
        shippingPrice: shippingFee,
        deliveryZone: city || String(deliveryZoneParam || ''),
      });

      if (effectivePaymentMethod === 'cod') {
        // Clear local cart
        clearCart();
        
        // Track Purchase
        trackEvent('Purchase', {
          content_ids: orderItems.map(i => i.product),
          value: grandTotal,
        });

        // Parse orderId from data.order?._id || data._id or from URL query string
        let orderId = data.order?._id || data._id || '';
        if (!orderId && data.url) {
          const match = data.url.match(/[?&]orderId=([^&]+)/);
          if (match && match[1]) {
            orderId = match[1];
          }
        }

        // Navigate immediately to success screen
        router.replace({
          pathname: '/checkout/success',
          params: { orderId },
        });
      } else {
        // Online Gateway Redirect (bKash/SSLCommerz)
        if (data.url) {
          router.replace({
            pathname: '/checkout/payment',
            params: { url: data.url },
          });
        } else {
          throw new Error('No checkout URL returned from payment server.');
        }
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Failed to place order';
      setOrderError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header bar */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-zinc-950 border-b border-slate-50 dark:border-zinc-900">
        <Pressable
          onPress={safeBack}
          className="w-9 h-9 items-center justify-center bg-slate-50 dark:bg-zinc-900 rounded-full active:scale-95"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </Pressable>
        <Text className="text-base font-black text-foreground italic uppercase tracking-wider">
          {t.shippingTitle || 'Checkout'}
        </Text>
        <View className="w-9 h-9" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5 py-4">
          {hasCartShippingInfo ? (
            <View className="mb-6 rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/30">
              <Text className="mb-4 text-xs font-black uppercase tracking-widest text-foreground italic">
                Order Confirmation
              </Text>
              <View className="gap-3">
                <View>
                  <Text className="text-[9px] font-black uppercase tracking-widest text-slate-400">Customer</Text>
                  <Text className="mt-1 text-sm font-bold text-foreground">{name}</Text>
                </View>
                <View>
                  <Text className="text-[9px] font-black uppercase tracking-widest text-slate-400">Contact</Text>
                  <Text className="mt-1 text-sm font-bold text-foreground">{phone}</Text>
                  {email ? <Text className="mt-0.5 text-xs font-semibold text-slate-500">{email}</Text> : null}
                </View>
                <View>
                  <Text className="text-[9px] font-black uppercase tracking-widest text-slate-400">Destination</Text>
                  <Text className="mt-1 text-sm font-bold text-foreground">{detailedAddress}</Text>
                  {city ? <Text className="mt-0.5 text-xs font-semibold text-slate-500">{city}</Text> : null}
                </View>
              </View>
            </View>
          ) : (
            <View className="mb-6">
              <Text className="text-xs font-black text-foreground uppercase tracking-widest italic mb-4">
                {t.shippingTitle || 'Shipping Address'}
              </Text>

              <Input
                label={t.nameLabel}
                placeholder="Your Full Name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                error={errors.name}
              />

              <Input
                label={t.phoneLabel}
                placeholder="01XXXXXXXXX"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                keyboardType="phone-pad"
                error={errors.phone}
              />

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Input
                    label={t.cityLabel}
                    placeholder="e.g. Dhaka"
                    value={city}
                    onChangeText={(text) => {
                      setCity(text);
                      if (errors.address) setErrors({ ...errors, address: undefined });
                    }}
                  />
                </View>
                <View className="flex-1">
                  <Input
                    label={t.areaLabel}
                    placeholder="e.g. Banani"
                    value={area}
                    onChangeText={setArea}
                  />
                </View>
              </View>

              <Input
                label={t.addressLabel}
                placeholder="House #, Road #, Apartment details"
                value={detailedAddress}
                onChangeText={(text) => {
                  setDetailedAddress(text);
                  if (errors.address) setErrors({ ...errors, address: undefined });
                }}
                error={errors.address}
              />
            </View>
          )}

          {/* Payment Method Selector */}
          <View className="mb-6">
            <Text className="text-xs font-black text-foreground uppercase tracking-widest italic mb-4">
              {t.paymentTitle || 'Payment Method'}
            </Text>

            <View className="gap-3">
              {/* COD */}
              {enabledPaymentMethods.cod ? (
              <Pressable
                onPress={() => setPaymentMethod('cod')}
                className={`flex-row items-center justify-between p-4 border rounded-2xl ${
                    effectivePaymentMethod === 'cod'
                    ? 'bg-primary/5 border-primary dark:bg-white/5 dark:border-white'
                    : 'border-slate-200 dark:border-zinc-800'
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <Banknote size={20} className="text-foreground" />
                  <Text className="text-sm font-semibold text-foreground">
                    {t.cod || 'Cash on Delivery (COD)'}
                  </Text>
                </View>
                <View
                  className={`w-5 h-5 rounded-full border items-center justify-center ${
                    effectivePaymentMethod === 'cod' ? 'border-primary dark:border-white' : 'border-slate-300'
                  }`}
                >
                  {effectivePaymentMethod === 'cod' ? (
                    <View className="w-2.5 h-2.5 rounded-full bg-primary dark:bg-white" />
                  ) : null}
                </View>
              </Pressable>
              ) : null}

              {/* bKash */}
              {enabledPaymentMethods.bkash ? (
              <Pressable
                onPress={() => setPaymentMethod('bkash')}
                className={`flex-row items-center justify-between p-4 border rounded-2xl ${
                    effectivePaymentMethod === 'bkash'
                    ? 'bg-primary/5 border-primary dark:bg-white/5 dark:border-white'
                    : 'border-slate-200 dark:border-zinc-800'
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <CreditCard size={20} className="text-foreground" />
                  <Text className="text-sm font-semibold text-foreground">
                    bKash Wallet / MFS
                  </Text>
                </View>
                <View
                  className={`w-5 h-5 rounded-full border items-center justify-center ${
                    effectivePaymentMethod === 'bkash' ? 'border-primary dark:border-white' : 'border-slate-300'
                  }`}
                >
                  {effectivePaymentMethod === 'bkash' ? (
                    <View className="w-2.5 h-2.5 rounded-full bg-primary dark:bg-white" />
                  ) : null}
                </View>
              </Pressable>
              ) : null}

              {/* Cards / Online */}
              {enabledPaymentMethods.ssl ? (
              <Pressable
                onPress={() => setPaymentMethod('ssl')}
                className={`flex-row items-center justify-between p-4 border rounded-2xl ${
                    effectivePaymentMethod === 'ssl'
                    ? 'bg-primary/5 border-primary dark:bg-white/5 dark:border-white'
                    : 'border-slate-200 dark:border-zinc-800'
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <CreditCard size={20} className="text-foreground" />
                  <Text className="text-sm font-semibold text-foreground">
                    {t.card || 'SSLCommerz (Cards/NetBanking)'}
                  </Text>
                </View>
                <View
                  className={`w-5 h-5 rounded-full border items-center justify-center ${
                    effectivePaymentMethod === 'ssl' ? 'border-primary dark:border-white' : 'border-slate-300'
                  }`}
                >
                  {effectivePaymentMethod === 'ssl' ? (
                    <View className="w-2.5 h-2.5 rounded-full bg-primary dark:bg-white" />
                  ) : null}
                </View>
              </Pressable>
              ) : null}
            </View>
          </View>

          {/* Pricing Summary */}
          <View className="bg-slate-50 dark:bg-zinc-900/20 border border-slate-100 dark:border-zinc-800/40 p-5 rounded-3xl mb-10">
            <Text className="text-xs font-black text-foreground uppercase tracking-widest italic mb-4">
              {t.summaryTitle || 'Order Summary'}
            </Text>

            <View className="flex-row justify-between mb-3">
              <Text className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Items Price</Text>
              <Text className="text-xs font-bold text-foreground">৳{Math.round(subtotal).toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Shipping Cost</Text>
              <Text className="text-xs font-bold text-foreground">{shippingFee > 0 ? `৳${shippingFee}` : 'Free'}</Text>
            </View>
            {discountAmount > 0 ? (
              <View className="flex-row justify-between mb-3">
                <Text className="text-xs font-semibold text-emerald-500">Coupon Discount</Text>
                <Text className="text-xs font-bold text-emerald-500">-৳{Math.round(discountAmount).toLocaleString()}</Text>
              </View>
            ) : null}

            <View className="h-px bg-slate-200 dark:bg-zinc-800 my-3" />

            <View className="flex-row justify-between items-baseline">
              <Text className="text-sm font-bold text-foreground">Grand Total</Text>
              <Text className="text-lg font-black text-foreground italic">৳{Math.round(grandTotal).toLocaleString()}</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky Bottom Place Order Button */}
      <View className="px-5 py-4 border-t border-slate-100 dark:border-zinc-900 bg-white dark:bg-zinc-950">
        {orderError ? (
          <Text className="mb-3 rounded-2xl bg-red-50 px-4 py-3 text-xs font-bold text-red-500 dark:bg-red-950/20">
            {orderError}
          </Text>
        ) : null}
        <Button
          title={loading ? 'Processing Order...' : t.placeOrder || 'Place Order'}
          onPress={handlePlaceOrder}
          loading={loading}
          className="rounded-2xl h-12"
        />
      </View>
    </SafeAreaView>
  );
}
