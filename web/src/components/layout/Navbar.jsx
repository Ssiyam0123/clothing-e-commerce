"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, User, Menu, X, Sun, Moon, Sparkles, Heart } from "lucide-react";
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

  const cartCount = cart?.totalItems || 0;
  const wishlistCount = wishlistItems?.length || 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 lg:px-12 py-4",
        scrolled ? "bg-background/80 backdrop-blur-2xl  border-border/10 py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center text-background group-hover:rotate-[15deg] transition-transform duration-500 shadow-xl shadow-foreground/5">
             <Sparkles size={20} className="group-hover:scale-125 transition-transform" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic text-gradient hidden sm:block">
            Vanguard
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:text-accent-secondary relative group",
                pathname === link.href ? "text-accent-secondary" : "text-foreground/70"
              )}
            >
              {link.label}
              <span className={cn(
                "absolute -bottom-2 left-0 h-0.5 bg-accent-secondary transition-all duration-500",
                pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
              )} />
            </Link>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 md:gap-5">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 rounded-full hover:bg-accent/30"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {/* Search Trigger */}
          <Link href="/products?search=open">
             <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-accent/30">
               <Search size={18} />
             </Button>
          </Link>

          {/* Wishlist */}
          <Link href="/wishlist" className="relative">
            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-accent/30">
              <Heart size={18} />
            </Button>
            {wishlistCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center bg-accent-secondary text-white border-none text-[8px] font-black rounded-full px-1 animate-in zoom-in duration-300">
                {wishlistCount}
              </Badge>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-accent/30">
              <ShoppingBag size={18} />
            </Button>
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center bg-accent-secondary text-white border-none text-[8px] font-black rounded-full px-1 animate-in zoom-in duration-300">
                {cartCount}
              </Badge>
            )}
          </Link>

          {/* Auth / Profile */}
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
              <DropdownMenuContent className="w-56 rounded-2xl p-2 bg-background/95 backdrop-blur-xl border-border/20 shadow-2xl" align="end">
                <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-widest text-muted-foreground p-3">
                  Account Control
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/10" />
                <DropdownMenuItem asChild>
                  <Link href="/profile?tab=profile" className="rounded-xl p-3 font-bold text-sm cursor-pointer hover:bg-accent/50">
                    Identity Control
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile?tab=orders" className="rounded-xl p-3 font-bold text-sm cursor-pointer hover:bg-accent/50">
                    Archive Log
                  </Link>
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                   <DropdownMenuItem asChild>
                    <Link href="/admin" className="rounded-xl p-3 font-bold text-sm cursor-pointer text-accent-secondary bg-accent-secondary/5 hover:bg-accent-secondary/10">
                      System Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-border/10" />
                <DropdownMenuItem 
                  onClick={logout}
                  className="rounded-xl p-3 font-bold text-sm cursor-pointer text-rose-500 hover:bg-rose-500/10 focus:bg-rose-500/10"
                >
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
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden w-10 h-10 rounded-full hover:bg-accent/30">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md bg-background/95 backdrop-blur-3xl border-l border-border/10">
              <SheetHeader className="text-left">
                <SheetTitle className="text-4xl font-black uppercase italic tracking-tighter text-gradient mb-12">
                  Nav_Sequence
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-4xl font-black uppercase tracking-tighter text-foreground hover:text-accent-secondary transition-colors italic"
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="h-px w-full bg-border/10 my-6" />
                
                {!isAuthenticated ? (
                  <Link href="/login">
                    <Button className="w-full h-16 rounded-[2rem] bg-foreground text-background font-black uppercase tracking-widest text-[11px] shadow-2xl">
                      Initialize Login
                    </Button>
                  </Link>
                ) : (
                   <Link href="/profile">
                    <Button className="w-full h-16 rounded-[2rem] bg-accent-secondary text-white font-black uppercase tracking-widest text-[11px] shadow-2xl">
                      Enter Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
