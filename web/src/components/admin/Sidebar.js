"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/appStore";
import {
  LayoutDashboard,
  ShoppingBag,
  Shirt,
  FolderTree,
  Zap,
  Ticket,
  Users,
  User,
  Settings,
  Bold,
  MessageCircle,
  Sparkles,
  Layout,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useAuthStore } from "@/store/authStore";

const navGroups = [
  {
    label: "Management",
    items: [
      { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} />, permission: ["dashboard:view", "reports:view"] },
      { name: "Orders", href: "/admin/orders", icon: <ShoppingBag size={18} />, permission: "orders:view" },
      { name: "Products", href: "/admin/products", icon: <Shirt size={18} />, permission: "products:view" },
      { name: "Categories", href: "/admin/categories", icon: <FolderTree size={18} />, permission: "categories:view" },
      { name: "Layout Builder", href: "/admin/layout-builder", icon: <Layout size={18} />, permission: "settings:manage" },
      { name: "Live Chat", href: "/admin/chat", icon: <MessageCircle size={18} />, permission: "chat:view" },
    ]
  },
  {
    label: "Marketing & Content",
    items: [
      { name: "Banners", href: "/admin/banner-campaigns", icon: <Sparkles size={18} />, permission: "banner-campaigns:view" },
      { name: "Flash Sales", href: "/admin/flash-sales", icon: <Zap size={18} />, permission: "flash-sales:view" },
      { name: "Coupons", href: "/admin/coupons", icon: <Ticket size={18} />, permission: "coupons:view" },
      { name: "Blog", href: "/admin/blog", icon: <Bold size={18} />, permission: "blogs:view" },
    ]
  },
  {
    label: "Settings & Users",
    items: [
      { name: "Users", href: "/admin/users", icon: <Users size={18} />, permission: "users:view" },
      { name: "Roles", href: "/admin/roles", icon: <Shield size={18} />, permission: "roles:view" },
      { name: "Profile", href: "/admin/profile", icon: <User size={18} /> }, // No specific permission needed for profile
      { name: "Settings", href: "/admin/settings", icon: <Settings size={18} />, permission: "settings:view" },
    ]
  }
];

export default function Sidebar({ className, onItemClick }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { settings } = useAppStore();
  const branding = settings?.branding || {};
  const siteName = branding.siteName || "Store";

  const filteredGroups = navGroups.map(group => ({
    ...group,
    items: group.items.filter(item => {
      if (!item.permission) return true;
      if (user?.role?.name === 'superadmin') return true;
      if (user?.role?.permissions?.includes('all')) return true;
      const perms = Array.isArray(item.permission) ? item.permission : [item.permission];
      return perms.some(p => user?.role?.permissions?.includes(p));
    })
  })).filter(group => group.items.length > 0);

  return (
    <aside className={cn("sidebar-vanguard", className)}>
      {/* 🏷️ Brand Header */}
      <div className="p-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-sidebar-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20">
            <span className="text-sidebar-primary-foreground font-black italic">
              {siteName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-black tracking-tighter uppercase text-sidebar-foreground leading-none">
              {siteName}
            </h2>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground mt-1 opacity-70">
              Admin Panel
            </span>
          </div>
        </div>
      </div>

      {/* 🧭 Navigation */}
      <nav className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 space-y-10">
        {filteredGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.5em] mb-6 pl-4">
              {group.label}
            </p>
            <ul className="space-y-1.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onItemClick}
                      className={cn(
                        "sidebar-nav-item",
                        isActive ? "sidebar-nav-item-active" : "sidebar-nav-item-inactive"
                      )}
                    >
                      <span className={cn("transition-transform duration-300", isActive ? "scale-110" : "opacity-70 group-hover:opacity-100")}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* 🔐 Footer Info */}
      <div className="p-8">
        <div className="bg-sidebar-accent/50 rounded-2xl p-4 border border-sidebar-border">
          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.3em] text-center opacity-60">
            {siteName} Admin v2.0.6
          </p>
        </div>
      </div>
    </aside>
  );
}
