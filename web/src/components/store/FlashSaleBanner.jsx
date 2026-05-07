"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import CountdownTimer from "./CountdownTimer";
import { getImageUrl } from "@/utils/imageUtils";
import { useAppStore } from "@/store/appStore";
import { Badge } from "@/components/ui/badge";
import { Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const DICTIONARY = {
  en: {
    drop: "Exclusive Drop",
    defaultDesc:
      "Limited time premium offer. Once it's gone, it's gone forever.",
    startsIn: "Sequence Inbound",
    endsIn: "Protocol Termination",
    discountLabel: "Sequence \n Advantage",
    live: "PROTOCOL LIVE",
  },
  bn: {
    drop: "এক্সক্লুসিভ ড্রপ",
    defaultDesc: "সীমিত সময়ের প্রিমিয়াম অফার। স্টক শেষ হওয়ার আগেই লুফে নিন।",
    startsIn: "শুরু হতে",
    endsIn: "শেষ হতে",
    discountLabel: "অতিরিক্ত \n ছাড়",
    live: "লাইভ",
  },
};

export default function FlashSaleBanner({ flashSale, onExpire }) {
  const { lang, isMounted } = useAppStore();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY.en, [lang]);
  const isBn = lang === "bn";
  const [isActive, setIsActive] = useState(false);

  if (!isMounted || !flashSale) return null;

  const now = new Date();
  const startDate = new Date(flashSale.startDate);
  const endDate = new Date(flashSale.endDate);
  const hasStarted = now >= startDate;
  const hasEnded = now >= endDate;

  let status = "";
  let targetDate = null;
  let countdownLabel = "";

  if (!hasStarted) {
    status = "upcoming";
    targetDate = startDate;
    countdownLabel = ui.startsIn;
  } else if (hasStarted && !hasEnded) {
    status = "active";
    targetDate = endDate;
    countdownLabel = ui.endsIn;
    if (!isActive) setIsActive(true);
  } else {
    status = "ended";
  }

  const handleExpire = () => {
    if (status === "upcoming") {
      window.location.reload(); 
    } else if (status === "active") {
      setIsActive(false);
      if (onExpire) onExpire();
    }
  };

  return (
    <div className="relative bg-background border border-border/10 rounded-[4rem] overflow-hidden shadow-2xl group transition-all duration-1000">
      {/* Dynamic Aura */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-secondary/5 rounded-full blur-[150px] pointer-events-none group-hover:bg-accent-secondary/10 transition-all duration-1000" />
      
      {flashSale.bannerImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={getImageUrl(flashSale.bannerImage, 1920, 400)}
            alt={flashSale.name}
            fill
            className="object-cover opacity-20 grayscale transition-transform duration-1000 group-hover:scale-105 group-hover:grayscale-0"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        </div>
      )}

      <div className="relative z-10 p-10 md:p-20 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-16 md:gap-24">
        <div className="text-center lg:text-left max-w-2xl w-full space-y-10">
          {/* Status Indicator */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <div className="flex items-center gap-3 glass px-5 py-2 rounded-full border-border/10 shadow-xl">
               <div className={cn(
                 "w-2 h-2 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.8)]",
                 status === "active" ? "bg-accent-secondary animate-pulse" : "bg-amber-500"
               )} />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">
                 {status === "active" ? ui.live : ui.drop}
               </span>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className={cn(
              "text-4xl md:text-6xl lg:text-9xl font-black text-foreground uppercase italic leading-none drop-shadow-2xl",
              isBn ? "tracking-tight" : "tracking-tighter"
            )}>
              {flashSale.name}
            </h2>

            <p className="text-muted-foreground text-sm md:text-xl font-medium tracking-wide leading-relaxed max-w-lg mx-auto lg:mx-0">
              {flashSale.description || ui.defaultDesc}
            </p>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-8 pt-6">
            <div className="flex flex-col">
               <span className="text-6xl md:text-8xl font-black text-foreground tracking-tighter leading-none">
                -{flashSale.discount}%
               </span>
            </div>
            <div className="h-20 w-px bg-border/20" />
            <div className="space-y-2">
               <Sparkles className="text-accent-secondary" size={24} />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-pre-line leading-tight block">
                {ui.discountLabel}
               </span>
            </div>
          </div>
        </div>

        {/* Intelligence Unit (Countdown) */}
        <div className="w-full lg:w-auto">
          <div className="relative group/countdown">
            <div className="absolute -inset-4 bg-accent-secondary/10 rounded-[3.5rem] blur-2xl opacity-0 group-hover/countdown:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-background/50 backdrop-blur-3xl border border-border/10 p-10 md:p-16 rounded-[3rem] shadow-2xl flex flex-col items-center">
              {targetDate && (
                <CountdownTimer
                  targetDate={targetDate}
                  onExpire={handleExpire}
                  label={countdownLabel}
                />
              )}
              {status === "ended" && (
                <div className="text-center py-4">
                  <Zap className="text-muted-foreground mx-auto mb-4 opacity-20" size={48} />
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em]">
                    Sequence Terminated
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
