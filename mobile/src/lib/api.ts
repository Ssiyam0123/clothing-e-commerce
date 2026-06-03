import axios from 'axios';
import * as SecureStore from '../utils/secureStore';
import { getGuestId } from '../utils/guestId';

const getBackendUrl = () => {
  // If a manual URL is provided in env, use that
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // Otherwise, fallback to the deployed Render backend URL
  return 'https://vanguard-backend-yxd5.onrender.com';
};

export const API_URL = getBackendUrl();

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('vanguard_jwt_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const guestId = await getGuestId();
      if (guestId) {
        config.headers['x-guest-id'] = guestId;
      }
    } catch (error) {
      console.warn('Error reading secure token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await SecureStore.deleteItemAsync('vanguard_jwt_token');
      } catch (e) {
        console.error('Error in 401 interceptor:', e);
      }
    }
    return Promise.reject(error);
  }
);

export const getImageUrl = (path?: string) => {
  if (!path) return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'; // fallback sneaker/placeholder
  if (path.startsWith('//')) return `https:${path}`;
  if (path.startsWith('data:')) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};
