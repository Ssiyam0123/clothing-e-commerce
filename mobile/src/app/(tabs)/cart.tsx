import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, TextInput, SafeAreaView, Alert } from 'react-native';
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

export default function CartScreen() {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const settings = useAppStore((s) => s.settings);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  
  const itemsMap = useCartStore((s) => s.itemsMap);
  const updateCartItem = useCartStore((s) => s.updateCartItem);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalCartItems = useCartStore((s) => s.totalItems);
  const totalCartPrice = useCartStore((s) => s.totalPrice);
  const buyNowItem = useCartStore((s) => s.buyNowItem);
  const clearBuyNowItem = useCartStore((s) => s.clearBuyNowItem);
  
  const t = getTranslation('cart', lang);

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
      product: item.product._id,
      size: item.size._id,
      quantity: item.quantity,
    }));

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
        if (isBuyNow) {
          clearBuyNowItem();
        } else {
          clearCart();
        }
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

        router.replace({
          pathname: '/checkout/success',
          params: { orderId },
        });
        return;
      }

      if (data.url) {
        router.replace({
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
      <SafeAreaView className="flex-1 bg-background justify-center items-center p-6" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
        <View className="items-center justify-center p-8 bg-slate-50 dark:bg-zinc-900 rounded-3xl mb-6">
          <ShoppingCart size={48} className="text-slate-300 dark:text-zinc-700 mb-4" />
          <Text className="text-lg font-black text-foreground italic mb-2">
            {t.emptyCart || 'Your Cart is Empty'}
          </Text>
          <Text className="text-xs text-slate-500 dark:text-zinc-400 text-center">
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
    <SafeAreaView className="flex-1 bg-background" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
      {/* Header bar */}
      <View className="flex-row items-center justify-between px-4 py-2 bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-900 h-14 z-10">
        <Pressable
          onPress={() => {
            if (isBuyNow) clearBuyNowItem();
            safeBack();
          }}
          className="w-9 h-9 items-center justify-center rounded-full active:scale-95"
        >
          <ArrowLeft size={22} className="text-foreground" />
        </Pressable>

        <Text className="text-base font-black text-foreground uppercase tracking-widest">
          {isBuyNow ? 'Buy Now' : (t.title || 'Cart')}
        </Text>

        <View className="w-9 h-9 items-center justify-center relative">
          <ShoppingCart size={22} className="text-foreground" />
          {!isBuyNow && totalCartItems > 0 ? (
            <View className="absolute top-1 right-1 bg-red-500 rounded-full h-4 min-w-4 px-1 items-center justify-center">
              <Text className="text-white text-[8px] font-black text-center">{totalCartItems}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <FlatList
        data={cartList}
        keyExtractor={(item) => `${item.product._id}_${item.size._id}`}
        contentContainerStyle={{ padding: 16 }}
        style={{ width: '100%', maxWidth: '100%' }}
        renderItem={({ item }) => {
          const imageUrl = getImageUrl(item.product.images?.[0]);
          return (
            <View className="flex-row bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/40 p-3 rounded-2xl mb-3 items-center" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
              {/* Left Product Image */}
              <Image
                source={{ uri: imageUrl }}
                className="w-20 h-20 rounded-xl bg-slate-50"
                resizeMode="cover"
              />
              
              {/* Middle details */}
              <View className="flex-1 ml-4 pr-1 justify-center" style={{ minWidth: 0 }}>
                <Text className="text-sm font-bold text-foreground mb-1 leading-5">
                  {item.product.name}
                </Text>
                
                <Text className="text-sm font-black text-foreground italic mb-2">
                  ৳{Math.round(item.discountedPrice * item.quantity).toLocaleString()}
                </Text>

                <Text className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                  Size: {item.size.name}
                </Text>
              </View>

              {/* Right side actions */}
              <View className="h-20 justify-between items-end pl-2">
                {/* Trash button */}
                <Pressable
                  onPress={() => removeFromCart(item.product._id, item.size._id, isAuthenticated)}
                  className="p-1.5 bg-slate-55 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900 rounded-xl active:scale-90"
                >
                  <Trash2 size={16} color="#EF4444" />
                </Pressable>

                {/* Quantity selector */}
                <View className="flex-row items-center bg-slate-50 dark:bg-zinc-950 rounded-xl py-0.5 px-1 border border-slate-150 dark:border-zinc-900">
                  <Pressable
                    onPress={() => {
                      if (item.quantity > 1) {
                        updateCartItem(item.product._id, item.size._id, item.quantity - 1, isAuthenticated);
                      }
                    }}
                    className="w-6 h-6 items-center justify-center rounded-lg bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/60"
                  >
                    <Minus size={12} className="text-foreground" />
                  </Pressable>

                  <Text className="text-xs font-black text-foreground px-2 text-center min-w-[20px]">
                    {item.quantity}
                  </Text>

                  <Pressable
                    onPress={() => {
                      updateCartItem(item.product._id, item.size._id, item.quantity + 1, isAuthenticated);
                    }}
                    className="w-6 h-6 items-center justify-center rounded-lg bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/60"
                  >
                    <Plus size={12} className="text-foreground" />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          <View className="mt-4 mb-6">
            <View className="mb-6 border-b border-slate-100 pb-6 dark:border-zinc-900">
              <View className="mb-4">
                <Text className="text-[10px] font-black uppercase tracking-[0.35em] text-red-500">
                  02. Destination
                </Text>
                <Text className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                  Deployment Logistics
                </Text>
              </View>

              <View className="gap-4">
                <View>
                  <Text className="ml-2 mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Full Identity
                  </Text>
                  <View className="h-14 flex-row items-center rounded-2xl bg-slate-100 px-4 dark:bg-zinc-900">
                    <User size={16} color="#94A3B8" />
                    <TextInput
                      value={shippingInfo.name}
                      onChangeText={(value) => {
                        setShippingInfoEdits((prev) => ({ ...prev, name: value }));
                        if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder="Enter your full name"
                      placeholderTextColor="#94A3B8"
                      className="ml-3 flex-1 text-xs font-black uppercase tracking-wider text-foreground"
                    />
                  </View>
                  {formErrors.name ? <Text className="mt-1 ml-2 text-[10px] font-bold text-red-500">{formErrors.name}</Text> : null}
                </View>

                <View>
                  <Text className="ml-2 mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Email Address
                  </Text>
                  <View className="h-14 flex-row items-center rounded-2xl bg-slate-100 px-4 dark:bg-zinc-900">
                    <Mail size={16} color="#94A3B8" />
                    <TextInput
                      value={shippingInfo.email}
                      onChangeText={(value) => setShippingInfoEdits((prev) => ({ ...prev, email: value }))}
                      placeholder="Enter your email"
                      placeholderTextColor="#94A3B8"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="ml-3 flex-1 text-xs font-black uppercase tracking-wider text-foreground"
                    />
                  </View>
                </View>

                <View>
                  <Text className="ml-2 mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Contact Protocol
                  </Text>
                  <View className="h-14 flex-row items-center rounded-2xl bg-slate-100 px-4 dark:bg-zinc-900">
                    <Phone size={16} color="#94A3B8" />
                    <TextInput
                      value={shippingInfo.phone}
                      onChangeText={(value) => {
                        setShippingInfoEdits((prev) => ({ ...prev, phone: value }));
                        if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      placeholder="Enter phone number"
                      placeholderTextColor="#94A3B8"
                      keyboardType="phone-pad"
                      className="ml-3 flex-1 text-xs font-black uppercase tracking-wider text-foreground"
                    />
                  </View>
                  {formErrors.phone ? <Text className="mt-1 ml-2 text-[10px] font-bold text-red-500">{formErrors.phone}</Text> : null}
                </View>

                <View>
                  <Text className="ml-2 mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
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
                            borderColor: isSelected ? '#EF4444' : 'transparent',
                            backgroundColor: isSelected ? 'rgba(239,68,68,0.08)' : 'rgba(148,163,184,0.14)',
                          }}
                        >
                          <View className="flex-row items-center gap-2">
                            <Truck size={15} color={isSelected ? '#EF4444' : '#64748B'} />
                            <Text className="flex-1 text-[11px] font-black uppercase tracking-wider text-foreground">
                              {courier.name}
                            </Text>
                          </View>
                          <Text className="mt-1 ml-6 text-[9px] font-mono font-medium text-slate-500">
                            BDT {courier.charge} • {courier.estimatedDays || 'Standard'}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View>
                  <Text className="ml-2 mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Full Address
                  </Text>
                  <View className="min-h-14 flex-row items-start rounded-2xl bg-slate-100 px-4 py-3 dark:bg-zinc-900">
                    <MapPin size={16} color="#94A3B8" style={{ marginTop: 2 }} />
                    <TextInput
                      value={shippingInfo.address}
                      onChangeText={(value) => {
                        setShippingInfoEdits((prev) => ({ ...prev, address: value }));
                        if (formErrors.address) setFormErrors((prev) => ({ ...prev, address: undefined }));
                      }}
                      placeholder="Enter your full address"
                      placeholderTextColor="#94A3B8"
                      multiline
                      className="ml-3 flex-1 text-xs font-black uppercase tracking-wider text-foreground"
                      style={{ minHeight: 44, textAlignVertical: 'top' }}
                    />
                  </View>
                  {formErrors.address ? <Text className="mt-1 ml-2 text-[10px] font-bold text-red-500">{formErrors.address}</Text> : null}
                </View>
              </View>
            </View>

            {/* Promo Coupon Form */}
            <View className="flex-row bg-slate-55 dark:bg-zinc-900/40 border border-slate-200/50 dark:border-zinc-800 p-2.5 rounded-2xl items-center mb-6" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
              <Tag size={16} color="#94A3B8" style={{ marginLeft: 8, marginRight: 8 }} />
              <TextInput
                placeholder={t.couponPlaceholder || 'Enter Promo Code'}
                placeholderTextColor="#94A3B8"
                className="flex-1 text-foreground font-semibold text-sm py-1"
                style={{ minWidth: 0 }}
                value={couponCode}
                onChangeText={(value) => setCouponCode(value.toUpperCase())}
                autoCapitalize="characters"
              />
              <Pressable
                onPress={handleApplyCoupon}
                disabled={couponLoading}
                className="h-10 w-20 items-center justify-center rounded-xl active:scale-95"
                style={{ backgroundColor: '#0F172A', opacity: couponLoading ? 0.6 : 1 }}
              >
                <Text className="text-[11px] font-black uppercase tracking-wider text-white">
                  {couponLoading ? '...' : t.apply || 'Apply'}
                </Text>
              </Pressable>
            </View>
            {couponError ? (
              <Text className="-mt-4 mb-5 ml-2 text-[10px] font-bold text-red-500">
                {couponError}
              </Text>
            ) : null}

            <View className="mb-6">
              <Text className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-red-500">
                03. Payment
              </Text>
              <View className="gap-3">
                {enabledPaymentMethods.cod ? (
                  <Pressable
                    onPress={() => setPaymentMethod('cod')}
                    className="flex-row items-center justify-between rounded-2xl border p-4 active:scale-95"
                    style={{
                      borderColor: effectivePaymentMethod === 'cod' ? '#0F172A' : '#E5E7EB',
                      backgroundColor: effectivePaymentMethod === 'cod' ? 'rgba(15,23,42,0.06)' : 'transparent',
                    }}
                  >
                    <View className="flex-row items-center gap-3">
                      <Banknote size={20} color="#0F172A" />
                      <Text className="text-sm font-bold text-foreground">Cash on Delivery (COD)</Text>
                    </View>
                    <View className="h-5 w-5 items-center justify-center rounded-full border" style={{ borderColor: effectivePaymentMethod === 'cod' ? '#0F172A' : '#CBD5E1' }}>
                      {effectivePaymentMethod === 'cod' ? <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#0F172A' }} /> : null}
                    </View>
                  </Pressable>
                ) : null}

                {enabledPaymentMethods.bkash ? (
                  <Pressable
                    onPress={() => setPaymentMethod('bkash')}
                    className="flex-row items-center justify-between rounded-2xl border p-4 active:scale-95"
                    style={{
                      borderColor: effectivePaymentMethod === 'bkash' ? '#0F172A' : '#E5E7EB',
                      backgroundColor: effectivePaymentMethod === 'bkash' ? 'rgba(15,23,42,0.06)' : 'transparent',
                    }}
                  >
                    <View className="flex-row items-center gap-3">
                      <CreditCard size={20} color="#0F172A" />
                      <Text className="text-sm font-bold text-foreground">bKash Wallet / MFS</Text>
                    </View>
                    <View className="h-5 w-5 items-center justify-center rounded-full border" style={{ borderColor: effectivePaymentMethod === 'bkash' ? '#0F172A' : '#CBD5E1' }}>
                      {effectivePaymentMethod === 'bkash' ? <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#0F172A' }} /> : null}
                    </View>
                  </Pressable>
                ) : null}

                {enabledPaymentMethods.ssl ? (
                  <Pressable
                    onPress={() => setPaymentMethod('ssl')}
                    className="flex-row items-center justify-between rounded-2xl border p-4 active:scale-95"
                    style={{
                      borderColor: effectivePaymentMethod === 'ssl' ? '#0F172A' : '#E5E7EB',
                      backgroundColor: effectivePaymentMethod === 'ssl' ? 'rgba(15,23,42,0.06)' : 'transparent',
                    }}
                  >
                    <View className="flex-row items-center gap-3">
                      <CreditCard size={20} color="#0F172A" />
                      <Text className="text-sm font-bold text-foreground">SSLCommerz (Cards/NetBanking)</Text>
                    </View>
                    <View className="h-5 w-5 items-center justify-center rounded-full border" style={{ borderColor: effectivePaymentMethod === 'ssl' ? '#0F172A' : '#CBD5E1' }}>
                      {effectivePaymentMethod === 'ssl' ? <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#0F172A' }} /> : null}
                    </View>
                  </Pressable>
                ) : null}
              </View>
            </View>

            {/* Price Calculations Card */}
            <View className="bg-slate-50 dark:bg-zinc-900/20 border border-slate-100 dark:border-zinc-800/40 p-5 rounded-3xl">
              <View className="flex-row justify-between mb-3.5">
                <Text className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                  {t.subtotal || 'Subtotal'}
                </Text>
                <Text className="text-sm font-bold text-foreground">
                  ৳{Math.round(subtotal).toLocaleString()}
                </Text>
              </View>

              <View className="flex-row justify-between mb-3.5">
                <Text className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                  {t.shipping || 'Shipping'}
                </Text>
                <Text className="text-sm font-bold text-foreground">
                  {shippingFee > 0 ? `৳${shippingFee}` : 'Free'}
                </Text>
              </View>

              {discountAmount > 0 ? (
                <View className="flex-row justify-between mb-3.5">
                  <Text className="text-xs font-semibold text-emerald-500">
                    {t.discount || 'Discount'} {discountCodeApplied ? `(${discountCodeApplied})` : ''}
                  </Text>
                  <Text className="text-sm font-bold text-emerald-500">
                    -৳{Math.round(discountAmount).toLocaleString()}
                  </Text>
                </View>
              ) : null}

              <View className="h-px bg-slate-200 dark:bg-zinc-800 my-4" />

              <View className="flex-row justify-between items-baseline">
                <Text className="text-sm font-bold text-foreground">
                  {t.total || 'Grand Total'}
                </Text>
                <Text className="text-xl font-black text-foreground italic">
                  ৳{Math.round(grandTotal).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        }
      />

      {/* Checkout Bar */}
      <View className="px-5 py-4 border-t border-slate-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex-col gap-3">
        {orderError ? (
          <Text className="rounded-2xl bg-red-50 px-4 py-3 text-xs font-bold text-red-500 dark:bg-red-950/20">
            {orderError}
          </Text>
        ) : null}
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-sm font-bold text-slate-500 dark:text-zinc-400">
            Grand Total
          </Text>
          <Text className="text-lg font-black text-foreground italic">
            ৳{Math.round(grandTotal).toLocaleString()}
          </Text>
        </View>
        <Pressable
          onPress={handlePlaceOrder}
          disabled={orderLoading}
          className="w-full h-12 items-center justify-center rounded-2xl active:scale-95"
          style={{ backgroundColor: '#0F172A', opacity: orderLoading ? 0.65 : 1 }}
        >
          <Text className="text-sm font-black uppercase tracking-wider text-white">
            {orderLoading ? 'Processing Order...' : 'Place Order'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
