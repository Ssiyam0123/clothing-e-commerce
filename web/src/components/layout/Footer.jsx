"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Globe, Mail, Sparkles, Send, Share2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/appStore";
import { getTranslation } from "@/utils/typography/handler";
import { getImageUrl } from "@/utils/imageUtils";

export default function Footer() {
  const { lang, settings, theme } = useAppStore();
  const branding = settings?.branding || {};
  const t = useMemo(() => getTranslation('footer', lang), [lang]);

  const footerSections = useMemo(() => [
    {
      title: t.explore,
      links: [
        { label: t.home, href: "/" },
        { label: t.products, href: "/products" },
        { label: t.flashSale, href: "/flash-sale" },
        { label: t.blog, href: "/blog" },
      ],
    },
    {
      title: t.support,
      links: [
        { label: t.profile, href: "/profile" },
        { label: t.wishlist, href: "/wishlist" },
        { label: t.cart, href: "/cart" },
        { label: t.liveSupport, href: "/live-support" },
      ],
    },
    {
      title: t.legal,
      links: [
        { label: t.privacy, href: "/privacy" },
        { label: t.terms, href: "/terms" },
        { label: t.shipping, href: "/shipping" },
      ],
    },
  ], [t]);

  return (
    <footer className="bg-background text-foreground border-t border-border/10 pt-24 pb-12 px-6 lg:px-12 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-accent-secondary/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Brand Engine */}
          <div className="lg:col-span-5 space-y-10">
            <Link href="/" className="flex items-center gap-3 group">
               {branding.footerLogoLight || branding.footerLogoDark ? (
                 <img 
                   src={getImageUrl(theme === 'dark' ? (branding.footerLogoDark || branding.footerLogoLight) : (branding.footerLogoLight || branding.footerLogoDark))} 
                   alt={branding.siteName} 
                   className="h-9 w-auto object-contain transition-transform group-hover:scale-110 duration-500" 
                 />
               ) : (
                 <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center text-background group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                    <Sparkles size={20} />
                 </div>
               )}
            </Link>
            <p className="text-base md:text-lg font-medium text-muted-foreground leading-relaxed max-w-md italic opacity-80">
              {t.description}
            </p>
            <div className="flex items-center gap-4">
              {[
                { Icon: Globe, label: "Global Network" },
                { Icon: Send, label: "Direct Transmission" },
                { Icon: Share2, label: "Share Protocol" },
                { Icon: Activity, label: "System Status" }
              ].map(({ Icon, label }, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-foreground hover:text-accent-secondary hover:scale-110 hover:rotate-6 transition-all duration-500 shadow-sm border-border/10"
                  aria-label={label}
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Link Matrix */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-6">
                <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-accent-secondary">
                  {section.title}
                </h4>
                <nav aria-label={`${section.title} navigation`}>
                  <ul className="space-y-4">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link 
                          href={link.href}
                          className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all flex items-center gap-2 group"
                        >
                          <span className="h-px w-0 bg-accent-secondary group-hover:w-3 transition-all duration-500" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Terminal */}
        <div className="mt-24 p-8 sm:p-12 lg:p-16 rounded-[2.5rem] sm:rounded-[3.5rem] glass border-accent-secondary/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-secondary/5 to-transparent" />
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">
             <div className="space-y-3 text-center lg:text-left shrink-0">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">{t.newsletter}</h3>
                <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[9px] max-w-sm">{t.newsletterSub}</p>
             </div>
             <div className="flex-1 w-full max-w-xl relative group/input">
                <div className="flex flex-col sm:flex-row items-center relative gap-4 sm:gap-0">
                  <Input 
                    placeholder={t.emailPlaceholder} 
                    className="h-14 lg:h-16 rounded-full bg-background/50 border-none px-8 lg:px-10 font-black text-[10px] uppercase tracking-widest shadow-2xl focus-visible:ring-2 focus-visible:ring-accent-secondary/30 transition-all placeholder:text-muted-foreground/30 w-full sm:pr-[160px]"
                    aria-label="Newsletter email address"
                  />
                  <div className="hidden sm:block absolute right-2 top-1/2 -translate-y-1/2">
                    <Button 
                      className="h-10 lg:h-12 rounded-full bg-foreground text-background hover:bg-accent-secondary hover:text-white transition-all px-6 lg:px-8 shadow-xl"
                      aria-label="Subscribe to newsletter"
                    >
                      <Mail size={14} className="mr-2" />
                      <span className="font-black uppercase text-[9px] tracking-widest">{t.subscribe}</span>
                    </Button>
                  </div>
                  <Button 
                    className="sm:hidden h-14 rounded-full bg-foreground text-background hover:bg-accent-secondary hover:text-white transition-all px-8 shadow-xl w-full"
                    aria-label="Subscribe to newsletter"
                  >
                     <Mail size={16} className="mr-2" />
                     <span className="font-black uppercase text-[9px] tracking-widest">{t.subscribe}</span>
                  </Button>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-24 flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-border/10">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">Systems Online • Vanguard Node v4.2.0</p>
           </div>
           <div className="flex items-center gap-6 sm:gap-10">
              <Link href="/terms" className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100">{t.legal}</Link>
              <Link href="/privacy" className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100">{t.privacy}</Link>
               <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40">© 2026 All Rights Reserved • {branding.siteName || "Vanguard"}</p>
           </div>
        </div>
      </div>
    </footer>
  );
}
