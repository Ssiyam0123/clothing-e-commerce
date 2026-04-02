import { create } from 'zustand';
import api from '@/lib/api';

const getFacebookCookies = () => {
  if (typeof window === 'undefined') return {};
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  return {
    fbp: getCookie('_fbp'),
    fbc: getCookie('_fbc'),
  };
};

export const useTrackingStore = create((set, get) => ({
  eventsHistory: [],

  sendEvent: async (eventName, eventData = {}, userData = {}, customEventId = null) => {
    const { fbp, fbc } = getFacebookCookies();
    const eventId = customEventId || "ev_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, eventData, { eventID: eventId });
    }

    const payload = {
      eventName,
      eventData,
      eventId,
      userData: {
        ...userData,
        ...(fbp && { fbp }),
        ...(fbc && { fbc }),
      },
    };

    try {
      await api.post('/track', payload);
      set((state) => ({
        eventsHistory: [...state.eventsHistory, { eventName, eventData, userData, eventId, timestamp: Date.now() }],
      }));
    } catch (error) {
      console.error(`Failed to track ${eventName}:`, error);
    }
  },

  // 🚀 SENIOR FIX: The Standard Search Event
  trackSearch: (searchString = null, categoryName = null, userData = {}) => {
    const eventData = {};
    if (searchString) eventData.search_string = searchString;
    if (categoryName && categoryName !== 'all') eventData.content_category = categoryName;

    if (Object.keys(eventData).length === 0) return;
    get().sendEvent('Search', eventData, userData);
  },

  trackPageView: (pageUrl, userData = {}) => {
    get().sendEvent('PageView', { page_url: pageUrl }, userData);
  },

  trackViewItemList: (productIds, category, userData = {}) => {
    get().sendEvent('ViewContent', {
      content_ids: productIds,
      content_type: 'product',
      content_category: category,
    }, userData);
  },

  trackSelectItem: (productId, productName, price, category, userData = {}) => {
    get().sendEvent('SelectContent', {
      content_ids: [productId],
      content_name: productName,
      content_type: 'product',
      value: price,
      currency: 'BDT',
      content_category: category,
    }, userData);
  },

  trackViewContent: (productId, productName, price, category, userData = {}) => {
    get().sendEvent('ViewContent', {
      content_ids: [productId],
      content_name: productName,
      content_type: 'product',
      value: price,
      currency: 'BDT',
      content_category: category,
    }, userData);
  },

  trackAddToCart: (productId, price, quantity, userData = {}) => {
    get().sendEvent('AddToCart', {
      content_ids: [productId],
      content_type: 'product',
      value: price,
      currency: 'BDT',
      num_items: quantity,
    }, userData);
  },

  trackRemoveFromCart: (productId, price, userData = {}) => {
    get().sendEvent('RemoveFromCart', {
      content_ids: [productId],
      content_type: 'product',
      value: price,
      currency: 'BDT',
    }, userData);
  },

  trackViewCart: (cartItems, totalPrice, userData = {}) => {
    get().sendEvent('ViewCart', {
      content_ids: cartItems.map(item => item.product?._id || item.product),
      content_type: 'product',
      value: totalPrice,
      currency: 'BDT',
      num_items: cartItems.length,
    }, userData);
  },

  trackInitiateCheckout: (userData = {}) => {
    get().sendEvent('InitiateCheckout', {}, userData);
  },

  trackAddShippingInfo: (totalPrice, userData = {}) => {
    get().sendEvent('AddShippingInfo', {
      currency: 'BDT',
      value: totalPrice,
    }, userData);
  },

  trackAddPaymentInfo: (totalPrice, userData = {}) => {
    get().sendEvent('AddPaymentInfo', {
      currency: 'BDT',
      value: totalPrice,
    }, userData);
  },

  trackPurchase: (orderId, totalPrice, productIds, userData = {}) => {
    get().sendEvent('Purchase', {
      content_ids: productIds,
      content_type: 'product',
      value: totalPrice,
      currency: 'BDT',
      num_items: productIds.length,
      order_id: orderId,
    }, userData, orderId); 
  },
}));