"use client";

import { usePathname } from "next/navigation";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { cn } from "@/lib/utils";

// Standard Base Layout (Used while we rebuild themes 1 by 1)
export const StandardLayout = ({ children, settings }) => {
  const pathname = usePathname();
  const isFullPageChat = pathname === "/live-support";

  return (
    <div className="identity-standard bg-background text-foreground transition-colors duration-500">
      {!isFullPageChat && <Navbar settings={settings} />}
      <main className={cn(
        "min-h-screen",
        !isFullPageChat ? "pt-16 md:pt-20" : "pt-0"
      )}>
        {children}
      </main>
      {!isFullPageChat && <Footer settings={settings} />}
    </div>
  );
};
