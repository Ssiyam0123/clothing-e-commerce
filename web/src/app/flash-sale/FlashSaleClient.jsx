"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/appStore";
import { useFlashSales } from "@/hooks/useFlashSale";
import FlashSaleBanner from "@/components/store/FlashSaleBanner";
import ProductCard from "@/components/common/ProductCard";
import { Clock, Zap, ArrowRight, Timer, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ⏱️ SUB-COMPONENT: Real-time Countdown Timer (Premium Vanguard Style)
const CountdownTimer = ({ targetDate, lang }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const labels = lang === "bn" ? ["দিন", "ঘণ্টা", "মিনিট", "সেকেন্ড"] : ["DAYS", "HRS", "MIN", "SEC"];

  return (
    <div className="flex gap-3">
      {[
        { val: timeLeft.days, label: labels[0] },
        { val: timeLeft.hours, label: labels[1] },
        { val: timeLeft.minutes, label: labels[2] },
        { val: timeLeft.seconds, label: labels[3] },
      ].map((unit, i) => (
        <div
          key={i}
          className="flex flex-col items-center glass border border-white/10 px-4 py-3 rounded-2xl min-w-[70px] shadow-2xl relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="text-2xl font-black tracking-tighter leading-none text-foreground relative z-10">
            {unit.val < 10 ? `0${unit.val}` : unit.val}
          </span>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2 relative z-10">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const DICTIONARY = {
  en: {
    emptyTitle: "The Vault is Closed",
    explore: "Explore Collection",
    activeTitle: "Live Drops Active",
    upcomingTitle: "Upcoming Sequences",
    viewDetails: "Inspect Drop",
    liveNow: "Protocol Live",
    startsOn: "Sequence Initiation",
  },
  bn: {
    emptyTitle: "কালেকশনটি বন্ধ আছে",
    explore: "কালেকশন দেখুন",
    activeTitle: "অফারটি চলছে",
    upcomingTitle: "শীঘ্রই আসছে",
    viewDetails: "ড্রপ দেখুন",
    liveNow: "লাইভ চলছে",
    startsOn: "শুরু হবে",
  },
};

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FlashSaleClient() {
  const { lang } = useAppStore();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY.en, [lang]);
  const { allActiveSales, isLoading } = useFlashSales();
  const now = useMemo(() => new Date(), []);

  const { activeSales, upcomingSales } = useMemo(() => {
    if (!allActiveSales || !Array.isArray(allActiveSales))
      return { activeSales: [], upcomingSales: [] };
    const active = allActiveSales.filter((s) => new Date(s.startDate) <= now && new Date(s.endDate) > now);
    const upcoming = allActiveSales.filter((s) => new Date(s.startDate) > now);
    return { activeSales: active, upcomingSales: upcoming };
  }, [allActiveSales, now]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <Zap className="text-accent-secondary animate-pulse" size={48} />
           <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Syncing Flash Protocol...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-40 pt-24 md:pt-32 space-y-24 md:space-y-40">
      {/* 🔥 ACTIVE DROPS SECTION */}
      {activeSales.length > 0 ? (
        activeSales.map((sale) => (
          <section key={sale._id} className="max-w-screen-2xl mx-auto px-4 md:px-12">
            <FlashSaleBanner flashSale={sale} />
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mt-16 mb-12 border-b border-border/10 pb-12">
              <div className="space-y-2 text-center md:text-left">
                <Badge variant="outline" className="px-4 py-1.5 rounded-full border-accent-secondary/30 text-accent-secondary font-black text-[9px] uppercase tracking-[0.2em] bg-accent-secondary/5">
                   {ui.liveNow}
                </Badge>
                <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                  {sale.name}
                </h2>
              </div>
              
              <Link href={`/flash-sale/${sale.slug}`} passHref>
                <Button size="xl" className="group rounded-[2rem] bg-foreground text-background font-black uppercase tracking-widest text-xs h-16 px-12 shadow-2xl hover:bg-accent-secondary hover:text-white transition-all duration-500">
                  {ui.viewDetails}
                  <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={18} />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
              {sale.products?.slice(0, 8).map((p) => (
                <ProductCard key={p._id} product={p} isFlashSale={true} />
              ))}
            </div>
          </section>
        ))
      ) : upcomingSales.length === 0 ? (
        <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
           <div className="w-24 h-24 rounded-[2rem] glass flex items-center justify-center mb-12">
              <Sparkles className="text-muted-foreground opacity-20" size={40} />
           </div>
           <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter mb-8 opacity-20">
              {ui.emptyTitle}
           </h2>
           <Link href="/products">
              <Button variant="outline" className="rounded-full px-12 h-14 font-black uppercase tracking-[0.3em] text-[10px]">
                 {ui.explore}
              </Button>
           </Link>
        </section>
      ) : null}

      {/* ⏳ UPCOMING DROPS SECTION */}
      {upcomingSales.length > 0 && (
        <section className="relative py-40 overflow-hidden">
          <div className="absolute inset-0 bg-accent/5 -z-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border/10 to-transparent" />
          
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center text-center gap-6 mb-24">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-accent-secondary shadow-xl">
                 <Clock size={32} />
              </div>
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                {ui.upcomingTitle}
              </h3>
              <div className="h-1 w-20 bg-accent-secondary/20 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              {upcomingSales.map((sale) => (
                <Card
                  key={sale._id}
                  className="group relative h-[450px] rounded-[3rem] md:rounded-[4rem] overflow-hidden border border-border/10 hover:border-accent-secondary/40 transition-all duration-1000 shadow-2xl bg-transparent"
                >
                  <Link href={`/flash-sale/${sale?.slug}`} className="absolute inset-0 z-20" />
                  
                  {/* Background Image Effect */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={sale.bannerImage || "/api/placeholder/800/400"}
                      className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[3s]"
                      alt={sale.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  </div>

                  <CardContent className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end z-10">
                    <div className="space-y-4 md:space-y-6">
                      <div className="flex items-center gap-4">
                         <Badge className="bg-accent-secondary/10 text-accent-secondary border-none font-black text-[8px] uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">
                            {ui.startsOn}
                         </Badge>
                         <div className="h-px flex-1 bg-border/10" />
                      </div>
                      
                      <CardTitle className="text-3xl md:text-6xl font-black text-foreground uppercase italic leading-none group-hover:translate-x-4 transition-transform duration-700">
                        {sale.name}
                      </CardTitle>

                      <div className="pt-4 group-hover:scale-105 transition-transform duration-700 origin-left">
                        <CountdownTimer
                          targetDate={sale.startDate}
                          lang={lang}
                        />
                      </div>

                      <CardFooter className="p-0 flex items-center gap-4 pt-8 border-t border-border/10">
                        <Timer size={14} className="text-accent-secondary" />
                        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                          {new Date(sale.startDate).toLocaleDateString(
                            lang === "bn" ? "bn-BD" : "en-US",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </p>
                      </CardFooter>
                    </div>
                  </CardContent>

                  <div className="absolute top-8 right-8 md:top-12 md:right-12 w-12 h-12 md:w-16 md:h-16 rounded-[1.2rem] md:rounded-[1.5rem] glass flex items-center justify-center text-foreground group-hover:bg-accent-secondary group-hover:text-white transition-all duration-500 shadow-2xl z-30">
                    <Zap size={24} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border/10 to-transparent" />
        </section>
      )}
    </div>
  );
}
