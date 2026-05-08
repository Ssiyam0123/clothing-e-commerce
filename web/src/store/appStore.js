
import { create } from 'zustand';
import { setCookie, getCookie } from '@/utils/cookies';
import api from '@/lib/api';

const isClient = typeof window !== 'undefined';

const initialState = {
  user: null,
  isMounted: false,
  theme: (isClient && getCookie("vanguard-theme-mode")) || "dark",
  themeColor: (isClient && getCookie("vanguard-theme-color")) || "Zinc",
  themeFont: (isClient && getCookie("vanguard-theme-font")) || "Inter",
  identityTheme: (isClient && getCookie("vanguard-identity-theme")) || "executive",
  lang: (isClient && getCookie("vanguard-lang")) || "en",
  isChatOpen: false,
};

export const useAppStore = create((set, get) => ({
  ...initialState,
  
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  
  setTheme: (theme) => {
    set({ theme });
    setCookie("vanguard-theme-mode", theme);
  },
  setThemeColor: (themeColor) => {
    set({ themeColor });
    setCookie("vanguard-theme-color", themeColor);
  },
  setThemeFont: (themeFont) => {
    set({ themeFont });
    setCookie("vanguard-theme-font", themeFont);
  },
  setIdentityTheme: (identityTheme) => {
    set({ identityTheme });
    setCookie("vanguard-identity-theme", identityTheme);
  },
  setLang: (lang) => {
    set({ lang });
    setCookie("vanguard-lang", lang);
  },

  initApp: async () => {
    try {
      const { data } = await api.get("/settings");
      const branding = data?.branding || {};
      
      const defaultTheme = branding.defaultTheme || "dark";
      const defaultThemeColor = branding.defaultThemeColor || "Zinc";
      const defaultThemeFont = branding.defaultThemeFont || "Inter";
      const identityTheme = branding.activeTheme || "executive";
      const defaultLang = branding.defaultLanguage || "en";

      set({ 
        theme: getCookie("vanguard-theme-mode") || defaultTheme, 
        themeColor: getCookie("vanguard-theme-color") || defaultThemeColor,
        themeFont: getCookie("vanguard-theme-font") || defaultThemeFont,
        identityTheme: getCookie("vanguard-identity-theme") || identityTheme,
        lang: getCookie("vanguard-lang") || defaultLang,
        isMounted: true 
      });

      // Sync if not already set
      if (!getCookie("vanguard-theme-mode")) setCookie("vanguard-theme-mode", defaultTheme);
      if (!getCookie("vanguard-theme-color")) setCookie("vanguard-theme-color", defaultThemeColor);
      if (!getCookie("vanguard-theme-font")) setCookie("vanguard-theme-font", defaultThemeFont);
      if (!getCookie("vanguard-identity-theme")) setCookie("vanguard-identity-theme", identityTheme);
      if (!getCookie("vanguard-lang")) setCookie("vanguard-lang", defaultLang);

    } catch (error) {
      console.error("Failed to initialize app settings:", error);
      set({ isMounted: true });
    }
  },

  setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  
  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    set({ theme: newTheme });
    setCookie("vanguard-theme-mode", newTheme);
  },
}));