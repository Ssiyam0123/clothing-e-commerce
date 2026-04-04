'use client';

import { useState, useEffect } from 'react';
import  useAuth  from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getImageUrl } from '@/utils/imageUtils';
import Sidebar from '@/components/admin/Sidebar';
import Loader from '@/components/common/Loader';
import { useAppStore } from '@/store/appStore';

export default function AdminLayout({ children }) {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global theme and language from Zustand
  const { theme, toggleTheme, lang, setLang, isMounted } = useAppStore();

  // Redirect non‑admins
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.replace('/');
    }
  }, [user, authLoading, router]);

  // Close sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Wait for auth and store hydration
  if (authLoading || !isMounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#050505]">
        <Loader />
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-[#050505] transition-colors duration-700 font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Command Bar */}
        <header className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 z-10 transition-colors">
          <div className="flex justify-between items-center px-4 md:px-8 py-4 md:py-5">
            {/* Left: hamburger button + status */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 text-zinc-900 dark:text-white bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <h1 className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.3em]">
                  System Online
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              {/* Live Store Link & Theme Toggle */}
              <div className="flex items-center gap-3 md:gap-5 border-r border-zinc-200 dark:border-zinc-800 pr-3 md:pr-6">
                <Link
                  href="/"
                  className="flex items-center gap-1 md:gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  title="Go to Live Store"
                >
                  <span className="text-sm grayscale opacity-80">🌍</span>
                  <span className="hidden sm:inline">Live Store</span>
                </Link>
                <button
                  onClick={toggleTheme}
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:scale-110 transition-all text-sm"
                  title="Toggle Theme"
                >
                  {isMounted ? (theme === 'dark' ? '☼' : '☾') : '...'}
                </button>
                {/* Optional: Language toggle if needed in admin */}
                {/* <button onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} className="text-[9px] font-black uppercase">
                  {lang === 'en' ? 'BN' : 'EN'}
                </button> */}
              </div>

              {/* User Profile */}
              <Link
                href="/profile"
                className="flex items-center gap-2 group px-2 py-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
              >
                {user?.avatar ? (
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 group-hover:scale-105 transition-transform">
                    <img
                      src={getImageUrl(user.avatar)}
                      alt={user.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0"
                    />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="text-xs font-black text-white dark:text-black">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-white leading-none">
                    {user?.name}
                  </p>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                    {user?.role}
                  </p>
                </div>
              </Link>

              <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800"></div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-rose-500 transition-colors"
              >
                Terminate
              </button>
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 no-scrollbar">
          <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}