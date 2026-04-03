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
  
  const { theme, lang } = useAppStore();

  const fontClass = lang === "bn" ? hindSiliguri.className : inter.className;

  return (
   
    <html lang={lang || 'en'} className={theme || 'dark'} suppressHydrationWarning>
      <body 
        className={`${fontClass} antialiased bg-[#fcfcfc] dark:bg-[#0a0a0a] transition-colors duration-700`}

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