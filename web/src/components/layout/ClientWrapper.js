'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SupportChat from '@/components/chat/SupportChat';

export default function ClientWrapper({ children }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { initApp, lang } = useAppStore();
  const { checkSession, isLoading } = useAuthStore();

  const isAdminPage = pathname.startsWith('/admin');

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
      {!isAdminPage && <Navbar />}
      <main className={!isAdminPage ? 'min-h-screen' : ''}>
        {children}
      </main>
      {!isAdminPage && <Footer lang={lang} />}
      {!isAdminPage && <SupportChat />}
    </>
  );
}