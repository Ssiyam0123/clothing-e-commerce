/**
 * Facebook Event Tracker
 * Handles both Browser (Pixel) and Server (CAPI) events with deduplication
 */

import { isAdminRoute } from '@/lib/tracking/isAdminRoute';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const trackFacebookEvent = async (eventName, eventData = {}, userData = {}) => {
  if (isAdminRoute()) return;

  try {
    // 1. Generate a unique Event ID for deduplication
    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 2. Track via Browser (Meta Pixel)
    if (window.fbq) {
      window.fbq('track', eventName, eventData, { eventID: eventId });
      console.log(`[FB-Pixel] Tracked: ${eventName}`, eventData);
    }

    // 3. Track via Server (Conversions API)
    fetch(`${API_URL}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        eventData,
        userData,
        eventId, // Must match Pixel eventID
        eventSourceUrl: window.location.href,
      }),
    }).catch(err => console.error('[FB-CAPI] Proxy Error:', err));

  } catch (error) {
    console.error(`[FB-Tracker] Error tracking ${eventName}:`, error);
  }
};
