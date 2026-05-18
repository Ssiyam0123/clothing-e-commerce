'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import Script from 'next/script';
import { isAdminRoute } from '@/lib/tracking/isAdminRoute';

const PixelManagerContent = ({ marketing = {} }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    fbPixelId,
    gtmId,
    tiktokPixelId,
    snapPixelId,
    pinterestTagId,
    googleAdsId,
    clarityId
  } = Object.fromEntries(
    Object.entries(marketing).map(([key, val]) => [key, typeof val === 'string' ? val.trim() : val])
  );

  useEffect(() => {
    if (isAdminRoute(pathname)) return;

    // 🔵 Facebook PageView
    if (fbPixelId && window.fbq) window.fbq('track', 'PageView');

    // 🔴 GTM PageView
    if (gtmId && window.dataLayer) {
      window.dataLayer.push({ event: 'pageview', page_path: pathname, page_title: document.title });
    }

    // 🎵 TikTok PageView
    if (tiktokPixelId && window.ttq && typeof window.ttq.page === 'function') window.ttq.page();

    // 👻 Snapchat PageView
    if (snapPixelId && window.snaptr && typeof window.snaptr === 'function') window.snaptr('track', 'PAGE_VIEW');

    // 📌 Pinterest PageView
    if (pinterestTagId && window.pintrk && typeof window.pintrk === 'function') window.pintrk('track', 'pagevisit');

  }, [pathname, searchParams, fbPixelId, gtmId, tiktokPixelId, snapPixelId, pinterestTagId]);

  if (isAdminRoute(pathname)) return null;

  return (
    <>
      {/* 🔵 Facebook Pixel */}
      {fbPixelId && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}


      {/* 🎵 TikTok */}
      {tiktokPixelId && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","detach","updateConfigs"],ttq.setAndGetCookie=function(t,e){return this.setCookie(t,e)},ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndGetCookie(ttq,e),ttq.methods[n](e);return e},ttq.load=function(e,n){var t="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=t,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var i=document.createElement("script");i.type="text/javascript",i.async=!0,i.src=t+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(i,a)};
              for(var i=0;i<ttq.methods.length;i++){ttq[ttq.methods[i]]=function(method){return function(){ttq.push([method].concat(Array.prototype.slice.call(arguments,0)))}}(ttq.methods[i])}
              ttq.load('${tiktokPixelId}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}

      {/* 🔍 Clarity */}
      {clarityId && (
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}

      {/* 👻 Snapchat */}
      {snapPixelId && (
        <Script id="snapchat-pixel" strategy="afterInteractive">
          {`
            (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
            {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
            a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;
            r.src=n;var i=t.getElementsByTagName(s)[0];i.parentNode.insertBefore(r,i);
            })(window,document,'https://sc-static.net/scevent.min.js');
            snaptr('init', '${snapPixelId}');
            snaptr('track', 'PAGE_VIEW');
          `}
        </Script>
      )}

      {/* 📌 Pinterest */}
      {pinterestTagId && (
        <Script id="pinterest-tag" strategy="afterInteractive">
          {`
            !function(e){if(!window.pintrk){window.pintrk=function()
            {window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
            n=window.pintrk;n.queue=[],n.version="3.0";var
            t=document.createElement("script");t.async=!0,t.src=e;var
            r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}
            ("https://s.pinimg.com/ct/core.js");
            pintrk('load', '${pinterestTagId}');
            pintrk('page');
          `}
        </Script>
      )}

      {/* 🎯 Google Ads */}
      {googleAdsId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`} strategy="afterInteractive" />
          <Script id="google-ads" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAdsId}');
            `}
          </Script>
        </>
      )}
    </>
  );
};

export default function PixelManager({ marketing }) {
  return (
    <Suspense fallback={null}>
      <PixelManagerContent marketing={marketing} />
    </Suspense>
  );
}

export const GTMNoScript = ({ marketing = {} }) => {
  const gtmId = marketing.gtmId?.trim();
  if (!gtmId) return null;
  return (
    <noscript>
      <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
    </noscript>
  );
};
