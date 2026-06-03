import { api } from './api';

/**
 * Universal Event Tracker for Mobile
 * Sends event analytics to the backend CAPI (/api/track)
 */
export const trackEvent = async (
  eventName: 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase' | string,
  eventData: {
    content_ids?: string[];
    content_name?: string;
    content_type?: string;
    value?: number;
    currency?: string;
    [key: string]: any;
  } = {},
  userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    externalId?: string;
    [key: string]: any;
  } = {}
) => {
  const eventId = 'ev_mob_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);

  try {
    await api.post('/track', {
      eventName,
      eventData: {
        currency: 'BDT',
        ...eventData,
      },
      eventId,
      eventSourceUrl: 'app://vanguard-mobile',
      userData,
    });
  } catch (error: any) {
    console.warn(`[Tracker] CAPI dispatch failed for ${eventName}:`, error.message);
  }
};
