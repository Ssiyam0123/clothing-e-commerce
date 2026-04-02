// src/components/admin/Sidebar.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const navItems = [
  { name: "Command Center", href: "/admin", icon: "⌘" },
  { name: "Orders", href: "/admin/orders", icon: "📦" },
  { name: "Products", href: "/admin/products", icon: "👕" },
  { name: "Categories", href: "/admin/categories", icon: "📁" },
  { name: "Flash Drops", href: "/admin/flash-sales", icon: "⚡" },
  { name: "Campaigns", href: "/admin/banner-campaigns", icon: "🎨" },
  { name: "Coupons", href: "/admin/coupons", icon: "🎫" }, // 🌟 Senior Fix: Distinct icon
  { name: "Users", href: "/admin/users", icon: "👥" },
  { name: "My Profile", href: "/profile", icon: "👤" },
  { name: "Setting", href: "/admin/settings", icon: "⚙️" },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const pathname = usePathname();

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  }, [pathname, onClose]);

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50 h-screen
          w-72 bg-[#fcfcfc] dark:bg-[#0a0a0a] border-r border-zinc-200 dark:border-zinc-900
          flex-shrink-0 flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand Header */}
        <div className="p-8 border-b border-zinc-200 dark:border-zinc-900 flex items-center gap-4">
          <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/10 dark:shadow-white/10">
            <span className="text-white dark:text-black font-black italic">E</span>
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tighter uppercase text-zinc-900 dark:text-white leading-none">
              Vanguard
            </h2>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">
              Admin Control
            </span>
          </div>
          {/* Close button on mobile */}
          <button
            className="lg:hidden ml-auto text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto no-scrollbar p-6">
          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-6 pl-4">
            Main Menu
          </p>
          <ul className="space-y-2">
            {navItems.map((item) => {
              // Exact match or nested route match
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest group ${
                      isActive
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-black shadow-lg"
                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    <span
                      className={`text-lg transition-transform duration-300 ${
                        isActive
                          ? "scale-110 grayscale-0"
                          : "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Info */}
        <div className="p-8 border-t border-zinc-200 dark:border-zinc-900">
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-center">
            v2.0.4 Obsidian
          </p>
        </div>
      </aside>
    </>
  );
}