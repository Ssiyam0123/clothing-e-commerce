"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import SupportChat from "@/modules/client/chat/components/SupportChat";
import { useSettings } from "@/hooks/useSettings";

export default function StandardLayout({ children }) {
  const { settings } = useSettings();
  
  return (
    <>
      <Navbar settings={settings} />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer settings={settings} />
      <SupportChat />
    </>
  );
}
