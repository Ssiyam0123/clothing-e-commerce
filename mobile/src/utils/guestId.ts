import * as SecureStore from './secureStore';

const GUEST_ID_KEY = 'vanguard_guest_id';

const createGuestId = () => {
  const randomId = globalThis.crypto?.randomUUID?.()
    || `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  return `guest_${randomId}`;
};

export const getGuestId = async () => {
  let guestId = await SecureStore.getItemAsync(GUEST_ID_KEY);
  if (!guestId) {
    guestId = createGuestId();
    await SecureStore.setItemAsync(GUEST_ID_KEY, guestId);
  }
  return guestId;
};
