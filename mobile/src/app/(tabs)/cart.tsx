import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Minus, Trash2, Tag, ShoppingCart, ArrowLeft, User, Mail, Phone, MapPin, Truck, CreditCard, Banknote } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { api, getImageUrl } from '../../lib/api';
import { trackEvent } from '../../lib/tracker';
import { getTranslation } from '../../utils/i18n';
import { Button } from '../../components/ui/Button';
import { safeBack } from '../../utils/navigation';
import { getBrandTokens, withAlpha } from '../../constants/designSystem';

export default function CartScreen() {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const settings = useAppStore((s) => s.settings);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const itemsMap = useCartStore((s) => s.itemsMap);
  const updateCartItem = useCartStore((s) => s.updateCartItem);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const totalCartItems = useCartStore((s) => s.totalItems);
  const totalCartPrice = useCartStore((s) => s.totalPrice);
  const buyNowItem = useCartStore((s) => s.buyNowItem);
  const clearBuyNowItem = useCartStore((s) => s.clearBuyNowItem);

  const t = getTranslation('cart', lang);
  const palette = getBrandTokens(theme);
  const selectedSurface = withAlpha(palette.primary, 0.08);
  const mutedSurface = withAlpha(palette.textSecondary, 0.14);
  const dangerSurface = withAlpha(palette.danger, 0.12);

  // Promo coupon states
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const [discountCodeApplied, setDiscountCodeApplied] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string; address?: string }>({});
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'ssl'>('cod');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [shippingInfoEdits, setShippingInfoEdits] = useState<Partial<{
    name: string;
    email: string;
    phone: string;
    address: string;
  }>>({});
  const [deliveryZone, setDeliveryZone] = useState('');

  // In buy-now mode, show only the instant-buy item; otherwise show full cart
  const isBuyNow = !!buyNowItem;
  const cartList = isBuyNow ? [buyNowItem!] : Object.values(itemsMap);
  const userDefaultAddress =
    user?.addresses?.[0]?.address ||
    user?.addresses?.[0]?.street ||
    user?.address ||
    '';
  const shippingInfo = {
    name: shippingInfoEdits.name ?? user?.name ?? '',
    email: shippingInfoEdits.email ?? user?.email ?? '',
    phone: shippingInfoEdits.phone ?? user?.phone ?? '',
    address: shippingInfoEdits.address ?? userDefaultAddress,
  };
  const activeCouriers = useMemo(() => {
    const couriers = settings?.shipping?.couriers?.filter((courier: any) => courier.isActive) || [];
    if (couriers.length > 0) return couriers;
    return [
      { name: 'Inside Dhaka', charge: Number(settings?.shipping?.insideDhaka ?? 60), estimatedDays: '1-2 days' },
      { name: 'Outside Dhaka', charge: Number(settings?.shipping?.outsideDhaka ?? 120), estimatedDays: '2-4 days' },
    ];
  }, [settings]);

  const selectedDeliveryZone = deliveryZone || activeCouriers[0]?.name || '';

  // Subtotal, shipping, discount calculations
  const subtotal = isBuyNow
    ? (buyNowItem!.discountedPrice * buyNowItem!.quantity)
    : totalCartPrice;
  const selectedCourier = activeCouriers.find((courier: any) => courier.name === selectedDeliveryZone);
  const shippingFee = subtotal === 0 ? 0 : Number(selectedCourier?.charge ?? settings?.shipping?.insideDhaka ?? 60);
  const discountAmount = Number(couponDiscountAmount.toFixed(2));
  const grandTotal = Number((subtotal + shippingFee - discountAmount).toFixed(2));
  const paymentOptions = settings?.paymentOptions || { cod: true, online: true, bkash: true };
  const enabledPaymentMethods = useMemo(
    () => ({
      cod: paymentOptions.cod !== false,
      bkash: paymentOptions.bkash !== false,
      ssl: paymentOptions.online !== false,
    }),
    [paymentOptions.bkash, paymentOptions.cod, paymentOptions.online],
  );
  const effectivePaymentMethod =
    enabledPaymentMethods[paymentMethod]
      ? paymentMethod
      : ((Object.keys(enabledPaymentMethods) as (keyof typeof enabledPaymentMethods)[])
        .find((method) => enabledPaymentMethods[method]) || 'cod');

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Enter a promo code first.');
      return;
    }
    setCouponLoading(true);
    setCouponError('');
    try {
      const { data } = await api.post('/coupons/validate', {
        code: couponCode.trim(),
        cartTotal: subtotal,
      });
      const nextDiscountAmount = Number(data.discountAmount || 0);
      const appliedCode = data.coupon?.code || couponCode.trim().toUpperCase();
      setCouponDiscountAmount(nextDiscountAmount);
      setDiscountCodeApplied(appliedCode);
      setCouponCode(appliedCode);
      Alert.alert(t.couponApplied || 'Success', `Coupon '${appliedCode}' applied! Saved ৳${Math.round(nextDiscountAmount)}.`);
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Invalid coupon code';
      setCouponError(errMsg);
      setCouponDiscountAmount(0);
      setDiscountCodeApplied('');
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    const nextErrors: typeof formErrors = {};
    if (!shippingInfo.name.trim()) nextErrors.name = 'Full name is required.';
    if (!shippingInfo.phone.trim()) nextErrors.phone = 'Phone number is required.';
    if (!shippingInfo.address.trim()) nextErrors.address = 'Full address is required.';
    if (shippingInfo.phone.trim() && shippingInfo.phone.trim().length < 10) {
      nextErrors.phone = 'Enter a valid phone number.';
    }
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setOrderLoading(true);
    setOrderError('');

    const orderItems = cartList.map((item) => ({
      product: item.product?._id,
      size: item.size?._id,
      quantity: item.quantity,
    }));
    const hasInvalidOrderItem = orderItems.some(
      (item) => !item.product || !item.size || !Number.isFinite(Number(item.quantity)) || Number(item.quantity) < 1,
    );

    if (orderItems.length === 0 || hasInvalidOrderItem) {
      setOrderError('Some cart items are missing product or size. Please remove and add them again.');
      setOrderLoading(false);
      return;
    }

    trackEvent('InitiateCheckout', {
      content_ids: orderItems.map((item) => item.product),
      value: grandTotal,
    });

    try {
      const { data } = await api.post('/orders/init', {
        orderItems,
        shippingAddress: {
          name: shippingInfo.name,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
        },
        paymentMethod: effectivePaymentMethod,
        couponCode: discountCodeApplied || undefined,
        shippingPrice: shippingFee,
        deliveryZone: selectedDeliveryZone,
      });

      if (effectivePaymentMethod === 'cod') {
        trackEvent('Purchase', {
          content_ids: orderItems.map((item) => item.product),
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

        router.push({
          pathname: '/checkout/success',
          params: { orderId },
        });
        return;
      }

      if (data.url) {
        router.push({
          pathname: '/checkout/payment',
          params: { url: data.url },
        });
        return;
      }

      throw new Error('No checkout URL returned from payment server.');
    } catch (error: any) {
      setOrderError(error.response?.data?.message || error.message || 'Failed to place order');
    } finally {
      setOrderLoading(false);
    }
  };

  if (cartList.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center p-6" style={{ flex: 1, width: '100%', maxWidth: '100%', overflow: 'hidden', backgroundColor: palette.background }}>
        <View className="items-center justify-center p-8 rounded-3xl mb-6" style={{ backgroundColor: palette.surfaceSoft }}>
          <ShoppingCart size={48} color={palette.iconMuted} />
          <Text className="text-lg font-black italic mb-2 mt-4" style={{ color: palette.text }}>
            {t.emptyCart || 'Your Cart is Empty'}
          </Text>
          <Text className="text-xs text-center" style={{ color: palette.textSecondary }}>
            {"Looks like you haven't added anything to your cart yet."}
          </Text>
        </View>
        <Button
          title={t.startShopping || 'Start Shopping'}
          onPress={() => router.push('/(tabs)/shop')}
          className="w-2/3"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ flex: 1, width: '100%', maxWidth: '100%', overflow: 'hidden', backgroundColor: palette.background }}>
      {/* Header bar */}
      <View className="flex-row items-center justify-between px-4 py-2 border-b h-14 z-10" style={{ backgroundColor: palette.nav, borderColor: palette.border }}>
        <Pressable
          onPress={() => {
            if (isBuyNow) clearBuyNowItem();
            safeBack();
          }}
          className="w-9 h-9 items-center justify-center rounded-full active:scale-95"
        >
          <ArrowLeft size={22} color={palette.navText} />
        </Pressable>

        <Text className="text-base font-black uppercase tracking-widest" style={{ color: palette.navText }}>
          {isBuyNow ? 'Buy Now' : (t.title || 'Cart')}
        </Text>

        <View className="w-9 h-9 items-center justify-center relative">
          <ShoppingCart size={22} color={palette.navText} />
          {!isBuyNow && totalCartItems > 0 ? (
            <View className="absolute top-1 right-1 rounded-full h-4 min-w-4 px-1 items-center justify-center" style={{ backgroundColor: palette.danger }}>
              <Text className="text-[8px] font-black text-center" style={{ color: palette.onPrimary }}>{totalCartItems}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <FlatList overScrollMode="never"
        data={cartList}
        keyExtractor={(item) => `${item.product._id}_${item.size._id}`}
        contentContainerStyle={{ padding: 16 }}
        style={{ width: '100%', maxWidth: '100%' }}
        renderItem={({ item }) => {
          const imageUrl = getImageUrl(item.product.images?.[0]);
          return (
            <View className="flex-row border p-3 rounded-2xl mb-3 items-center" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', backgroundColor: palette.surface, borderColor: palette.border }}>
              {/* Left Product Image */}
              <Image
                source={{ uri: imageUrl }}
                className="w-20 h-20 rounded-xl"
                style={{ backgroundColor: palette.surfaceSoft }}
                resizeMode="cover"
              />

              {/* Middle details */}
              <View className="flex-1 ml-4 pr-1 justify-center" style={{ minWidth: 0 }}>
                <Text className="text-sm font-bold mb-1 leading-5" style={{ color: palette.text }}>
                  {item.product.name}
                </Text>

                <Text className="text-sm font-black italic mb-2" style={{ color: palette.text }}>
                  ৳{Math.round(item.discountedPrice * item.quantity).toLocaleString()}
                </Text>

                <Text className="text-[10px] font-black uppercase tracking-widest" style={{ color: palette.textSecondary }}>
                  Size: {item.size.name}
                </Text>
              </View>

              {/* Right side actions */}
              <View className="h-20 justify-between items-end pl-2">
                {/* Trash button */}
                <Pressable
                  onPress={() => removeFromCart(item.product._id, item.size._id, isAuthenticated)}
                  className="p-1.5 border rounded-xl active:scale-90"
                  style={{ backgroundColor: palette.surfaceSoft, borderColor: palette.border }}
                >
                  <Trash2 size={16} color={palette.danger} />
                </Pressable>

                {/* Quantity selector */}
                <View className="flex-row items-center rounded-xl py-0.5 px-1 border" style={{ backgroundColor: palette.surfaceSoft, borderColor: palette.border }}>
                  <Pressable
                    onPress={() => {
                      if (item.quantity > 1) {
                        updateCartItem(item.product._id, item.size._id, item.quantity - 1, isAuthenticated);
                      }
                    }}
                    className="w-6 h-6 items-center justify-center rounded-lg border"
                    style={{ backgroundColor: palette.surface, borderColor: palette.border }}
                  >
                    <Minus size={12} color={palette.text} />
                  </Pressable>

                  <Text className="text-xs font-black px-2 text-center min-w-[20px]" style={{ color: palette.text }}>
                    {item.quantity}
                  </Text>

                  <Pressable
                    onPress={() => {
                      updateCartItem(item.product._id, item.size._id, item.quantity + 1, isAuthenticated);
                    }}
                    className="w-6 h-6 items-center justify-center rounded-lg border"
                    style={{ backgroundColor: palette.surface, borderColor: palette.border }}
                  >
                    <Plus size={12} color={palette.text} />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          <View className="mt-4 mb-6">
            <View className="mb-6 border-b pb-6" style={{ borderColor: palette.border }}>
              <View className="mb-4">
                <Text className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: palette.accent }}>
                  02. Destination
                </Text>
                <Text className="mt-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: palette.textSecondary }}>
                  Deployment Logistics
                </Text>
              </View>

              <View className="gap-4">
                <View>
                  <Text className="ml-2 mb-2 text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: palette.textSecondary }}>
                    Full Identity
                  </Text>
                  <View className="h-14 flex-row items-center rounded-2xl px-4" style={{ backgroundColor: palette.surfaceSoft }}>
                    <User size={16} color={palette.iconMuted} />
                    <TextInput
                      value={shippingInfo.name}
                      onChangeText={(value) => {
                        setShippingInfoEdits((prev) => ({ ...prev, name: value }));
                        if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder="Enter your full name"
                      placeholderTextColor={palette.iconMuted}
                      className="ml-3 flex-1 text-xs font-black uppercase tracking-wider"
                      style={{ color: palette.text }}
                    />
                  </View>
                  {formErrors.name ? <Text className="mt-1 ml-2 text-[10px] font-bold" style={{ color: palette.danger }}>{formErrors.name}</Text> : null}
                </View>

                <View>
                  <Text className="ml-2 mb-2 text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: palette.textSecondary }}>
                    Email Address
                  </Text>
                  <View className="h-14 flex-row items-center rounded-2xl px-4" style={{ backgroundColor: palette.surfaceSoft }}>
                    <Mail size={16} color={palette.iconMuted} />
                    <TextInput
                      value={shippingInfo.email}
                      onChangeText={(value) => setShippingInfoEdits((prev) => ({ ...prev, email: value }))}
                      placeholder="Enter your email"
                      placeholderTextColor={palette.iconMuted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="ml-3 flex-1 text-xs font-black uppercase tracking-wider"
                      style={{ color: palette.text }}
                    />
                  </View>
                </View>

                <View>
                  <Text className="ml-2 mb-2 text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: palette.textSecondary }}>
                    Contact Protocol
                  </Text>
                  <View className="h-14 flex-row items-center rounded-2xl px-4" style={{ backgroundColor: palette.surfaceSoft }}>
                    <Phone size={16} color={palette.iconMuted} />
                    <TextInput
                      value={shippingInfo.phone}
                      onChangeText={(value) => {
                        setShippingInfoEdits((prev) => ({ ...prev, phone: value }));
                        if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      placeholder="Enter phone number"
                      placeholderTextColor={palette.iconMuted}
                      keyboardType="phone-pad"
                      className="ml-3 flex-1 text-xs font-black uppercase tracking-wider"
                      style={{ color: palette.text }}
                    />
                  </View>
                  {formErrors.phone ? <Text className="mt-1 ml-2 text-[10px] font-bold" style={{ color: palette.danger }}>{formErrors.phone}</Text> : null}
                </View>

                <View>
                  <Text className="ml-2 mb-2 text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: palette.textSecondary }}>
                    Transit Zone / Courier
                  </Text>
                  <View className="gap-2">
                    {activeCouriers.map((courier: any) => {
                      const isSelected = selectedDeliveryZone === courier.name;
                      return (
                        <Pressable
                          key={courier.name}
                          onPress={() => setDeliveryZone(courier.name)}
                          className="min-h-14 rounded-2xl border-2 px-4 py-3 active:scale-95"
                          style={{
                            borderColor: isSelected ? palette.accent : palette.border,
                            backgroundColor: isSelected ? selectedSurface : mutedSurface,
                          }}
                        >
                          <View className="flex-row items-center gap-2">
                            <Truck size={15} color={isSelected ? palette.accent : palette.iconMuted} />
                            <Text className="flex-1 text-[11px] font-black uppercase tracking-wider" style={{ color: palette.text }}>
                              {courier.name}
                            </Text>
                          </View>
                          <Text className="mt-1 ml-6 text-[9px] font-mono font-medium" style={{ color: palette.textSecondary }}>
                            BDT {courier.charge} • {courier.estimatedDays || 'Standard'}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View>
                  <Text className="ml-2 mb-2 text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: palette.textSecondary }}>
                    Full Address
                  </Text>
                  <View className="min-h-14 flex-row items-start rounded-2xl px-4 py-3" style={{ backgroundColor: palette.surfaceSoft }}>
                    <MapPin size={16} color={palette.iconMuted} style={{ marginTop: 2 }} />
                    <TextInput
                      value={shippingInfo.address}
                      onChangeText={(value) => {
                        setShippingInfoEdits((prev) => ({ ...prev, address: value }));
                        if (formErrors.address) setFormErrors((prev) => ({ ...prev, address: undefined }));
                      }}
                      placeholder="Enter your full address"
                      placeholderTextColor={palette.iconMuted}
                      multiline
                      className="ml-3 flex-1 text-xs font-black uppercase tracking-wider"
                      style={{ minHeight: 44, textAlignVertical: 'top', color: palette.text }}
                    />
                  </View>
                  {formErrors.address ? <Text className="mt-1 ml-2 text-[10px] font-bold" style={{ color: palette.danger }}>{formErrors.address}</Text> : null}
                </View>
              </View>
            </View>

            {/* Promo Coupon Form */}
            <View className="flex-row border p-2.5 rounded-2xl items-center mb-6" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', backgroundColor: palette.surfaceSoft, borderColor: palette.border }}>
              <Tag size={16} color={palette.iconMuted} style={{ marginLeft: 8, marginRight: 8 }} />
              <TextInput
                placeholder={t.couponPlaceholder || 'Enter Promo Code'}
                placeholderTextColor={palette.iconMuted}
                className="flex-1 font-semibold text-sm py-1"
                style={{ minWidth: 0, color: palette.text }}
                value={couponCode}
                onChangeText={(value) => setCouponCode(value.toUpperCase())}
                autoCapitalize="characters"
              />
              <Pressable
                onPress={handleApplyCoupon}
                disabled={couponLoading}
                className="h-10 w-20 items-center justify-center rounded-xl active:scale-95"
                style={{ backgroundColor: palette.primary, opacity: couponLoading ? 0.6 : 1 }}
              >
                <Text className="text-[11px] font-black uppercase tracking-wider" style={{ color: palette.onPrimary }}>
                  {couponLoading ? '...' : t.apply || 'Apply'}
                </Text>
              </Pressable>
            </View>
            {couponError ? (
              <Text className="-mt-4 mb-5 ml-2 text-[10px] font-bold" style={{ color: palette.danger }}>
                {couponError}
              </Text>
            ) : null}

            <View className="mb-6">
              <Text className="mb-3 text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: palette.accent }}>
                03. Payment
              </Text>
              <View className="gap-3">
                {enabledPaymentMethods.cod ? (
                  <Pressable
                    onPress={() => setPaymentMethod('cod')}
                    className="flex-row items-center justify-between rounded-2xl border p-4 active:scale-95"
                    style={{
                      borderColor: effectivePaymentMethod === 'cod' ? palette.primary : palette.border,
                      backgroundColor: effectivePaymentMethod === 'cod' ? selectedSurface : palette.surface,
                    }}
                  >
                    <View className="flex-row items-center gap-3">
                      <Banknote size={20} color={palette.primary} />
                      <Text className="text-sm font-bold" style={{ color: palette.text }}>Cash on Delivery (COD)</Text>
                    </View>
                    <View className="h-5 w-5 items-center justify-center rounded-full border" style={{ borderColor: effectivePaymentMethod === 'cod' ? palette.primary : palette.border }}>
                      {effectivePaymentMethod === 'cod' ? <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: palette.primary }} /> : null}
                    </View>
                  </Pressable>
                ) : null}

                {enabledPaymentMethods.bkash ? (
                  <Pressable
                    onPress={() => setPaymentMethod('bkash')}
                    className="flex-row items-center justify-between rounded-2xl border p-4 active:scale-95"
                    style={{
                      borderColor: effectivePaymentMethod === 'bkash' ? palette.primary : palette.border,
                      backgroundColor: effectivePaymentMethod === 'bkash' ? selectedSurface : palette.surface,
                    }}
                  >
                    <View className="flex-row items-center gap-3">
                      <CreditCard size={20} color={palette.primary} />
                      <Text className="text-sm font-bold" style={{ color: palette.text }}>bKash Wallet / MFS</Text>
                    </View>
                    <View className="h-5 w-5 items-center justify-center rounded-full border" style={{ borderColor: effectivePaymentMethod === 'bkash' ? palette.primary : palette.border }}>
                      {effectivePaymentMethod === 'bkash' ? <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: palette.primary }} /> : null}
                    </View>
                  </Pressable>
                ) : null}

                {enabledPaymentMethods.ssl ? (
                  <Pressable
                    onPress={() => setPaymentMethod('ssl')}
                    className="flex-row items-center justify-between rounded-2xl border p-4 active:scale-95"
                    style={{
                      borderColor: effectivePaymentMethod === 'ssl' ? palette.primary : palette.border,
                      backgroundColor: effectivePaymentMethod === 'ssl' ? selectedSurface : palette.surface,
                    }}
                  >
                    <View className="flex-row items-center gap-3">
                      <CreditCard size={20} color={palette.primary} />
                      <Text className="text-sm font-bold" style={{ color: palette.text }}>SSLCommerz (Cards/NetBanking)</Text>
                    </View>
                    <View className="h-5 w-5 items-center justify-center rounded-full border" style={{ borderColor: effectivePaymentMethod === 'ssl' ? palette.primary : palette.border }}>
                      {effectivePaymentMethod === 'ssl' ? <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: palette.primary }} /> : null}
                    </View>
                  </Pressable>
                ) : null}
              </View>
            </View>

            {/* Price Calculations Card */}
            <View className="border p-5 rounded-3xl" style={{ backgroundColor: palette.surface, borderColor: palette.border }}>
              <View className="flex-row justify-between mb-3.5">
                <Text className="text-xs font-semibold" style={{ color: palette.textSecondary }}>
                  {t.subtotal || 'Subtotal'}
                </Text>
                <Text className="text-sm font-bold" style={{ color: palette.text }}>
                  ৳{Math.round(subtotal).toLocaleString()}
                </Text>
              </View>

              <View className="flex-row justify-between mb-3.5">
                <Text className="text-xs font-semibold" style={{ color: palette.textSecondary }}>
                  {t.shipping || 'Shipping'}
                </Text>
                <Text className="text-sm font-bold" style={{ color: palette.text }}>
                  {shippingFee > 0 ? `৳${shippingFee}` : 'Free'}
                </Text>
              </View>

              {discountAmount > 0 ? (
                <View className="flex-row justify-between mb-3.5">
                  <Text className="text-xs font-semibold" style={{ color: palette.success }}>
                    {t.discount || 'Discount'} {discountCodeApplied ? `(${discountCodeApplied})` : ''}
                  </Text>
                  <Text className="text-sm font-bold" style={{ color: palette.success }}>
                    -৳{Math.round(discountAmount).toLocaleString()}
                  </Text>
                </View>
              ) : null}

              <View className="h-px my-4" style={{ backgroundColor: palette.border }} />

              <View className="flex-row justify-between items-baseline">
                <Text className="text-sm font-bold" style={{ color: palette.text }}>
                  {t.total || 'Grand Total'}
                </Text>
                <Text className="text-xl font-black italic" style={{ color: palette.text }}>
                  ৳{Math.round(grandTotal).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        }
      />

      {/* Checkout Bar */}
      <View className="px-5 py-4 border-t flex-col gap-3" style={{ backgroundColor: palette.nav, borderColor: palette.border }}>
        {orderError ? (
          <Text className="rounded-2xl px-4 py-3 text-xs font-bold" style={{ backgroundColor: dangerSurface, color: palette.danger }}>
            {orderError}
          </Text>
        ) : null}
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-sm font-bold" style={{ color: palette.navText }}>
            Grand Total
          </Text>
          <Text className="text-lg font-black italic" style={{ color: palette.navText }}>
            ৳{Math.round(grandTotal).toLocaleString()}
          </Text>
        </View>
        <Pressable
          onPress={handlePlaceOrder}
          disabled={orderLoading}
          className="w-full h-12 items-center justify-center rounded-2xl active:scale-95"
          style={{ backgroundColor: palette.primary, opacity: orderLoading ? 0.65 : 1 }}
        >
          <Text className="text-sm font-black uppercase tracking-wider" style={{ color: palette.onPrimary }}>
            {orderLoading ? 'Processing Order...' : 'Place Order'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
