import crypto from 'crypto';
import ApiKey from '../../modules/settings/apiKey.model.js';
import { decrypt } from '../../utils/encryption.js';

/**
 * Common hashing function for PII
 */
const hash = (value) => {
  if (!value) return undefined;
  return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
};

/**
 * Send event to Facebook CAPI
 */
const sendToFacebook = async ({ eventName, eventId, eventTime, userData, customData, eventSourceUrl, pixelId, accessToken, testEventCode }) => {
  const userDataHashed = {
    em: hash(userData.email),
    ph: hash(userData.phone),
    fn: hash(userData.name),
    ln: hash(userData.lastName),
    ct: hash(userData.city),
    st: hash(userData.state),
    zp: hash(userData.zip),
    country: hash(userData.country),
    fbp: userData.fbp,
    fbc: userData.fbc,
    client_ip_address: userData.ip,
    client_user_agent: userData.userAgent,
  };

  const payload = {
    data: [{
      event_name: eventName,
      event_time: eventTime,
      event_id: eventId,
      user_data: userDataHashed,
      custom_data: customData,
      action_source: 'website',
      event_source_url: eventSourceUrl,
    }],
    access_token: accessToken,
  };

  if (testEventCode) payload.test_event_code = testEventCode;

  return fetch(`https://graph.facebook.com/v19.0/${pixelId}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
};

/**
 * Send event to TikTok Events API
 */
const sendToTikTok = async ({ eventName, eventId, userData, customData, eventSourceUrl, pixelId, accessToken }) => {
  const payload = {
    pixel_code: pixelId,
    event: eventName,
    event_id: eventId,
    timestamp: new Date().toISOString(),
    context: {
      page: { url: eventSourceUrl },
      user: {
        email: hash(userData.email),
        phone_number: hash(userData.phone),
      },
      ad: { callback: userData.fbc },
      ip: userData.ip,
      user_agent: userData.userAgent,
    },
    properties: {
      contents: customData.content_ids?.map(id => ({ content_id: id, content_type: 'product' })),
      value: customData.value,
      currency: customData.currency || 'BDT',
    }
  };

  return fetch(`https://business-api.tiktok.com/open_api/v1.3/event/track/`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Access-Token': accessToken
    },
    body: JSON.stringify(payload),
  });
};

/**
 * Main Service Exporter
 */
export const sendUnifiedCapiEvent = async (params) => {
  const apiKeys = await ApiKey.findOne();
  const promises = [];

  const fbPixelId = apiKeys?.fbPixelId ? decrypt(apiKeys.fbPixelId) : null;
  const fbAccessToken = apiKeys?.fbAccessToken ? decrypt(apiKeys.fbAccessToken) : null;
  const fbTestEventCode = apiKeys?.fbTestEventCode ? decrypt(apiKeys.fbTestEventCode) : null;
  const tiktokPixelId = apiKeys?.tiktokPixelId ? decrypt(apiKeys.tiktokPixelId) : null;
  const tiktokAccessToken = apiKeys?.tiktokAccessToken ? decrypt(apiKeys.tiktokAccessToken) : null;

  // Facebook
  if (fbPixelId && fbAccessToken) {
    promises.push(sendToFacebook({
      ...params,
      pixelId: fbPixelId,
      accessToken: fbAccessToken,
      testEventCode: fbTestEventCode
    }));
  }

  // TikTok
  if (tiktokPixelId && tiktokAccessToken) {
    promises.push(sendToTikTok({
      ...params,
      pixelId: tiktokPixelId,
      accessToken: tiktokAccessToken
    }));
  }

  try {
    const results = await Promise.allSettled(promises);
    console.log('Unified CAPI Results:', results.map(r => r.status));
  } catch (error) {
    console.error('Unified CAPI Error:', error);
  }
};
