import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeStorage } from '../utils/storage';
import * as SecureStore from '../utils/secureStore';
import { api } from '../lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string | { name?: string };
  phone?: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  forgotPassword: (email: string) => Promise<any>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          
          // SecureStore for token
          await SecureStore.setItemAsync('vanguard_jwt_token', data.token);
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          return data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/register', { name, email, password });
          
          if (data.token) {
            await SecureStore.setItemAsync('vanguard_jwt_token', data.token);
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }

          return data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await SecureStore.deleteItemAsync('vanguard_jwt_token');
        } catch (err) {
          console.warn('Error deleting secure token:', err);
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      checkSession: async () => {
        set({ isLoading: true });
        try {
          const token = await SecureStore.getItemAsync('vanguard_jwt_token');
          if (!token) {
            set({ isLoading: false, isAuthenticated: false, user: null, token: null });
            return;
          }

          const { data } = await api.get('/auth/me');
          set({
            user: data,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          console.warn('[Session] Restore session failed:', error.message);
          if (error.response && [401, 403].includes(error.response.status)) {
            await get().logout();
          } else {
            set({ isLoading: false });
          }
        }
      },

      forgotPassword: async (email) => {
        const { data } = await api.post('/auth/forgot-password', { email });
        return data;
      },
    }),
    {
      name: 'vanguard-auth-storage',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
