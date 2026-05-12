"use client";

import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import ProfileHeader from "@/components/profile/ProfileHeader";
import Loader from "@/components/common/Loader";
import { useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Package, ShieldCheck, ChevronRight, Activity, Zap, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const DICTIONARY = {
  en: {
    admin: "System Admin",
    member: "Elite Member",
    profile: "Identity details",
    orders: "Archive Log",
    security: "Security Protocol",
    status: "Protocol Status",
    active: "Operational",
    level: "Clearance Level",
    sync: "Neural Sync",
    complete: "Verified",
  },
  bn: {
    admin: "সিস্টেম এডমিন",
    member: "এলিট মেম্বার",
    profile: "প্রোফাইল তথ্য",
    orders: "অর্ডার আর্কাইভ",
    security: "নিরাপত্তা প্রোটোকল",
    status: "প্রোটোকল স্ট্যাটাস",
    active: "সক্রিয়",
    level: "ক্লিয়ারেন্স লেভেল",
    sync: "নিউরাল সিঙ্ক",
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
    if (isMounted && !authLoading && !user) {
      router.push("/login");
    }
  }, [isMounted, authLoading, user, router]);

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
      label: ui.profile,
      href: "/profile",
      icon: User,
      active: pathname === "/profile",
    },
    {
      label: ui.orders,
      href: "/profile/order",
      icon: Package,
      active: pathname === "/profile/order",
    },
    {
      label: ui.security,
      href: "/profile/setting",
      icon: ShieldCheck,
      active: pathname === "/profile/setting",
    },
  ];

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-24 sm:pb-32 bg-background relative overflow-hidden">
      {/* 🌌 Cybernetic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-accent/10 to-transparent -z-10" />
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -left-24 w-80 h-80 bg-accent-secondary/5 blur-[100px] rounded-full -z-10" />
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
        <ProfileHeader user={user} ui={ui} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 mt-12 sm:mt-20">
          {/* ⚡ Side Navigation Panel */}
          <aside className="lg:col-span-3 space-y-6">
            <nav className="flex flex-col gap-2.5 bg-card/40 backdrop-blur-2xl p-4 sm:p-5 rounded-[2.5rem] border border-border/10 shadow-2xl">
              <div className="px-4 py-2 mb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Navigation</p>
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-4 px-6 py-5 rounded-[1.5rem] transition-all duration-500 overflow-hidden",
                    item.active 
                      ? "bg-foreground text-background shadow-2xl shadow-foreground/20" 
                      : "hover:bg-accent/10 text-muted-foreground hover:text-foreground border border-transparent hover:border-border/10"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 relative z-10 transition-transform duration-500 group-hover:scale-110",
                    item.active ? "text-background" : "text-primary"
                  )} />
                  <span className="relative z-10 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em]">{item.label}</span>
                  
                  {item.active && (
                    <motion.div
                      layoutId="activeNavHighlight"
                      className="absolute inset-0 bg-foreground"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                    />
                  )}
                  
                  <ChevronRight className={cn(
                    "w-4 h-4 ml-auto transition-all duration-500 relative z-10",
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
          <main className="lg:col-span-9 relative">
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
    </div>
  );
}
