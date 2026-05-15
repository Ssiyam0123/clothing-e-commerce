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

/**
 * Universal Tracking Function
 * Sends events to: Browser (Meta, GTM, TikTok, Snap, Pinterest) & Server (CAPI)
 */
export const trackEvent = async (eventName, eventData = {}, userData = {}, customEventId = null) => {
  const { fbp, fbc } = getFacebookCookies();
  const eventId = customEventId || "ev_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

  // 1. Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, eventData, { eventID: eventId });
  }

  // 2. GTM / Google Analytics
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...eventData, eventId });
  }

  // 3. TikTok Pixel
  if (typeof window !== 'undefined' && window.ttq && typeof window.ttq.track === 'function') {
    window.ttq.track(eventName, {
      contents: eventData.content_ids?.map(id => ({ content_id: id, content_type: 'product' })),
      value: eventData.value,
      currency: eventData.currency || 'BDT',
    });
  }

  // 4. Snapchat
  if (typeof window !== 'undefined' && window.snaptr && typeof window.snaptr === 'function') {
    const snapEventMap = {
      'AddToCart': 'ADD_CART',
      'Purchase': 'PURCHASE',
      'ViewContent': 'VIEW_CONTENT',
      'InitiateCheckout': 'START_CHECKOUT',
    };
    window.snaptr('track', snapEventMap[eventName] || eventName, {
      item_ids: eventData.content_ids,
      price: eventData.value,
      currency: eventData.currency || 'BDT',
    });
  }

  // 5. Pinterest
  if (typeof window !== 'undefined' && window.pintrk && typeof window.pintrk === 'function') {
    window.pintrk('track', eventName.toLowerCase(), {
      value: eventData.value,
      currency: eventData.currency || 'BDT',
      line_items: eventData.content_ids?.map(id => ({ product_id: id }))
    });
  }

  // 6. Server-Side CAPI (Meta & TikTok via our backend)
  try {
    await api.post('/track', {
      eventName,
      eventData,
      eventId,
      userData: {
        ...userData,
        ...(fbp && { fbp }),
        ...(fbc && { fbc }),
      },
    });
  } catch (error) {
    console.warn(`CAPI Tracking failed for ${eventName}`, error);
  }
};
