import { create } from 'zustand';
import { trackEvent } from '@/lib/tracking/tracker';

export const useTrackingStore = create((set, get) => ({
  eventsHistory: [],

  sendEvent: async (eventName, eventData = {}, userData = {}, customEventId = null) => {
    // Use the unified tracker
    await trackEvent(eventName, eventData, userData, customEventId);
    
    // Maintain local history
    set((state) => ({
      eventsHistory: [...state.eventsHistory, { 
        eventName, 
        eventData, 
        userData, 
        eventId: customEventId || 'recorded', 
        timestamp: Date.now() 
      }],
    }));
  },

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