"use client";

import { useAppStore } from "@/store/appStore";
import FlashSaleBanner from "@/components/store/FlashSaleBanner";
import CountdownTimer from "@/components/store/CountdownTimer";
import ProductCard from "@/components/common/ProductCard";
import { motion } from "framer-motion";
import { Zap, Clock, ChevronLeft, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function FlashSaleDetailsClient({ sale }) {
  const { isMounted } = useAppStore();
  const isLive = new Date(sale.startDate) <= new Date();

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-background pb-24 sm:pb-40 pt-20 sm:pt-32">
      {/* 🧭 Navigation Header */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-12 mb-8 sm:mb-12">
        <Button variant="ghost" asChild className="group h-10 px-0 hover:bg-transparent text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-accent-secondary transition-colors">
          <Link href="/flash-sale">
            <ArrowLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" /> 
            Abort To Hub
          </Link>
        </Button>
      </div>

      {/* 🖼️ Strategic Hero Section */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-12 mb-16 sm:mb-24">
        <FlashSaleBanner flashSale={sale} />
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-12">
        {/* 📟 Intelligence Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 sm:mb-20 gap-8 sm:gap-12 border-b border-border/10 pb-12 sm:pb-16">
          <div className="space-y-4 sm:space-y-6 max-w-3xl">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isLive ? "bg-accent-secondary animate-pulse shadow-[0_0_15px_rgba(244,63,94,1)]" : "bg-amber-500"
              )} />
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] text-foreground">
                {isLive ? "DEPLOYMENT_LIVE" : "SEQUENCE_PENDING"}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-7xl lg:text-8xl xl:text-9xl font-black uppercase italic tracking-tighter leading-[0.9] text-gradient">
              {sale.name}
            </h1>
            
            <p className="text-sm sm:text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
              {sale.description || "Accessing limited duration tactical sequence. Secure curated artifacts before protocol termination."}
            </p>
          </div>

          {/* Integration of Shared Countdown Protocol */}
          {!isLive && (
            <div className="w-full lg:w-auto p-8 sm:p-12 rounded-[2.5rem] bg-accent/20 border border-border/10 shadow-2xl backdrop-blur-xl">
               <CountdownTimer 
                  targetDate={sale.startDate} 
                  label="Sequence Initiation"
                  className="!items-start"
               />
            </div>
          )}
          
          {isLive && (
            <div className="w-full lg:w-auto p-8 sm:p-12 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 shadow-2xl backdrop-blur-xl flex items-center gap-6">
               <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <ShieldCheck size={32} />
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Secure Protocol</p>
                  <p className="text-xl font-black uppercase italic tracking-tighter">Live Handover</p>
               </div>
            </div>
          )}
        </div>

        {/* 📦 Artifact Manifest (Product Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10">
          {sale.products?.map((product, idx) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.7 }}
            >
              <ProductCard product={product} isFlashSale={true} />
            </motion.div>
          ))}
        </div>
        
        {/* End of Line Signifier */}
        <div className="mt-24 sm:mt-40 flex flex-col items-center text-center gap-6 opacity-20">
           <Zap size={32} className="text-muted-foreground" />
           <div className="h-px w-32 bg-gradient-to-r from-transparent via-border to-transparent" />
           <p className="text-[9px] font-black uppercase tracking-[0.5em]">End of Manifest</p>
        </div>
      </div>
    </main>
  );
}
