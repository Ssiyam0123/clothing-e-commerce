"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/appStore";
import useAuth from "@/hooks/useAuth";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientWrapper({ children }) {
  const [mounted, setMounted] = useState(false);
  const { initApp } = useAppStore();
  const { isLoading: authLoading } = useAuth(); 

  useEffect(() => {
    setMounted(true);
    initApp();
  }, [initApp]);

  if (!mounted || authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="animate-pulse text-white font-black text-4xl italic tracking-tighter">
          VANGUARD
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        {children}
      </main>
      <Footer />
    </>
  );
}