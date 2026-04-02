export const getGuestId = () => {
  if (typeof window === 'undefined') return null;
  let guestId = localStorage.getItem('vanguard_guest_id');
  if (!guestId) {
    guestId = 'guest_' + crypto.randomUUID();
    localStorage.setItem('vanguard_guest_id', guestId);
  }
  return guestId;
};