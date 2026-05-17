"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getImageUrl } from "@/utils/imageUtils";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/admin/_components/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { Menu, Globe, Sun, Moon, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { hasPermission, hasAnyAdminPermission } from "@/utils/rbacUtils";

export default function AdminLayout({ children }) {
  const { user, token, isLoading: authLoading, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme, isMounted, isAdminSidebarCollapsed } = useAppStore();
  const { initSocket, disconnectSocket, fetchUnreadCount } = useChatStore();
  useTheme();

  const isChatRoute = pathname?.startsWith("/admin/chat");
  const isFullPage = isChatRoute;

  // 🛡️ Redirect non-admins
  useEffect(() => {
    const hasAdminAccess = hasAnyAdminPermission(user);

    if (!authLoading && (!user || !hasAdminAccess)) {
      router.replace("/");
    }

    if (user && hasAdminAccess && token) {
      initSocket(token);
      fetchUnreadCount();
    }

    return () => {
      disconnectSocket();
    };
  }, [user, authLoading, router, token, initSocket, disconnectSocket, fetchUnreadCount]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (authLoading || !isMounted) {
    return (
      <div className="flex h-screen bg-background transition-colors duration-700">
        {/* Sidebar Skeleton */}
        {!isFullPage && (
          <div className={cn(
            "hidden lg:flex flex-col border-r border-border p-8 space-y-8 transition-all duration-500",
            isAdminSidebarCollapsed ? "w-24" : "w-72"
          )}>
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Skeleton */}
          {!isFullPage && (
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
          <div className={cn("flex-1 space-y-10", !isFullPage ? "p-10" : "p-0")}>
            {!isFullPage && (
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
            {isFullPage && <Skeleton className="h-full w-full rounded-none" />}
          </div>
        </div>
      </div>
    );
  }

  const hasAdminAccess = hasAnyAdminPermission(user);

  if (!user || !hasAdminAccess) return null;

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-700 overflow-hidden">
      {/* 🖥️ Desktop Sidebar */}
      {!isFullPage && <Sidebar className="hidden lg:flex shrink-0 border-r border-sidebar-border" />}

      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* 🛰️ Top Header Bar */}
        {!isFullPage && (
          <header className="bg-background/70 backdrop-blur-2xl border-b border-border z-40 shrink-0">
            <div className="flex justify-between items-center px-4 md:px-10 py-3 md:py-6">
              <div className="flex items-center gap-3 md:gap-5">
                {/* 🍔 Mobile Hamburger (Sheet) */}
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                  <SheetTrigger asChild>
                    <button className="lg:hidden p-2.5 text-foreground bg-muted rounded-xl active:scale-90 transition-all">
                      <Menu size={18} />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-72 bg-sidebar border-r border-sidebar-border [&>button]:hidden">
                    <SheetHeader className="sr-only">
                      <SheetTitle>Admin Navigation</SheetTitle>
                      <SheetDescription>Access administrative control panels and settings.</SheetDescription>
                    </SheetHeader>
                    <Sidebar className="border-none" onItemClick={() => setIsSidebarOpen(false)} />
                  </SheetContent>
                </Sheet>

                <div className="hidden sm:flex items-center gap-3 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    Active
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-8">
                {/* Theme & Store Protocol */}
                <div className="flex items-center gap-3 md:gap-6 border-r border-border pr-3 md:pr-8">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <Globe size={14} className="opacity-50 group-hover:text-accent-secondary" />
                    <span className="hidden sm:inline">Go to Store</span>
                  </Link>

                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-all shadow-inner"
                  >
                    {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                  </button>
                </div>

                {/* Identity Hub */}
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl md:rounded-2xl overflow-hidden bg-foreground text-background border border-border shadow-xl p-[1.5px] md:p-[2px]">
                     <div className="w-full h-full rounded-[0.5rem] md:rounded-[0.9rem] overflow-hidden">
                        {user?.avatar ? (
                          <img
                            src={getImageUrl(user.avatar)}
                            alt={user.name}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className="text-[10px] font-black">
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
                      {user?.role?.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive transition-all hover:rotate-12"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </header>
        )}

        <main className={cn("flex-1 overflow-y-auto no-scrollbar bg-background/50", !isFullPage ? "h-full" : "p-0 overflow-hidden")}>
          <div className={cn("mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700", !isFullPage ? "max-w-none" : "max-w-none h-full")}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

