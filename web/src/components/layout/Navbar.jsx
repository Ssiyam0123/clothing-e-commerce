'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, Menu, X, Sun, Moon, Languages, User, LogOut, LayoutDashboard } from 'lucide-react';

// Hooks & Stores
import useAuth from '@/hooks/useAuth';
import { useAppStore } from '@/store/appStore';
import { useProductCondition } from '@/store/productCondition';
import { getImageUrl } from '@/utils/imageUtils';

const NAV_LINKS = [
  { id: 'home', href: '/', en: 'Home', bn: 'হোম' },
  { id: 'shop', href: '/products', en: 'Collection', bn: 'কালেকশন' },
  { id: 'sale', href: '/flash-sale', en: 'Flash Sale', bn: 'ফ্ল্যাশ ডিল' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isLoading: authLoading } = useAuth();
  const { theme, toggleTheme, lang, setLang } = useAppStore();
  
  const cartTotalItems = useProductCondition((state) => state.cart.totalItems);
  const wishlistCount = useProductCondition((state) => state.wishlistItems.length);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  // Toggle dropdown on click for mobile/touch devices
  const handleProfileClick = (e) => {
    if (window.innerWidth < 1024) {
      e.preventDefault();
      setIsProfileDropdownOpen((prev) => !prev);
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    router.push('/');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <>
      <motion.nav 
        className={`fixed top-0 left-0 right-0 w-full z-[999] transition-all duration-500 ${
          isScrolled || isSearchOpen
            ? 'bg-white/70 dark:bg-black/70 backdrop-blur-2xl dark:border-white/10 py-4 shadow-lg' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-4 md:px-10 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
              <span className="text-white dark:text-black font-black italic text-sm">V</span>
            </div>
            <span className="text-xl font-black tracking-tighter uppercase dark:text-white hidden md:block">VANGUARD</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.id} href={link.href} 
                  className={`relative text-[11px] font-black uppercase tracking-[0.25em] transition-colors ${
                    isActive ? 'text-rose-600' : 'text-zinc-500 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {link[lang]}
                  {isActive && (
                    <motion.div layoutId="navUnderline" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-rose-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 dark:text-white"><Search size={18} /></button>
            
            <Link href="/wishlist" className="relative p-2 dark:text-white">
              <Heart size={18} fill={wishlistCount > 0 ? "#e11d48" : "none"} className={wishlistCount > 0 ? 'text-rose-600' : ''} />
            </Link>

            <Link href="/cart" className="relative p-2 dark:text-white">
              <ShoppingBag size={18} />
              {cartTotalItems > 0 && (
                <span className="absolute -top-0 -right-0 bg-rose-600 text-white text-[7px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-black">
                  {cartTotalItems}
                </span>
              )}
            </Link>

            <button onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} className="hidden lg:block text-[9px] font-black uppercase dark:text-white bg-zinc-100 dark:bg-white/10 px-3 py-1.5 rounded-md hover:bg-rose-600 hover:text-white transition-all">
              {lang === 'en' ? 'BN' : 'EN'}
            </button>

            <button onClick={toggleTheme} className="p-2 dark:text-white hidden sm:block">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Profile Section with Dropdown */}
            <div className="hidden sm:block relative" ref={dropdownRef}>
              {authLoading ? (
                <div className="w-9 h-9 rounded-full bg-zinc-200 animate-pulse" />
              ) : user ? (
                <div
                  className="relative cursor-pointer"
                  onMouseEnter={() => setIsProfileDropdownOpen(true)}
                  onMouseLeave={() => setIsProfileDropdownOpen(false)}
                  onClick={handleProfileClick}
                >
                  <div className="w-9 h-9 rounded-full border-2 border-zinc-200 dark:border-white/20 overflow-hidden">
                    <img
                      src={getImageUrl(user.avatar)}
                      className="w-full h-full object-cover"
                      alt={user.name}
                    />
                  </div>
                  
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden z-50"
                      >
                        <div className="py-2">
                          <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                            <p className="text-xs font-black text-zinc-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
                          </div>
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <User size={14} />
                            Profile
                          </Link>
                          {isAdmin && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <LayoutDashboard size={14} />
                              Dashboard
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors border-t border-zinc-100 dark:border-zinc-800 mt-1"
                          >
                            <LogOut size={14} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-[9px] font-black uppercase tracking-widest px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full transition-all hover:scale-105"
                >
                  JOIN
                </Link>
              )}
            </div>

            {/* Mobile Trigger */}
            <button className="p-2 lg:hidden dark:text-white" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 w-full bg-white dark:bg-black p-6 border-b dark:border-white/10 shadow-2xl"
            >
              <form onSubmit={handleSearchSubmit} className="max-w-4xl mx-auto">
                <input 
                  autoFocus type="text" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH VANGUARD..."
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl py-5 px-8 text-sm font-black tracking-widest focus:ring-2 focus:ring-rose-600 outline-none dark:text-white"
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[9999] lg:hidden"> 
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsSidebarOpen(false)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-[85%] bg-white dark:bg-black flex flex-col p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 dark:text-zinc-600">Menu</span>
                <button onClick={() => setIsSidebarOpen(false)} className="text-black dark:text-white p-2">
                  <X size={28} />
                </button>
              </div>

              <nav className="space-y-6 flex-1">
                {NAV_LINKS.map(link => (
                  <Link 
                    key={link.id} href={link.href} onClick={() => setIsSidebarOpen(false)} 
                    className={`block text-5xl font-black uppercase tracking-tighter ${
                      pathname === link.href ? 'text-rose-600' : 'text-black dark:text-white'
                    }`}
                  >
                    {link[lang]}
                  </Link>
                ))}
                <Link href="/profile" onClick={() => setIsSidebarOpen(false)} className="block text-5xl font-black uppercase tracking-tighter text-zinc-300 dark:text-zinc-700">
                  PROFILE
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setIsSidebarOpen(false)} className="block text-5xl font-black uppercase tracking-tighter text-zinc-300 dark:text-zinc-700">
                    DASHBOARD
                  </Link>
                )}
              </nav>

              <div className="pt-8 border-t border-zinc-100 dark:border-white/10 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} className="py-4 bg-zinc-50 dark:bg-white/10 rounded-2xl text-[9px] font-black uppercase text-black dark:text-white">
                    {lang === 'en' ? 'বাংলা' : 'English'}
                  </button>
                  <button onClick={() => {toggleTheme(); setIsSidebarOpen(false);}} className="py-4 bg-zinc-50 dark:bg-white/10 rounded-2xl text-[9px] font-black uppercase text-black dark:text-white flex items-center justify-center gap-2">
                    {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />} {theme.toUpperCase()}
                  </button>
                </div>
                {user ? (
                  <button onClick={() => { logout(); setIsSidebarOpen(false); }} className="w-full py-5 text-rose-600 text-[10px] font-black uppercase tracking-widest border border-rose-600/20 rounded-2xl">
                    LOGOUT
                  </button>
                ) : (
                  <Link href="/login" onClick={() => setIsSidebarOpen(false)} className="block w-full py-5 text-center bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase rounded-2xl">
                    JOIN THE SYNDICATE
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}