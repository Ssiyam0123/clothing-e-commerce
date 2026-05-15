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
  const { settings, isAdminSidebarCollapsed, toggleAdminSidebar } = useAppStore();
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
    <aside className={cn(
      "sidebar-vanguard transition-all duration-500 ease-in-out",
      isAdminSidebarCollapsed ? "w-24" : "w-72",
      className
    )}>
      {/* 🏷️ Brand Header */}
      <div 
        className={cn(
          "p-8 cursor-pointer hover:opacity-80 transition-opacity",
          isAdminSidebarCollapsed && "flex justify-center"
        )}
        onClick={toggleAdminSidebar}
      >
        <div className="flex items-center gap-4">
          <div className="min-w-10 w-10 h-10 bg-sidebar-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20">
            <span className="text-sidebar-primary-foreground font-black italic text-lg">
              {siteName.charAt(0).toUpperCase()}
            </span>
          </div>
          {!isAdminSidebarCollapsed && (
            <div className="flex flex-col overflow-hidden whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">
              <h2 className="text-sm font-black tracking-tighter uppercase text-sidebar-foreground leading-none">
                {siteName}
              </h2>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground mt-1 opacity-70">
                Admin Panel
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 🧭 Navigation */}
      <nav className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 space-y-10">
        {filteredGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            {!isAdminSidebarCollapsed && (
              <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.5em] mb-6 pl-4 animate-in fade-in duration-700">
                {group.label}
              </p>
            )}
            {isAdminSidebarCollapsed && (
              <div className="h-px bg-sidebar-border/10 mb-6" />
            )}
            <ul className="space-y-1.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onItemClick}
                      className={cn(
                        "sidebar-nav-item flex items-center",
                        isAdminSidebarCollapsed ? "justify-center px-0" : "px-4",
                        isActive ? "sidebar-nav-item-active" : "sidebar-nav-item-inactive"
                      )}
                      title={isAdminSidebarCollapsed ? item.name : ""}
                    >
                      <span className={cn(
                        "transition-all duration-300", 
                        isActive ? "scale-110" : "opacity-70 group-hover:opacity-100",
                        isAdminSidebarCollapsed ? "text-xl" : ""
                      )}>
                        {item.icon}
                      </span>
                      {!isAdminSidebarCollapsed && (
                        <span className="animate-in fade-in slide-in-from-left-2 duration-500">{item.name}</span>
                      )}
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
        <div className={cn(
          "bg-sidebar-accent/50 rounded-2xl p-4 border border-sidebar-border",
          isAdminSidebarCollapsed && "flex justify-center"
        )}>
          {isAdminSidebarCollapsed ? (
            <span className="text-[10px] font-black text-primary italic">V2</span>
          ) : (
            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.3em] text-center opacity-60 animate-in fade-in duration-700">
              {siteName} Admin v2.0.6
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
