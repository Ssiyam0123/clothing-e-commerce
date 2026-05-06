import { create } from 'zustand';

export const useAppStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  theme: 'dark',
  lang: 'en',
  isMounted: false,

  initApp: () => {
    const savedTheme = localStorage.getItem('ecowear-theme') || 'dark';
    const savedLang = localStorage.getItem('ecowear-lang') || 'en';
    
    document.documentElement.className = savedTheme;
    document.documentElement.lang = savedLang;
    
    set({ theme: savedTheme, lang: savedLang, isMounted: true });
  },

  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('ecowear-theme', newTheme);
    document.documentElement.className = newTheme;
    return { theme: newTheme };
  }),

  setLang: (newLang) => set(() => {
    localStorage.setItem('ecowear-lang', newLang);
    document.documentElement.lang = newLang;
    return { lang: newLang };
  }),

  isChatOpen: false,
  setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen }))
}));