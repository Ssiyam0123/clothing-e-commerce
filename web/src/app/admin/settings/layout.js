"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Globe, Palette, Share2, Mail, Settings2, 
  Cpu, MessageSquare, Layout as LayoutIcon, 
  ChevronRight, Save, Truck, Shield
} from "lucide-react";

export default function SettingsLayout({ children }) {
  const pathname = usePathname();

  const tabs = [
    { id: "branding", label: "Branding", href: "/admin/settings/branding", icon: Globe },
    { id: "theme", label: "Style", href: "/admin/settings/theme", icon: Palette },
    { id: "layout-builder", label: "Layout", href: "/admin/settings/layout-builder", icon: LayoutIcon },
    { id: "socials", label: "Social", href: "/admin/settings/socials", icon: Share2 },
    { id: "shipping", label: "Shipping", href: "/admin/settings/shipping", icon: Truck },
    { id: "contact", label: "Support", href: "/admin/settings/contact", icon: Mail },
    { id: "payment", label: "Payments", href: "/admin/settings/payment", icon: Settings2 },
    { id: "marketing", label: "Marketing", href: "/admin/settings/marketing", icon: Cpu },
    { id: "roles", label: "Access", href: "/admin/settings/roles", icon: Shield },
    { id: "smtp", label: "Email", href: "/admin/settings/smtp", icon: Mail },
    { id: "sms", label: "SMS", href: "/admin/settings/sms", icon: MessageSquare },
  ];

  const activeTab = tabs.find(tab => pathname.startsWith(tab.href)) || tabs[0];

  return (
    <div className="admin-page-container pb-40">
      <div className="mb-8" />

      {/* 🛰️ Tactical Header */}
      <header className="relative mb-12 group">
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-accent-secondary/5 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-duration-700" />
        
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-foreground text-background text-[8px] font-black uppercase tracking-[0.3em] rounded-full">
                System Core
              </div>
              <div className="h-px w-12 bg-border/50" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Globe size={10} /> Node: Global-01
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground italic uppercase flex items-center gap-4">
              {activeTab.label}
              <span className="text-accent-secondary">.</span>
              <span className="text-2xl md:text-3xl text-muted-foreground/30 not-italic font-light">Settings</span>
            </h1>
            
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>Admin</span>
              <ChevronRight size={10} className="text-accent-secondary" />
              <span className="text-foreground">Configuration</span>
              <ChevronRight size={10} className="text-accent-secondary" />
              <span className="text-accent-secondary/60">{activeTab.label}</span>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end px-6 border-r border-border/10">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Sync Status</span>
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Enforced
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-8 md:gap-12">
        <main className="w-full">
          {children}
        </main>
      </div>

      {/* 📱 Unified Bottom Navigation */}
      <div className="fixed bottom-6 left-4 right-4 z-50">
        <nav className="max-w-5xl mx-auto bg-background/80 backdrop-blur-2xl border border-border/10 p-2 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center overflow-x-auto no-scrollbar relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent-secondary/5 -z-10" />
          
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 py-3 px-4 rounded-2xl transition-all duration-500 min-w-[100px] md:min-w-[110px] flex-1",
                  isActive 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="unifiedActiveAdminTab"
                    className="absolute inset-0 bg-accent/10 -z-10 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <tab.icon className={cn(
                  "w-4 h-4 md:w-5 md:h-5 transition-all duration-500",
                  isActive ? "text-accent-secondary scale-110" : "group-hover:scale-110"
                )} />
                <span className={cn(
                  "text-[7px] md:text-[9px] font-black uppercase tracking-widest",
                  isActive ? "opacity-100" : "opacity-60"
                )}>
                  {tab.label}
                </span>

                {isActive && (
                  <motion.div 
                    layoutId="unifiedActiveAdminIndicator"
                    className="absolute -bottom-1 w-1 h-1 bg-accent-secondary rounded-full" 
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
