// src/lib/api.js
import axios from 'axios';
import { getApiUrl } from '@/utils/imageUtils';
import { getGuestId } from '@/utils/guestId';

const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,   // ✅ essential for sending cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add guest ID header and log requests
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    const guestId = getGuestId();
    if (guestId) {
      config.headers['x-guest-id'] = guestId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to log errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;