"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import dynamic from "next/dynamic";

const SupportChat = dynamic(() => import("@/components/chat/SupportChat"), {
  ssr: false
});

export default function ClientInitialization({ initialSettings, initialLang, initialTheme }) {
  const setSettings = useAppStore((state) => state.setSettings);
  const initApp = useAppStore((state) => state.initApp);
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings, { lang: initialLang, theme: initialTheme });
    } else {
      initApp();
    }
    
    // 🛡️ Only check session once on initial mount to prevent loops
    checkSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <SupportChat />;
}
