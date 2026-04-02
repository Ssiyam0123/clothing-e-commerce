'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAppStore } from '@/store/appStore';
import { getImageUrl } from '@/utils/imageUtils';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import { useTrackingStore } from '@/store/trackingStore';

const NAV_LINKS = [
  { id: 'home', href: '/', en: 'Home', bn: 'হোম' },
  { id: 'shop', href: '/products', en: 'Collection', bn: 'কালেকশন' },
  { id: 'sale', href: '/flash-sale', en: 'Flash Sale', bn: 'ফ্ল্যাশ ডিল', isSpecial: true },
];

const DICTIONARY = {
  en: { 
    join: 'Join', logout: 'Logout', menu: 'Menu', dashboard: 'Dashboard', 
    profile: 'Profile', account: 'Account'
  },
  bn: { 
    join: 'লগইন', logout: 'লগআউট', menu: 'মেনু', dashboard: 'ড্যাশবোর্ড', 
    profile: 'প্রোফাইল', account: 'অ্যাকাউন্ট'
  }
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isLoading: authLoading } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { theme, toggleTheme, lang, setLang, isMounted } = useAppStore();
  const trackSearch = useTrackingStore((state) => state.trackSearch);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const isHeroRoute = pathname === '/' || pathname === '/flash-sale';

  useEffect(() => {
    const handleScroll = () => {
      const threshold = isHeroRoute ? window.innerHeight * 0.7 : 20;
      setIsScrolled(window.scrollY > threshold);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHeroRoute]);

  const ui = useMemo(() => DICTIONARY[lang], [lang]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      trackSearch(searchQuery.trim(), {
        ...(user?.email && { email: user.email }),
        ...(user?.phone && { phone: user.phone })
      });
      setIsSearchOpen(false);
      setIsSidebarOpen(false);
    }
  };

  return (
    <motion.nav 
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        isScrolled || isSearchOpen
          ? 'bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 shadow-sm' 
          : 'bg-white dark:bg-black md:bg-transparent md:border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 md:h-24 flex justify-between items-center">
        
        {/* 1. Logo Section */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-full bg-black dark:bg-white flex items-center justify-center">
            <span className="text-white dark:text-black font-black italic text-xs">V</span>
          </div>
          <span className="text-lg font-black tracking-tighter uppercase dark:text-white hidden sm:block">VANGUARD</span>
        </Link>

        {/* 2. Desktop Nav (Centered) */}
        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map(link => (
            <Link key={link.id} href={link.href} className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
              {link[lang]}
            </Link>
          ))}
        </div>

        {/* 3. Actions Section */}
        <div className="flex items-center gap-1 sm:gap-4 shrink-0">
          
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-xl dark:text-white opacity-80">🔍</button>

          <div className="hidden sm:flex items-center gap-4">
             <Link href="/wishlist" className="p-2 relative">
                <span className="text-xl dark:text-white">🤍</span>
                {wishlist?.products?.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />}
             </Link>
             
             {/* Profile Hover Dropdown */}
             {authLoading ? (
               <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
             ) : user ? (
               <div className="relative group">
                 <div className="w-9 h-9 rounded-full border-2 border-zinc-200 dark:border-zinc-800 overflow-hidden cursor-pointer">
                   <img src={getImageUrl(user.avatar)} className="w-full h-full object-cover" alt="avatar" />
                 </div>
                 {/* Desktop Dropdown */}
                 <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="w-48 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-2">
                       {user.role === 'admin' && (
                         <Link href="/admin" className="block px-4 py-3 text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl">{ui.dashboard}</Link>
                       )}
                       <button onClick={() => logout()} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl">{ui.logout}</button>
                       <Link href="/profile" className="block px-4 py-3 text-[10px] font-black uppercase tracking-widest border-t border-zinc-100 dark:border-zinc-900 mt-1 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl dark:text-white">{ui.profile}</Link>
                    </div>
                 </div>
               </div>
             ) : (
               <Link href="/login" className="text-[10px] font-black uppercase tracking-widest px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full">
                 {ui.join}
               </Link>
             )}
          </div>

          <Link href="/cart" className="relative p-2">
            <span className="text-xl dark:text-white">👜</span>
            {cart?.totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-black dark:bg-white text-white dark:text-black text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cart.totalItems}
              </span>
            )}
          </Link>

          {/* Hamburger (Mobile) */}
          <button className="p-2 lg:hidden dark:text-white" onClick={() => setIsSidebarOpen(true)}>
            <span className="text-2xl">☰</span>
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 p-4 shadow-xl"
          >
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto relative">
              <input 
                autoFocus type="text" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl py-4 px-6 text-sm font-bold dark:text-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar (Solid B&W) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[150]"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[85%] bg-white dark:bg-black z-[200] flex flex-col shadow-2xl"
            >
              <div className="p-6 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-900">
                <span className="text-xs font-black uppercase tracking-widest dark:text-white">Navigate</span>
                <button onClick={() => setIsSidebarOpen(false)} className="text-2xl dark:text-white">✕</button>
              </div>

              {/* Sidebar Profile */}
              <div className="p-6 border-b border-zinc-50 dark:border-zinc-900">
                {user ? (
                  <Link href="/profile" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
                    <img src={getImageUrl(user.avatar)} className="w-10 h-10 rounded-full object-cover" alt="user" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{ui.account}</p>
                      <p className="text-sm font-black dark:text-white truncate">{user.name}</p>
                    </div>
                  </Link>
                ) : (
                  <Link href="/login" onClick={() => setIsSidebarOpen(false)} className="block w-full py-4 text-center bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest rounded-xl">
                    {ui.join}
                  </Link>
                )}
              </div>

              {/* Sidebar Links */}
              <nav className="flex-1 px-6 py-4 space-y-1 overflow-y-auto">
                {NAV_LINKS.map(link => (
                  <Link 
                    key={link.id} href={link.href} onClick={() => setIsSidebarOpen(false)}
                    className="block py-4 text-3xl font-black uppercase tracking-tighter border-b border-zinc-50 dark:border-zinc-900 text-black dark:text-white"
                  >
                    {link[lang]}
                  </Link>
                ))}
                {user && (
                  <Link href="/profile" onClick={() => setIsSidebarOpen(false)} className="block py-4 text-3xl font-black uppercase tracking-tighter text-zinc-400 dark:text-zinc-600">
                    {ui.profile}
                  </Link>
                )}
              </nav>

              {/* Sidebar Footer */}
              <div className="p-6 space-y-4 border-t border-zinc-100 dark:border-zinc-900">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} className="py-3 bg-zinc-100 dark:bg-zinc-900 text-[10px] font-black uppercase dark:text-white rounded-xl">
                    {lang === 'en' ? 'বাংলা' : 'English'}
                  </button>
                  <button onClick={toggleTheme} className="py-3 bg-zinc-100 dark:bg-zinc-900 text-[10px] font-black uppercase dark:text-white rounded-xl">
                    {theme === 'dark' ? 'Light' : 'Dark'} Mode
                  </button>
                </div>
                {user && (
                  <button onClick={() => { logout(); setIsSidebarOpen(false); }} className="w-full py-3 text-rose-500 text-[10px] font-black uppercase tracking-widest">
                    {ui.logout}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}