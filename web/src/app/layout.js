"use client";

import { useMemo } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/appStore";
import { Inter, Hind_Siliguri } from "next/font/google";
import ClientWrapper from "@/components/layout/ClientWrapper";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali"],
  display: "swap",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = useMemo(() => pathname?.startsWith("/admin"), [pathname]);
  
  // 🚀 স্টোর থেকে ডাটা নিচ্ছি
  const { theme, lang } = useAppStore();

  // 🛡️ Hydration Safety: 
  // সার্ভার সাইডে ফন্ট ক্লাস স্ট্যাবল রাখার জন্য জাস্ট একটা চেক
  const fontClass = lang === "bn" ? hindSiliguri.className : inter.className;

  return (
    // ১. html ট্যাগে অলরেডি suppressHydrationWarning আছে, এটা ঠিক আছে।
    <html lang={lang || 'en'} className={theme || 'dark'} suppressHydrationWarning>
      <body 
        className={`${fontClass} antialiased bg-[#fcfcfc] dark:bg-[#0a0a0a] transition-colors duration-700`}
        // ২. 🚀 বডি ট্যাগেও এটা যোগ কর, কারণ ব্রাউজার এক্সটেনশন এখানেই অ্যাট্রিবিউট ইনজেক্ট করে।
        suppressHydrationWarning={true} 
      >
        <QueryClientProvider client={queryClient}>
          <ClientWrapper isAdminRoute={isAdminRoute}>
            {children}
          </ClientWrapper>
        </QueryClientProvider>
      </body>
    </html>
  );
}