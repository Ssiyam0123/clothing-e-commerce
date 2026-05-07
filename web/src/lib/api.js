// src/lib/api.js
import axios from 'axios';
import { getGuestId } from '@/utils/guestId';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Add token, guest ID, and brand context to every request
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Guest user: send persistent guest ID
    const guestId = getGuestId();
    if (guestId) {
      config.headers['x-guest-id'] = guestId;
    }
  }

  // Add Multi-Tenant Context Headers
  if (typeof window !== 'undefined') {
    const html = document.documentElement;
    config.headers['x-vanguard-theme'] = html.getAttribute('data-theme') || 'executive';
  }

  return config;
});

export default api;