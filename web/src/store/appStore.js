
import { create } from 'zustand';
import { setCookie, getCookie } from '@/utils/cookies';
import api from '@/lib/api';

const isClient = typeof window !== 'undefined';

const initialState = {
  user: null,
  isMounted: false,
  settings: null,
  theme: (isClient && getCookie("vanguard-theme-mode")) || "dark",
  themeColor: (isClient && getCookie("vanguard-theme-color")) || "Zinc",
  themeFont: (isClient && getCookie("vanguard-theme-font")) || "Inter",
  identityTheme: (isClient && getCookie("vanguard-identity-theme")) || "executive",
  lang: (isClient && getCookie("vanguard-lang")) || "en",
  isChatOpen: false,
  isAdminSidebarCollapsed: false,
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

  setSettings: (data, serverValues = {}) => {
    if (!data) return;
    const branding = data.branding || {};
    
    const defaultTheme = branding.defaultTheme || "dark";
    const defaultThemeColor = branding.defaultThemeColor || "Zinc";
    const defaultThemeFont = branding.defaultThemeFont || "Inter";
    const identityTheme = branding.activeTheme || "executive";
    const defaultLang = branding.defaultLanguage || "en";

    set({ 
      settings: data,
      theme: serverValues.theme || getCookie("vanguard-theme-mode") || defaultTheme, 
      themeColor: defaultThemeColor, // Priority: DB Settings (Identity)
      themeFont: defaultThemeFont,   // Priority: DB Settings (Identity)
      identityTheme: identityTheme,   // Priority: DB Settings (Identity)
      lang: serverValues.lang || getCookie("vanguard-lang") || defaultLang,
      isMounted: true 
    });

    // Sync cookies
    setCookie("vanguard-theme-mode", serverValues.theme || getCookie("vanguard-theme-mode") || defaultTheme);
    setCookie("vanguard-theme-color", defaultThemeColor);
    setCookie("vanguard-theme-font", defaultThemeFont);
    setCookie("vanguard-identity-theme", identityTheme);
    setCookie("vanguard-lang", serverValues.lang || getCookie("vanguard-lang") || defaultLang);
  },

  initApp: async () => {
    try {
      const { data } = await api.get("/settings");
      get().setSettings(data);
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

  toggleAdminSidebar: () => set((state) => ({ isAdminSidebarCollapsed: !state.isAdminSidebarCollapsed })),
  setAdminSidebarCollapsed: (isCollapsed) => set({ isAdminSidebarCollapsed: isCollapsed }),
}));