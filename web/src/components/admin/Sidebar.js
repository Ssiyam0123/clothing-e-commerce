"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/appStore";
import { navGroups } from "@/utils/adminRoutes";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { hasPermission } from "@/utils/rbacUtils";


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
      return hasPermission(user, item.permission);
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
