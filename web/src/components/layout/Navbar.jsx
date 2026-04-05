'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, Menu, X, Sun, Moon, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';

// Hooks & Stores
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { useProductStore } from '@/store/productStore';
import { getImageUrl } from '@/utils/imageUtils';

const NAV_LINKS = [
  { id: 'home', href: '/', en: 'Home', bn: 'হোম' },
  { id: 'shop', href: '/products', en: 'Collection', bn: 'কালেকশন' },
  { id: 'sale', href: '/flash-sale', en: 'Flash Sale', bn: 'ফ্ল্যাশ ডিল' },
  { id: 'blogs', href: '/blog', en: 'Blog', bn: 'ব্লগ' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Stores
  const { user, logout, isAuthenticated, isLoading } = useAuthStore();
  const { theme, toggleTheme, lang, setLang } = useAppStore();

  const cartTotalItems = useProductStore((state) => state.cart.totalItems);
  const wishlistCount = useProductStore((state) => state.wishlistItems.length);

  // Local state
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

  // Close dropdown on outside click
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
      setSearchQuery('');
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
      <nav
        className={`fixed top-0 left-0 right-0 w-full z-[999] transition-all duration-500 ${
          isScrolled || isSearchOpen
            ? 'bg-white/80 dark:bg-black/80 backdrop-blur-2xl py-4 shadow-lg'
            : 'bg-transparent py-6'
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-[1800px] mx-auto px-4 md:px-10 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label="Vanguard home">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
              <span className="text-white dark:text-black font-black italic text-sm">V</span>
            </div>
            <span className="text-xl font-black tracking-tighter uppercase dark:text-white hidden md:block">
              VANGUARD
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`relative text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:tracking-[0.4em] ${
                    isActive ? 'text-rose-600' : 'text-zinc-500 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {link[lang]}
                  {isActive && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute -bottom-2 left-0 right-0 h-[2px] bg-rose-600 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
              aria-label={isSearchOpen ? 'Close search' : 'Open search'}
            >
              <Search size={18} />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2.5 text-zinc-500 hover:text-rose-500 transition-colors"
              aria-label="Wishlist"
            >
              <Heart
                size={18}
                fill={wishlistCount > 0 ? '#e11d48' : 'none'}
                className={wishlistCount > 0 ? 'text-rose-600' : ''}
              />
              {wishlistCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full border-2 border-white dark:border-black"
                  aria-hidden="true"
                />
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={18} />
              {cartTotalItems > 0 && (
                <span className="absolute top-0 right-0 bg-rose-600 text-white text-[7px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-black shadow-lg">
                  {cartTotalItems}
                </span>
              )}
            </Link>

            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2 hidden sm:block" aria-hidden="true" />

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="hidden lg:block text-[9px] font-black uppercase text-zinc-500 hover:text-rose-600 px-2 transition-all"
              aria-label={`Switch to ${lang === 'en' ? 'Bengali' : 'English'}`}
            >
              {lang === 'en' ? 'BN' : 'EN'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-zinc-500 hover:text-black dark:hover:text-white transition-colors hidden sm:block"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Profile Section */}
            <div className="relative ml-2" ref={dropdownRef}>
              {isLoading ? (
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 animate-pulse border border-zinc-200 dark:border-zinc-800" aria-label="Loading user" />
              ) : isAuthenticated ? (
                <div
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  aria-expanded={isProfileDropdownOpen}
                  aria-label="User menu"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-zinc-200 dark:border-white/10 overflow-hidden shadow-sm group-hover:border-rose-500/50 transition-all">
                    {user?.avatar ? (
                      <img src={getImageUrl(user.avatar)} className="w-full h-full object-cover" alt={user.name} />
                    ) : (
                      <div className="w-full h-full bg-zinc-900 dark:bg-white flex items-center justify-center font-black text-white dark:text-black text-xs">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-transform duration-300 ${
                      isProfileDropdownOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-4 w-64 bg-white/95 dark:bg-black/95 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden z-50 p-2"
                        role="menu"
                      >
                        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 mb-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-1">
                            {isAdmin ? 'Administrator' : 'Syndicate Member'}
                          </p>
                          <p className="text-sm font-black text-zinc-900 dark:text-white truncate uppercase tracking-tighter">
                            {user.name}
                          </p>
                        </div>

                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-5 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-2xl transition-all"
                          role="menuitem"
                        >
                          <User size={14} aria-hidden="true" /> Identity Details
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-5 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-2xl transition-all"
                            role="menuitem"
                          >
                            <LayoutDashboard size={14} aria-hidden="true" /> Control Center
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl transition-all border-t border-zinc-100 dark:border-zinc-800 mt-2"
                          role="menuitem"
                        >
                          <LogOut size={14} aria-hidden="true" /> Terminate Session
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-[9px] font-black uppercase tracking-[0.2em] px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg"
                  aria-label="Login or join"
                >
                  Join
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="p-2 lg:hidden dark:text-white ml-2"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-white/90 dark:bg-black/90 backdrop-blur-3xl p-6 border-b dark:border-white/10 shadow-2xl"
            >
              <form onSubmit={handleSearchSubmit} className="max-w-5xl mx-auto relative">
                <label htmlFor="search-input" className="sr-only">
                  Search artifacts
                </label>
                <input
                  id="search-input"
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="IDENTIFY ARTIFACT..."
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-[1.5rem] py-6 px-10 text-sm font-black tracking-[0.3em] focus:ring-2 focus:ring-rose-600 outline-none dark:text-white uppercase placeholder:text-zinc-400"
                />
                <button
                  type="submit"
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black dark:hover:text-white"
                  aria-label="Submit search"
                >
                  <Search size={22} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[9999] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              aria-hidden="true"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-[85%] bg-white dark:bg-[#050505] flex flex-col p-8 shadow-2xl"
              role="dialog"
              aria-label="Mobile navigation menu"
            >
              <div className="flex justify-between items-center mb-16">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Navigation</span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 bg-zinc-100 dark:bg-white/5 rounded-full dark:text-white"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="space-y-8 flex-1" aria-label="Mobile navigation">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`block text-5xl font-black uppercase tracking-tighter italic transition-all ${
                      pathname === link.href
                        ? 'text-rose-600 scale-105 ml-2'
                        : 'text-black dark:text-white opacity-40'
                    }`}
                  >
                    {link[lang]}
                  </Link>
                ))}
                {isAuthenticated && (
                  <Link
                    href="/profile"
                    onClick={() => setIsSidebarOpen(false)}
                    className="block text-5xl font-black uppercase tracking-tighter italic text-zinc-300 dark:text-zinc-700 hover:text-white transition-colors"
                  >
                    PROFILE
                  </Link>
                )}
              </nav>

              <div className="pt-10 border-t border-zinc-100 dark:border-white/5 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                    className="py-4 bg-zinc-50 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400"
                    aria-label={`Switch to ${lang === 'en' ? 'Bengali' : 'English'}`}
                  >
                    {lang === 'en' ? 'বাংলা' : 'English'}
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="py-4 bg-zinc-50 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 flex items-center justify-center gap-2"
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                  >
                    {theme === 'dark' ? <Sun size={14} aria-hidden="true" /> : <Moon size={14} aria-hidden="true" />}{' '}
                    {theme}
                  </button>
                </div>
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full py-6 text-rose-600 text-[10px] font-black uppercase tracking-[0.3em] bg-rose-50 dark:bg-rose-950/20 rounded-[1.5rem] shadow-sm"
                  >
                    TERMINATE SESSION
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsSidebarOpen(false)}
                    className="block w-full py-6 text-center bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-[1.5rem] shadow-xl"
                  >
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