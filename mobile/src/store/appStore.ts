import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../lib/api';

interface BrandingSettings {
  siteName?: string;
  siteDescription?: string;
  logo?: string;
  activeTheme?: 'executive' | 'streetwear' | 'vintage' | 'modern';
  defaultLanguage?: 'en' | 'bn';
  defaultTheme?: 'light' | 'dark';
  [key: string]: any;
}

interface AppSettings {
  config?: {
    maintenanceMode?: boolean;
    [key: string]: any;
  };
  branding?: BrandingSettings;
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
    whatsapp?: string;
    [key: string]: any;
  };
  paymentOptions?: {
    cod?: boolean;
    online?: boolean;
    bkash?: boolean;
    [key: string]: any;
  };
  shipping?: {
    insideDhaka?: number;
    outsideDhaka?: number;
    couriers?: {
      name: string;
      charge: number;
      estimatedDays?: string;
      isActive?: boolean;
    }[];
    [key: string]: any;
  };
  socialLinks?: {
    platform?: string;
    url?: string;
    icon?: string;
    isActive?: boolean;
  }[];
  [key: string]: any;
}

interface AppState {
  theme: 'light' | 'dark';
  lang: 'en' | 'bn';
  settings: AppSettings | null;
  maintenanceMode: boolean;
  isInitialized: boolean;

  setTheme: (theme: 'light' | 'dark') => void;
  setLang: (lang: 'en' | 'bn') => void;
  toggleTheme: () => void;
  refreshSettings: () => Promise<void>;
  initApp: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      lang: 'en',
      settings: null,
      maintenanceMode: false,
      isInitialized: false,

      setTheme: (theme) => set({ theme }),
      setLang: (lang) => set({ lang }),
      
      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: nextTheme });
      },

      refreshSettings: async () => {
        try {
          const { data } = await api.get('/settings');
          const branding = data.branding || {};
          const isMaintenance = !!data.config?.maintenanceMode;

          set({
            settings: data,
            maintenanceMode: isMaintenance,
            theme: branding.defaultTheme === 'light' ? 'light' : 'dark',
            lang: branding.defaultLanguage === 'bn' ? 'bn' : 'en',
            isInitialized: true,
          });
        } catch (error) {
          console.warn('[AppStore] Failed to fetch settings, using cache or defaults:', error);
          set({ isInitialized: true });
        }
      },

      initApp: async () => {
        await get().refreshSettings();
      },
    }),
    {
      name: 'vanguard-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
        lang: state.lang,
        settings: state.settings,
        maintenanceMode: state.maintenanceMode,
      }),
    }
  )
);
