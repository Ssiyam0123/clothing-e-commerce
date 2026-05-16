"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import dynamic from "next/dynamic";

const SupportChat = dynamic(() => import("@/components/chat/SupportChat"), {
  ssr: false
});

export default function ClientInitialization({ initialSettings, initialLang, initialTheme }) {
  const setSettings = useAppStore((state) => state.setSettings);
  const initApp = useAppStore((state) => state.initApp);
  const checkSession = useAuthStore((state) => state.checkSession);
  const { token, isAuthenticated } = useAuthStore();
  const initSocket = useChatStore((state) => state.initSocket);
  const disconnectSocket = useChatStore((state) => state.disconnectSocket);
  const fetchConversations = useChatStore((state) => state.fetchConversations);

  useEffect(() => {
    // 🌍 Sync store with cookies first
    useAppStore.getState().initFromCookies();

    if (initialSettings) {
      setSettings(initialSettings, { lang: initialLang, theme: initialTheme });
    } else {
      initApp();
    }
    
    // 🛡️ Only check session once on initial mount to prevent loops
    checkSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isAuthenticated && token) {
      initSocket(token);
      fetchConversations();
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated, token, initSocket, disconnectSocket, fetchConversations]);

  return <SupportChat />;
}
