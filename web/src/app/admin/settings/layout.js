"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import {
  Globe, Palette, Share2, Mail, Settings2,
  Cpu, MessageSquare, Layout as LayoutIcon,
  Truck, Shield, Key
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
    { id: "auth", label: "Auth", href: "/admin/settings/auth", icon: Key },
    { id: "smtp", label: "Email", href: "/admin/settings/smtp", icon: Mail },
    { id: "sms", label: "SMS", href: "/admin/settings/sms", icon: MessageSquare },
  ];

  const activeTab = tabs.find(tab => pathname.startsWith(tab.href)) || tabs[0];

  return (
    <div className="admin-page-container pb-40">
      <AdminPageHeader
        title={activeTab.label}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Settings", href: "/admin/settings/branding" },
          { label: activeTab.label },
        ]}
      />

      <div className="flex flex-col gap-8 md:gap-12">
        <main className="w-full">
          {children}
        </main>
      </div>

      {/* 📱 Unified Bottom Navigation */}
      <div className="fixed bottom-6 left-4 right-4 z-50">
        <div className="max-w-7xl mx-auto bg-background/80 backdrop-blur-2xl border border-border/10 rounded-[2rem] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent-secondary/5 -z-10 rounded-[2rem]" />
          <nav 
            style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
            className="p-1.5 flex items-center justify-start md:justify-center overflow-x-auto gap-1 [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((tab) => {
              const isActive = pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={cn(
                    "relative flex flex-col items-center gap-1 py-2 px-1 rounded-2xl transition-all duration-500 min-w-[65px] md:min-w-[75px] flex-shrink-0 md:flex-1 text-center",
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
                    "w-3.5 h-3.5 md:w-4.5 md:h-4.5 transition-all duration-500",
                    isActive ? "text-accent-secondary scale-110" : "group-hover:scale-110"
                  )} />
                  <span className={cn(
                    "text-[6px] md:text-[8px] font-black uppercase tracking-wider block truncate w-full",
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
    </div>
  );
}
