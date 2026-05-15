"use client";

import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import ProfileHeader from "@/components/profile/ProfileHeader";
import Loader from "@/components/common/Loader";
import { useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Package, ShieldCheck, ChevronRight, Activity, Zap, CreditCard, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";

const DICTIONARY = {
  en: {
    admin: "Administrator",
    member: "Valued Member",
    profile: "My Profile",
    orders: "My Orders",
    security: "Security",
    status: "Account Status",
    active: "Active",
    level: "Membership Level",
    sync: "Profile Sync",
    complete: "Verified",
  },
  bn: {
    admin: "অ্যাডমিনিস্ট্রেটর",
    member: "সম্মানিত সদস্য",
    profile: "আমার প্রোফাইল",
    orders: "আমার অর্ডার",
    security: "নিরাপত্তা",
    status: "অ্যাকাউন্ট স্ট্যাটাস",
    active: "সক্রিয়",
    level: "মেম্বারশিপ লেভেল",
    sync: "প্রোফাইল সিঙ্ক",
    complete: "ভেরিফাইড",
  },
};

export default function ProfileLayout({ children }) {
  const { user, isLoading: authLoading } = useAuthStore();
  const { lang, isMounted } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();

  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY["en"], [lang]);

  useEffect(() => {
    if (isMounted && !authLoading) {
      if (!user) {
        router.push("/login");
      } else if (pathname === "/profile") {
        router.replace("/profile/order");
      }
    }
  }, [isMounted, authLoading, user, router, pathname]);

  if (!isMounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    {
      label: ui.orders,
      href: "/profile/order",
      icon: Package,
      active: pathname === "/profile/order",
    },
    {
      label: ui.profile,
      href: "/profile/details",
      icon: User,
      active: pathname === "/profile/details",
    },
    {
      label: ui.security,
      href: "/profile/setting",
      icon: ShieldCheck,
      active: pathname === "/profile/setting",
    },
  ];

  return (
    <div className="min-h-screen pt-12 md:pt-32 pb-12 md:pb-32 bg-background relative overflow-hidden">
      {/* 🌌 Cybernetic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-accent/10 to-transparent -z-10" />
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -left-24 w-80 h-80 bg-accent-secondary/5 blur-[100px] rounded-full -z-10" />
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
        <ProfileHeader user={user} ui={ui} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 mt-8 md:mt-20">
          {/* ⚡ Side Navigation Panel */}
          <aside className="lg:col-span-3 space-y-6 hidden lg:block">
            <nav className="flex flex-col gap-2 bg-card/40 backdrop-blur-2xl p-5 rounded-[2.5rem] border border-border/10 shadow-2xl">
              <div className="px-4 py-2 mb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Navigation</p>
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 md:gap-4 px-4 py-3 md:px-6 md:py-5 rounded-2xl md:rounded-[1.5rem] transition-all duration-500 overflow-hidden whitespace-nowrap min-w-fit flex-1 lg:w-full",
                    item.active 
                      ? "bg-foreground text-background shadow-2xl shadow-foreground/20" 
                      : "hover:bg-accent/10 text-muted-foreground hover:text-foreground border border-transparent hover:border-border/10"
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4 md:w-5 md:h-5 relative z-10 transition-transform duration-500 group-hover:scale-110",
                    item.active ? "text-background" : "text-primary"
                  )} />
                  <span className="relative z-10 text-[9px] md:text-[11px] font-black uppercase tracking-widest md:tracking-[0.15em]">{item.label}</span>
                  
                  {item.active && (
                    <motion.div
                      layoutId="activeNavHighlight"
                      className="absolute inset-0 bg-foreground"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                    />
                  )}
                  
                  <ChevronRight className={cn(
                    "hidden md:block w-4 h-4 ml-auto transition-all duration-500 relative z-10",
                    item.active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
                  )} />
                </Link>
              ))}
            </nav>
            
            {/* 💎 Elite Status Card */}
            <div className="hidden lg:block relative overflow-hidden bg-gradient-to-br from-card/60 to-accent/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-border/10 shadow-xl group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={60} className="text-primary" />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse shadow-[0_0_10px_rgba(var(--accent-secondary),0.5)]" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-secondary">{ui.status}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-muted-foreground" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{ui.active}</span>
                    </div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{ui.complete}</span>
                  </div>
                  
                  <Link href="/live-support" className="flex items-center gap-3 rounded-2xl p-4 font-black text-[11px] uppercase tracking-widest cursor-pointer text-accent bg-accent/5 hover:bg-accent/10 group transition-all">
                    <LifeBuoy size={16} className="group-hover:rotate-45 transition-transform" />
                    {ui.liveSupport}
                  </Link>

                  <div className="h-[1px] bg-gradient-to-r from-transparent via-border/20 to-transparent w-full" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-muted-foreground" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{ui.level}</span>
                    </div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                      {user.role?.name === 'admin' || user.role?.name === 'superadmin' ? ui.admin : ui.member}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="w-full h-1.5 bg-accent/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      className="h-full bg-gradient-to-r from-primary to-accent-secondary"
                      transition={{ duration: 1.5, ease: "circOut" }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">{ui.sync}</span>
                    <span className="text-[8px] font-black uppercase text-primary tracking-widest">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ⚡ Dynamic Content Area */}
          <main className="lg:col-span-9 relative pb-32 lg:pb-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
      {/* 📱 Mobile Bottom Navigation - App-like experience */}
      <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
        <nav className="bg-background/80 backdrop-blur-2xl border border-border/10 p-2 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-around overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent-secondary/5 -z-10" />
          
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1.5 py-3 px-5 rounded-2xl transition-all duration-500 flex-1",
                item.active 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.active && (
                <motion.div
                  layoutId="mobileActiveNav"
                  className="absolute inset-0 bg-accent/10 -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <item.icon className={cn(
                "w-5 h-5 transition-all duration-500",
                item.active ? "text-accent-secondary scale-110" : "group-hover:scale-110"
              )} />
              <span className={cn(
                "text-[8px] font-black uppercase tracking-widest",
                item.active ? "opacity-100" : "opacity-60"
              )}>
                {item.label.split(' ')[1] || item.label}
              </span>

              {item.active && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 w-1 h-1 bg-accent-secondary rounded-full" 
                />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
