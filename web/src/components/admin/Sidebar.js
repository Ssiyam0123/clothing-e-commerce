"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Command Center", href: "/admin", icon: <LayoutDashboard size={18} /> },
  { name: "Orders", href: "/admin/orders", icon: <ShoppingBag size={18} /> },
  { name: "Products", href: "/admin/products", icon: <Shirt size={18} /> },
  { name: "Categories", href: "/admin/categories", icon: <FolderTree size={18} /> },
  { name: "Live Chat", href: "/admin/chat", icon: <MessageCircle size={18} /> },
  { name: "Flash Drops", href: "/admin/flash-sales", icon: <Zap size={18} /> },
  { name: "Campaigns", href: "/admin/banner-campaigns", icon: <Sparkles size={18} /> },
  { name: "Coupons", href: "/admin/coupons", icon: <Ticket size={18} /> },
  { name: "Users", href: "/admin/users", icon: <Users size={18} /> },
  { name: "Blog", href: "/admin/blog", icon: <Bold size={18} /> },
  { name: "My Profile", href: "/profile", icon: <User size={18} /> },
  { name: "Setting", href: "/admin/settings", icon: <Settings size={18} /> },
];

export default function Sidebar({ className, onItemClick }) {
  const pathname = usePathname();

  return (
    <aside className={cn("sidebar-vanguard", className)}>
      {/* 🏷️ Brand Header */}
      <div className="p-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-sidebar-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20">
            <span className="text-sidebar-primary-foreground font-black italic">V</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-black tracking-tighter uppercase text-sidebar-foreground leading-none">
              Vanguard
            </h2>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground mt-1 opacity-70">
              OS Foundry
            </span>
          </div>
        </div>
      </div>

      {/* 🧭 Navigation */}
      <nav className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
        <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.5em] mb-8 pl-4">
          Core Protocol
        </p>
        <ul className="space-y-1.5">
          {navItems.map((item) => {
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
      </nav>

      {/* 🔐 Footer Info */}
      <div className="p-8">
        <div className="bg-sidebar-accent/50 rounded-2xl p-4 border border-sidebar-border">
          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.3em] text-center opacity-60">
            Vanguard Node v2.0.6
          </p>
        </div>
      </div>
    </aside>
  );
}
