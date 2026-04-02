import crypto from 'crypto';

export const sendFacebookEvent = async ({
  eventName,
  eventId, // 👈 Consuming the ID
  eventTime = Math.floor(Date.now() / 1000),
  userData = {},
  customData = {},
  eventSourceUrl = '',
}) => {
  const pixelId = process.env.FACEBOOK_PIXEL_ID;
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn('Facebook CAPI credentials missing – skipping event');
    return;
  }

  const hash = (value) => {
    if (!value) return undefined;
    return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
  };

  // Build user_data object with hashed fields
  const userDataHashed = {
    em: hash(userData.email),
    ph: hash(userData.phone),
    fn: hash(userData.name),
    ln: hash(userData.lastName),
    ct: hash(userData.city),
    st: hash(userData.state),
    zp: hash(userData.zip),
    country: hash(userData.country),
    ...(userData.fbp && { fbp: userData.fbp }),
    ...(userData.fbc && { fbc: userData.fbc }),
  };

  // 🚀 Format the exact payload Meta requires
  const eventPayload = {
    data: [
      {
        event_name: eventName,
        event_time: eventTime,
        event_id: eventId, // 🌟 THE MAGIC KEY: Ties Browser & Server together
        user_data: userDataHashed,
        custom_data: customData,
        action_source: 'website',
        event_source_url: eventSourceUrl,
      },
    ],
    access_token: accessToken,
  };

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
    });
    const result = await response.json();
    console.log(`Facebook CAPI (${eventName}): Deduplication Synced. Result:`, result);
  } catch (error) {
    console.error(`Error sending Facebook CAPI event (${eventName}):`, error);
  }
};