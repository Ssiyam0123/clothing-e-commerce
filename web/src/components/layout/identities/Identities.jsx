"use client";

import Navbar from "../Navbar";
import Footer from "../Footer";
import SupportChat from "@/components/chat/SupportChat";

// Standard Base Layout (Used while we rebuild themes 1 by 1)
export const StandardLayout = ({ children, settings }) => (
  <div className="identity-standard bg-background text-foreground transition-colors duration-500">
    <Navbar settings={settings} />
    <main className="min-h-screen pt-16 md:pt-20">
      {children}
    </main>
    <Footer settings={settings} />
    <SupportChat />
  </div>
);
