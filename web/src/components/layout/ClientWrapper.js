"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/appStore";
import { useSettings } from "@/hooks/useSettings";
import { useTrackingStore } from "@/store/trackingStore";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Script from "next/script";

export default function ClientWrapper({ children, isAdminRoute }) {
  const pathname = usePathname();
  const { theme, lang, isMounted, initApp } = useAppStore();
  const { settings } = useSettings(); // 🚀 এখন এখানে আর এরর দিবে না
  const trackPageView = useTrackingStore((state) => state.trackPageView);

  const branding = settings?.branding || {};
  const config = settings?.config || {};
  const pixelId = config?.fbPixelId;

  useEffect(() => {
    initApp();
  }, [initApp]);

  useEffect(() => {
    if (!isMounted) return;
    trackPageView(pathname);
    if (window.fbq && pixelId) {
      window.fbq("track", "PageView");
    }
  }, [pathname, trackPageView, isMounted, pixelId]);

  if (!isMounted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-pulse text-zinc-800 font-black text-4xl italic">VANGUARD</div>
      </div>
    );
  }

  return (
    <>
      {/* Dynamic Header Info */}
      {pixelId && (
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixelId}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {!isAdminRoute && <Navbar branding={branding} />}

      <main className={!isAdminRoute ? "min-h-screen pt-20 md:pt-24 transition-all duration-500" : "h-screen w-full bg-zinc-50 dark:bg-[#050505] overflow-hidden"}>
        {children}
      </main>

      {!isAdminRoute && <Footer settings={settings} />}
    </>
  );
}