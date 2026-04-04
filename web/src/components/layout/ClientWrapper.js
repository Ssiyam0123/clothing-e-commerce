"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore"; 
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientWrapper({ children }) {
  const [mounted, setMounted] = useState(false);
  
  const { initApp } = useAppStore();
  const { checkSession, isLoading } = useAuthStore(); 

  useEffect(() => {
    setMounted(true);
    initApp();
    checkSession(); 
  }, [initApp, checkSession]);

  if (!mounted || isLoading) {
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
      <main className="min-h-screen pt-24 overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </>
  );
}