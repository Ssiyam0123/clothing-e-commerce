"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";

export default function ClientInitialization() {
  const initApp = useAppStore((state) => state.initApp);
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    initApp();
    checkSession();
  }, [initApp, checkSession]);

  return null;
}
