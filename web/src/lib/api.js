// src/lib/api.js
import axios from 'axios';
import { getGuestId } from '@/utils/guestId';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Add token or guest ID to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Guest user: send persistent guest ID
    const guestId = getGuestId();
    if (guestId) {
      config.headers['x-guest-id'] = guestId;
    }
  }
  return config;
});

export default api;