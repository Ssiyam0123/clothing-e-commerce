"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";

export default function ClientInitialization({ initialSettings }) {
  const setSettings = useAppStore((state) => state.setSettings);
  const initApp = useAppStore((state) => state.initApp);
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    } else {
      initApp();
    }
    checkSession();
  }, [initialSettings, setSettings, initApp, checkSession]);

  return null;
}
