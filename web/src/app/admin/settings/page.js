"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/settings/branding");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
