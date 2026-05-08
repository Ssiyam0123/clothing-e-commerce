"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getImageUrl } from "@/utils/imageUtils";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { Menu, Globe, Sun, Moon, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }) {
  const { user, isLoading: authLoading, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme, isMounted } = useAppStore();

  const isChatRoute = pathname?.startsWith("/admin/chat");

  // 🛡️ Redirect non-admins
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (authLoading || !isMounted) {
    return (
      <div className="flex h-screen bg-background transition-colors duration-700">
        {/* Sidebar Skeleton */}
        {!isChatRoute && (
          <div className="hidden lg:flex w-72 flex-col border-r border-border p-8 space-y-8">
            <Skeleton className="h-10 w-40 rounded-xl" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Skeleton */}
          {!isChatRoute && (
            <div className="h-20 border-b border-border px-10 flex items-center justify-between">
              <Skeleton className="h-8 w-48 rounded-full" />
              <div className="flex items-center gap-6">
                <Skeleton className="h-8 w-8 rounded-xl" />
                <Skeleton className="h-10 w-10 rounded-2xl" />
                <div className="hidden lg:block space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </div>
            </div>
          )}

          {/* Main Content Skeleton */}
          <div className={cn("flex-1 space-y-10", !isChatRoute ? "p-10" : "p-0")}>
            {!isChatRoute && (
              <>
                <Skeleton className="h-16 w-1/2 rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-32 rounded-[2rem]" />
                  ))}
                </div>
                <Skeleton className="h-[400px] w-full rounded-[3rem]" />
              </>
            )}
            {isChatRoute && <Skeleton className="h-full w-full rounded-none" />}
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-700">
      {/* 🖥️ Desktop Sidebar */}
      {!isChatRoute && <Sidebar className="hidden lg:flex w-72" />}

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* 🛰️ Top Header Bar */}
        {!isChatRoute && (
          <header className="bg-background/70 backdrop-blur-2xl border-b border-border z-40 transition-all">
            <div className="flex justify-between items-center px-4 md:px-10 py-4 md:py-6">
              <div className="flex items-center gap-5">
                {/* 🍔 Mobile Hamburger (Sheet) */}
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                  <SheetTrigger asChild>
                    <button className="lg:hidden p-3 text-foreground bg-muted rounded-2xl active:scale-90 transition-all">
                      <Menu size={20} />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-72 bg-sidebar border-r border-sidebar-border [&>button]:hidden">
                    <Sidebar className="border-none" onItemClick={() => setIsSidebarOpen(false)} />
                  </SheetContent>
                </Sheet>

                <div className="hidden sm:flex items-center gap-3 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    Terminal_Active
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-8">
                {/* Theme & Store Protocol */}
                <div className="flex items-center gap-4 md:gap-6 border-r border-border pr-4 md:pr-8">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <Globe size={14} className="opacity-50 group-hover:text-accent-secondary" />
                    <span className="hidden md:inline">Live Portal</span>
                  </Link>

                  <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-all shadow-inner"
                  >
                    {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                </div>

                {/* Identity Hub */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl overflow-hidden bg-foreground text-background border border-border shadow-xl p-[2px]">
                     <div className="w-full h-full rounded-[0.9rem] overflow-hidden">
                        {user?.avatar ? (
                          <img
                            src={getImageUrl(user.avatar)}
                            alt={user.name}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className="text-xs font-black">
                              {user?.name?.charAt(0)}
                            </span>
                          </div>
                        )}
                     </div>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-[10px] font-black text-foreground uppercase tracking-wider">
                      {user?.name}
                    </p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                      Authorized_Admin
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="ml-2 md:ml-4 text-muted-foreground hover:text-destructive transition-all hover:rotate-12"
                  title="Disconnect Session"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </header>
        )}

        {/* 💻 Main Viewport */}
        <main className={cn("flex-1 no-scrollbar bg-background/50", !isChatRoute ? "p-4 md:p-10 overflow-y-auto" : "p-0 overflow-hidden")}>
          <div className={cn("mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700", !isChatRoute ? "max-w-[1400px]" : "max-w-none h-full")}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

