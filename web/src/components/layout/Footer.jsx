"use client";

import Link from "next/link";
import { Globe, Mail, ArrowUpRight, Sparkles, Send, Share2, Activity, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const FOOTER_SECTIONS = [
  {
    title: "Collection",
    links: [
      { label: "New Artifacts", href: "/products?sort=-createdAt" },
      { label: "High Investment", href: "/products?sort=-price" },
      { label: "Archived Pieces", href: "/products?category=archive" },
      { label: "Sustainability Report", href: "/sustainability" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Transit Tracking", href: "/profile/orders" },
      { label: "Size Blueprint", href: "/size-guide" },
      { label: "Recovery Protocol", href: "/returns" },
      { label: "Direct Comms", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "The Narrative", href: "/about" },
      { label: "Media Assets", href: "/press" },
      { label: "Collaborations", href: "/collabs" },
      { label: "Legal Framework", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-background text-foreground border-t border-border/10 pt-32 pb-16 px-6 lg:px-12 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-accent-secondary/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-32">
          {/* Brand Engine */}
          <div className="lg:col-span-5 space-y-12">
            <Link href="/" className="flex items-center gap-4 group">
               <div className="w-12 h-12 bg-foreground rounded-2xl flex items-center justify-center text-background group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <Sparkles size={24} />
               </div>
               <span className="text-4xl font-black uppercase italic tracking-tighter text-gradient">Vanguard</span>
            </Link>
            <p className="text-lg md:text-xl font-medium text-muted-foreground leading-relaxed max-w-md italic">
              "We architect artifacts for the modern vanguard. Sustainable fibers meet high-performance silhouettes."
            </p>
            <div className="flex items-center gap-6">
              {[Globe, Send, Share2, Activity].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-muted-foreground hover:text-accent-secondary hover:scale-110 hover:rotate-6 transition-all duration-500 shadow-sm border-border/10"
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          {/* Link Matrix */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className="space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-secondary">
                  {section.title}
                </h4>
                <ul className="space-y-5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        href={link.href}
                        className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all flex items-center gap-2 group"
                      >
                        <span className="h-px w-0 bg-accent-secondary group-hover:w-4 transition-all duration-500" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Terminal */}
        <div className="mt-32 p-12 lg:p-20 rounded-[4rem] glass border-accent-secondary/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-secondary/5 to-transparent" />
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
             <div className="space-y-4 text-center lg:text-left">
                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">Join the Sequence</h3>
                <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px]">Exclusive access to artifact drops and field reports.</p>
             </div>
             <div className="flex-1 w-full max-w-md relative group/input">
                <Input 
                  placeholder="CODENAME@VAN-GUARD.COM" 
                  className="h-16 lg:h-20 rounded-full bg-background/50 border-none px-10 font-black text-xs uppercase tracking-widest shadow-2xl focus-visible:ring-2 focus-visible:ring-accent-secondary/30 transition-all placeholder:text-muted-foreground/30"
                />
                <Button className="absolute right-2 top-2 lg:top-3 h-12 lg:h-14 rounded-full bg-foreground text-background hover:bg-accent-secondary hover:text-white transition-all px-8 shadow-xl">
                   <Mail size={18} className="mr-3" />
                   <span className="font-black uppercase text-[10px] tracking-widest">Transmit</span>
                </Button>
             </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-32 flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-border/10">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground">Systems Online • Vanguard Node v4.0.2</p>
           </div>
           <div className="flex items-center gap-10">
              <Link href="/terms" className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">Legal</Link>
              <Link href="/privacy" className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">Privacy</Link>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">© 2026 VANGUARD COLLECTIVE</p>
           </div>
        </div>
      </div>
    </footer>
  );
}
