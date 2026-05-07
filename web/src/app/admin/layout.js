"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getImageUrl } from "@/utils/imageUtils";
import Sidebar from "@/components/admin/Sidebar";
import Loader from "@/components/common/Loader";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { Menu, Globe, Sun, Moon, LogOut } from "lucide-react";

export default function AdminLayout({ children }) {
  const { user, isLoading: authLoading, logout } = useAuthStore();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme, isMounted } = useAppStore();

  // 🛡️ Redirect non-admins
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  // 🔒 Lock Body Scroll when Sidebar is open on Mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSidebarOpen]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (authLoading || !isMounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#050505]">
        <Loader />
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="flex h-screen bg-white dark:bg-[#050505] transition-colors duration-700">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* 🛰️ Top Header Bar */}
        <header className="bg-white/70 dark:bg-[#080808]/70 backdrop-blur-2xl border-b border-zinc-100 dark:border-zinc-900 z-40 transition-all">
          <div className="flex justify-between items-center px-4 md:px-10 py-4 md:py-6">
            <div className="flex items-center gap-5">
              {/* 🍔 Mobile Hamburger */}
              <button
                className="lg:hidden p-3 text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 rounded-2xl active:scale-90 transition-all"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>

              <div className="hidden sm:flex items-center gap-3 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  Live Terminal
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-8">
              {/* Theme & Store Protocol */}
              <div className="flex items-center gap-4 md:gap-6 border-r border-zinc-200 dark:border-zinc-800 pr-4 md:pr-8">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  <Globe size={14} className="opacity-50" />
                  <span className="hidden md:inline">Portal</span>
                </Link>

                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all shadow-inner"
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              </div>

              {/* Identity Hub */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl overflow-hidden bg-zinc-900 dark:bg-white border border-zinc-200 dark:border-zinc-800 shadow-xl">
                  {user?.avatar ? (
                    <img
                      src={getImageUrl(user.avatar)}
                      alt={user.name}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs font-black text-white dark:text-black">
                        {user?.name?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="hidden lg:block">
                  <p className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                    {user?.name}
                  </p>
                  <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                    Administrator
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="ml-2 md:ml-4 text-zinc-400 hover:text-rose-500 transition-colors"
                title="Disconnect Session"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* 💻 Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 no-scrollbar bg-[#fdfdfd] dark:bg-[#050505]">
          <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
