"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { 
  LayoutDashboard, ShoppingBag, Shirt, FolderTree, 
  Zap, palette, Ticket, Users, User, Settings, X, 
  Bold
} from "lucide-react"; // 🚀 Lucide icons for premium feel

const navItems = [
  { name: "Command Center", href: "/admin", icon: <LayoutDashboard size={18}/> },
  { name: "Orders", href: "/admin/orders", icon: <ShoppingBag size={18}/> },
  { name: "Products", href: "/admin/products", icon: <Shirt size={18}/> },
  { name: "Categories", href: "/admin/categories", icon: <FolderTree size={18}/> },
  { name: "Flash Drops", href: "/admin/flash-sales", icon: <Zap size={18}/> },
  { name: "Campaigns", href: "/admin/banner-campaigns", icon: "🎨" },
  { name: "Coupons", href: "/admin/coupons", icon: <Ticket size={18}/> },
  { name: "Users", href: "/admin/users", icon: <Users size={18}/> },
  { name: "Blog", href: "/admin/blog", icon: <Bold size={18}/> },
  { name: "My Profile", href: "/profile", icon: <User size={18}/> },
  { name: "Setting", href: "/admin/settings", icon: <Settings size={18}/> },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const pathname = usePathname();

  // 🔄 Close sidebar when navigating on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) onClose();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname, onClose]);

  return (
    <>
      {/* 🌑 Mobile Overlay Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-500 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* ⚡ Sidebar Container */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-[110] h-full
          w-[280px] sm:w-72 bg-white dark:bg-[#080808] border-r border-zinc-100 dark:border-zinc-900
          flex-shrink-0 flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* 🏷️ Brand Header */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20">
              <span className="text-white dark:text-black font-black italic">V</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-black tracking-tighter uppercase text-zinc-900 dark:text-white leading-none">
                Vanguard
              </h2>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-400 mt-1">
                OS Foundry
              </span>
            </div>
          </div>
          
          {/* ✖️ Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 🧭 Navigation */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
          <p className="text-[9px] font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-[0.5em] mb-8 pl-4">
            Core Protocol
          </p>
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`flex items-center gap-4 px-5 py-4 rounded-[1.2rem] transition-all duration-300 font-bold text-[10px] uppercase tracking-[0.15em] group ${
                      isActive
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-black shadow-[0_10px_20px_rgba(0,0,0,0.1)] scale-[1.02]"
                        : "text-zinc-500 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    <span className={`transition-transform duration-300 ${isActive ? "scale-110" : "opacity-70 group-hover:opacity-100"}`}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 🔐 Footer Session Info */}
        <div className="p-8 mt-auto">
          <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800/50">
             <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em] text-center">
               Vanguard Node v2.0.6
             </p>
          </div>
        </div>
      </aside>
    </>
  );
}