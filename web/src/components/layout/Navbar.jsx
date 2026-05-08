"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, User, Menu, X, Sun, Moon, Sparkles, Heart, ChevronRight, Shield, LifeBuoy, LogOut } from "lucide-react";
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

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Flash Sale", href: "/flash-sale" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { theme, setTheme, lang } = useAppStore();
  const { cart, wishlistItems } = useProductStore();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cartCount = cart?.totalItems || 0;
  const wishlistCount = wishlistItems?.length || 0;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dynamicNavLinks = useMemo(() => {
    const links = [...NAV_LINKS];
    if (user?.role === 'admin') {
      links.push({ label: "Admin Panel", href: "/admin", isSpecial: true });
    }
    return links;
  }, [user]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 lg:px-12 py-4",
        scrolled ? "bg-background/95 backdrop-blur-3xl  border-border/10 py-3 shadow-xl shadow-black/5" : "bg-transparent"
      )}
    >
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="Vanguard Home">
          <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center text-background group-hover:rotate-[15deg] transition-transform duration-500 shadow-xl shadow-foreground/5">
             <Sparkles size={20} className="group-hover:scale-125 transition-transform" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic text-gradient hidden sm:block">
            Vanguard
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-10">
          {dynamicNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:text-accent-secondary relative group flex items-center gap-2",
                pathname === link.href ? "text-accent-secondary" : "text-foreground/70",
                link.isSpecial && "text-rose-500 hover:text-rose-600"
              )}
            >
              {link.isSpecial && <Shield size={12} className="animate-pulse" />}
              {link.label}
              <span className={cn(
                "absolute -bottom-2 left-0 h-0.5 bg-accent-secondary transition-all duration-500",
                pathname === link.href ? "w-full" : "w-0 group-hover:w-full",
                link.isSpecial && "bg-rose-500"
              )} />
            </Link>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 md:gap-5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 rounded-full hover:bg-accent/30"
          >
            {mounted ? (
              theme === "dark" ? <Sun size={18} /> : <Moon size={18} />
            ) : (
              <div className="w-[18px] h-[18px]" />
            )}
          </Button>

          <Link href="/products?search=open">
             <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-accent/30">
               <Search size={18} />
             </Button>
          </Link>

          <Link href="/wishlist" className="relative">
            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-accent/30">
              <Heart size={18} />
            </Button>
            {wishlistCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] bg-accent-secondary text-white border-none text-[8px] font-black rounded-full px-1">
                {wishlistCount}
              </Badge>
            )}
          </Link>

          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-accent/30">
              <ShoppingBag size={18} />
            </Button>
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] bg-accent-secondary text-white border-none text-[8px] font-black rounded-full px-1">
                {cartCount}
              </Badge>
            )}
          </Link>

          <div className="hidden md:block h-8 w-px bg-border/20 mx-2" />
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-accent/20">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={getImageUrl(user?.avatar)} alt={user?.name} />
                    <AvatarFallback className="bg-accent font-black text-[10px]">
                      {user?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 rounded-[2rem] p-4 bg-background/95 backdrop-blur-xl border-border/20 shadow-2xl mt-4 animate-in fade-in zoom-in-95 duration-300" align="end">
                <DropdownMenuLabel className="font-black text-[11px] uppercase tracking-[0.4em] text-muted-foreground px-6 py-4 opacity-50">
                  Tactical Identity
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/5 mx-2" />
                
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-4 rounded-2xl p-5 font-black text-[12px] uppercase tracking-widest cursor-pointer hover:bg-accent/50 group transition-all">
                    <User size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    Profile Identity
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/live-support" className="flex items-center gap-4 rounded-2xl p-5 font-black text-[12px] uppercase tracking-widest cursor-pointer text-blue-500 bg-blue-500/5 hover:bg-blue-500/10 group transition-all">
                    <LifeBuoy size={18} className="group-hover:rotate-45 transition-transform" />
                    Live Support
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-border/5 mx-2" />
                
                <DropdownMenuItem 
                  onClick={logout}
                  className="flex items-center gap-4 rounded-2xl p-5 font-black text-[12px] uppercase tracking-widest cursor-pointer text-rose-500 hover:bg-rose-500/10 focus:bg-rose-500/10 group transition-all"
                >
                  <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                  Terminate Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="hidden md:block">
              <Button size="sm" className="rounded-full bg-foreground text-background font-black text-[9px] uppercase tracking-widest px-6 h-10 hover:bg-accent-secondary hover:text-white transition-all shadow-xl shadow-foreground/5">
                Auth Initiate
              </Button>
            </Link>
          )}

          {/* MOBILE MENU */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden w-10 h-10 rounded-full hover:bg-accent/30 flex items-center justify-center border border-border/10">
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md bg-background/95 backdrop-blur-3xl border-l border-border/10 p-0 flex flex-col [&>button]:hidden">
              <SheetHeader className="text-left p-8 border-b border-border/5">
                 <SheetTitle className="text-lg font-black uppercase tracking-widest italic">Vanguard Menu</SheetTitle>
              </SheetHeader>
              
              <ScrollArea className="flex-1 p-8">
                <div className="flex flex-col gap-8">
                  <div className="space-y-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-6">Directory</p>
                    {dynamicNavLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "text-4xl font-black uppercase tracking-tighter hover:text-accent-secondary transition-colors italic block",
                          link.isSpecial ? "text-rose-500" : "text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="h-px w-full bg-border/5" />
                  
                  {isAuthenticated ? (
                    <div className="space-y-6">
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-6">Account Control</p>
                      <div className="grid grid-cols-1 gap-4">
                        <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold uppercase tracking-tight flex items-center justify-between group">
                          Profile Identity
                          <ChevronRight size={18} />
                        </Link>
                        <Link href="/live-support" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold uppercase tracking-tight flex items-center justify-between text-blue-500 group">
                          Live Support
                          <ChevronRight size={18} />
                        </Link>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        onClick={() => { logout(); setIsMenuOpen(false); }}
                        className="w-full h-14 rounded-2xl border border-rose-500/20 text-rose-500 font-black uppercase tracking-widest text-[10px] hover:bg-rose-500 hover:text-white transition-all mt-8"
                      >
                        Terminate Session
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                       <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-6">Authorization</p>
                       <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full h-16 rounded-[2rem] bg-foreground text-background font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-accent-secondary hover:text-white transition-all">
                          Initialize Login
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-8 border-t border-border/5 bg-accent/5">
                 <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground text-center">
                   Vanguard Core Protocol v4.2.0
                 </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
