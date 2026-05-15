"use client";

import { usePathname } from "next/navigation";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { cn } from "@/lib/utils";

// Standard Base Layout (Used while we rebuild themes 1 by 1)
export const StandardLayout = ({ children, settings }) => {
  const pathname = usePathname();
  const isFullPageChat = pathname === "/live-support";
  const isProfile = pathname.startsWith("/profile");
  const showNavbarFooter = !isFullPageChat;
  const showFooter = showNavbarFooter && !isProfile;

  return (
    <div className="identity-standard bg-background text-foreground transition-colors duration-500">
      {showNavbarFooter && <Navbar settings={settings} />}
      <main className="min-h-screen pt-0">
        {children}
      </main>
      {showFooter && <Footer settings={settings} />}
    </div>
  );
};
