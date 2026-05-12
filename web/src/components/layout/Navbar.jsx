
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { Search, ShoppingBag, User, Menu, X, Sun, Moon, Sparkles, Heart, ChevronRight, Shield, LifeBuoy, LogOut, Languages } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import { useProductStore } from "@/store/productStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/utils/imageUtils";
import { getTranslation } from "@/utils/typography/handler";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, logout, isAuthenticated } = useAuthStore();
  const { theme, setTheme, lang, setLang, settings } = useAppStore();
  const branding = settings?.branding || {};
  const { cart, wishlistItems } = useProductStore();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const t = useMemo(() => getTranslation('navbar', lang), [lang]);

  const cartCount = cart?.totalItems || 0;
  const wishlistCount = wishlistItems?.length || 0;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dynamicNavLinks = useMemo(() => {
    const links = [
      { label: "Home", key: "home", href: "/" },
      { label: "Categories", key: "categories", href: "/categories" },
      { label: "Products", key: "products", href: "/products" },
      { label: "Flash Sale", key: "flashSale", href: "/flash-sale" },
      { label: "Blog", key: "blog", href: "/blog" },
    ];
    if (
      user?.role?.name === 'superadmin' || 
      user?.role?.permissions?.includes('all') || 
      user?.role?.permissions?.includes('dashboard:view') ||
      user?.role?.permissions?.includes('reports:view')
    ) {
      links.push({ label: "Admin", key: "admin", href: "/admin", isSpecial: true });
    }
    return links;
  }, [user, t]);

  if (pathname.startsWith("/admin")) return null;

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'bn' : 'en';
    setLang(newLang);
    router.refresh();
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  const isHome = pathname === "/" || pathname === "/en" || pathname === "/bn";
  const isBlogDetails = pathname.startsWith("/blog/") && pathname !== "/blog";
  const isTransparentPage = false; // Always solid now as content is offset below navbar

  return (
    <header
      className={cn(
        "sticky top-0 left-0 right-0 z-[120] px-4 sm:px-6 lg:px-12 py-4 transition-all duration-300",
        (scrolled || !isTransparentPage) ? "bg-background/95 backdrop-blur-3xl border-b border-border/10 py-3 shadow-xl shadow-black/5" : "bg-transparent"
      )}
    >
      <div className="w-full mx-auto flex items-center justify-between gap-2">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0" aria-label={branding.siteName || "Home"}>
          {branding.logo || branding.logoDark ? (
            <img 
              src={getImageUrl(theme === 'dark' ? (branding.logoDark || branding.logo) : (branding.logo || branding.logoDark))} 
              alt={branding.siteName || "Logo"} 
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105 duration-500" 
            />
          ) : (
            <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center text-background group-hover:rotate-[15deg] transition-transform duration-500 shadow-xl shadow-foreground/5">
               <Sparkles size={20} className="group-hover:scale-125 transition-transform" />
            </div>
          )}
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {dynamicNavLinks.map((link) => {
            const label = mounted ? (t[link.key] || link.label) : link.label;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[11px] font-black uppercase tracking-[0.4em] transition-all hover:text-accent-secondary relative group flex items-center gap-2 whitespace-nowrap",
                  pathname === link.href ? "text-accent-secondary" : "text-foreground",
                  link.isSpecial && "text-accent-secondary hover:brightness-125"
                )}
              >
                {link.isSpecial && <Shield size={12} className="animate-pulse" />}
                {label}
                <span className={cn(
                  "absolute -bottom-2 left-0 h-0.5 bg-accent-secondary transition-all duration-500",
                  pathname === link.href ? "w-full" : "w-0 group-hover:w-full",
                  link.isSpecial && "bg-accent-secondary"
                )} />
              </Link>
            );
          })}
        </nav>

        {/* ACTIONS - Mobile optimized with no fixed widths */}
        <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-3 flex-nowrap">
          {/* Language Toggle - text hidden on mobile to save space */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="hidden md:inline-flex w-10 h-10 rounded-full hover:bg-accent/30 gap-1"
            aria-label="Toggle Language"
          >
            <Languages size={16} className="sm:size-[18px]" />
            <span className="text-[9px] font-black uppercase tracking-tighter hidden sm:inline-block">
              {mounted ? lang.toUpperCase() : "EN"}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            className="hidden md:inline-flex w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-accent/30 flex-shrink-0"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {mounted ? (
              theme === "dark" ? <Sun size={16} className="sm:size-[18px]" /> : <Moon size={16} className="sm:size-[18px]" />
            ) : (
              <div className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />
            )}
          </Button>

          <Link href="/products" className="hidden md:inline-flex flex-shrink-0">
             <Button variant="ghost" size="icon" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-accent/30" aria-label="Search">
               <Search size={16} className="sm:size-[18px]" />
             </Button>
          </Link>

          <Link href="/wishlist" className="hidden md:inline-flex relative flex-shrink-0">
            <Button variant="ghost" size="icon" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-accent/30" aria-label="Wishlist">
              <Heart size={16} className="sm:size-[18px]" />
            </Button>
            {wishlistCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 min-w-[16px] bg-accent-secondary text-white border-none text-[7px] font-black rounded-full px-1 flex items-center justify-center">
                {wishlistCount}
              </Badge>
            )}
          </Link>

          <Link href="/cart" className="hidden md:inline-flex relative flex-shrink-0">
            <Button variant="ghost" size="icon" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-accent/30" aria-label="Shopping Cart">
              <ShoppingBag size={16} className="sm:size-[18px]" />
            </Button>
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 min-w-[16px] bg-accent-secondary text-white border-none text-[7px] font-black rounded-full px-1 flex items-center justify-center">
                {cartCount}
              </Badge>
            )}
          </Link>

          <div className="hidden lg:block h-6 w-px bg-border/20 mx-1" />
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:inline-flex relative h-9 w-9 sm:h-10 sm:w-10 rounded-full p-0 overflow-hidden border-2 border-accent/20 flex-shrink-0">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={getImageUrl(user?.avatar)} alt={user?.name} />
                    <AvatarFallback className="bg-accent font-black text-[10px]">
                      {user?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 rounded-[2rem] p-3 bg-background/95 backdrop-blur-xl border-border/20 shadow-2xl mt-4 animate-in fade-in zoom-in-95 duration-300" align="end">
                <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-[0.4em] text-muted-foreground px-5 py-3 opacity-50">
                  {mounted ? t.tacticalIdentity : "TACTICAL IDENTITY"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/5 mx-2" />
                
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-3 rounded-2xl p-4 font-black text-[11px] uppercase tracking-widest cursor-pointer hover:bg-accent/50 group transition-all">
                    <User size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    {mounted ? t.profile : "Profile"}
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/live-support" className="flex items-center gap-3 rounded-2xl p-4 font-black text-[11px] uppercase tracking-widest cursor-pointer text-blue-500 bg-blue-500/5 hover:bg-blue-500/10 group transition-all">
                    <LifeBuoy size={16} className="group-hover:rotate-45 transition-transform" />
                    {mounted ? t.liveSupport : "Support"}
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-border/5 mx-2" />
                
                <DropdownMenuItem 
                  onClick={logout}
                  className="flex items-center gap-3 rounded-2xl p-4 font-black text-[11px] uppercase tracking-widest cursor-pointer text-accent-secondary hover:bg-accent-secondary/10 focus:bg-accent-secondary/10 group transition-all"
                >
                  <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                  {mounted ? t.logout : "LOGOUT"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="hidden md:block flex-shrink-0">
              <Button size="sm" className="rounded-full bg-foreground text-background font-black text-[8px] uppercase tracking-widest px-4 h-8 sm:px-5 sm:h-9 hover:bg-accent-secondary hover:text-white transition-all shadow-xl shadow-foreground/5">
                {mounted ? t.login : "Login"}
              </Button>
            </Link>
          )}

          {/* MOBILE MENU - Full width, no fixed max width */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button 
                className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-accent/30 flex items-center justify-center border border-border/10 ml-1 flex-shrink-0 text-foreground"
                aria-label="Toggle Mobile Menu"
              >
                <Menu size={18} className="text-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full border-r border-border/10 p-0 flex flex-col bg-background/95 backdrop-blur-3xl">
              <SheetHeader className="text-left p-6 border-b border-border/5">
                 <SheetTitle className="text-base font-black uppercase tracking-widest italic">{mounted ? t.menuTitle : "MENU"}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-wrap items-center gap-2 px-6 py-4 border-b border-border/5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleLanguage}
                  className="w-10 h-10 rounded-full hover:bg-accent/30"
                  aria-label="Toggle Language"
                >
                  <Languages size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleThemeToggle}
                  className="w-10 h-10 rounded-full hover:bg-accent/30"
                  aria-label="Toggle Theme"
                >
                  {mounted ? (
                    theme === "dark" ? <Sun size={18} /> : <Moon size={18} />
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                </Button>
                <Link href="/products" className="inline-flex">
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-accent/30" aria-label="Search">
                    <Search size={18} />
                  </Button>
                </Link>
                <Link href="/wishlist" className="relative inline-flex">
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-accent/30" aria-label="Wishlist">
                    <Heart size={18} />
                  </Button>
                  {wishlistCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 min-w-[16px] bg-accent-secondary text-white border-none text-[7px] font-black rounded-full px-1 flex items-center justify-center">
                      {wishlistCount}
                    </Badge>
                  )}
                </Link>
                <Link href="/cart" className="relative inline-flex">
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-accent/30" aria-label="Cart">
                    <ShoppingBag size={18} />
                  </Button>
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 min-w-[16px] bg-accent-secondary text-white border-none text-[7px] font-black rounded-full px-1 flex items-center justify-center">
                      {cartCount}
                    </Badge>
                  )}
                </Link>
              </div>
              
              <ScrollArea className="flex-1 p-6">
                <div className="flex flex-col gap-8">
                  <div className="space-y-4">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-4">{mounted ? t.directory : "DIRECTORY"}</p>
                    <div className="space-y-3">
                      {dynamicNavLinks.map((link) => {
                        const label = mounted ? (t[link.key] || link.label) : link.label;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={cn(
                              "text-2xl sm:text-3xl font-black uppercase tracking-tighter hover:text-accent-secondary transition-colors italic block break-words",
                              link.isSpecial ? "text-accent-secondary" : "text-foreground"
                            )}
                          >
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-border/5" />
                  
                  {isAuthenticated ? (
                    <div className="space-y-6">
                      <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-4">{mounted ? t.accountControl : "ACCOUNT"}</p>
                      <div className="grid grid-cols-1 gap-4">
                        <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold uppercase tracking-tight flex items-center justify-between group">
                          {mounted ? t.profile : "Profile"}
                          <ChevronRight size={16} />
                        </Link>
                        <Link href="/live-support" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold uppercase tracking-tight flex items-center justify-between text-blue-500 group">
                          {mounted ? t.liveSupport : "Support"}
                          <ChevronRight size={16} />
                        </Link>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        onClick={() => { logout(); setIsMenuOpen(false); }}
                        className="w-full h-12 rounded-2xl border border-accent-secondary/20 text-accent-secondary font-black uppercase tracking-widest text-[9px] hover:bg-accent-secondary hover:text-white transition-all mt-4"
                      >
                        {mounted ? t.logout : "LOGOUT"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                       <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-4">{mounted ? t.authorization : "AUTH"}</p>
                       <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full h-14 rounded-[2rem] bg-foreground text-background font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-accent-secondary hover:text-white transition-all">
                          {mounted ? t.initLogin : "Login"}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-6 border-t border-border/5 bg-accent/5">
                 <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground text-center">
                   {t.version}
                 </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}