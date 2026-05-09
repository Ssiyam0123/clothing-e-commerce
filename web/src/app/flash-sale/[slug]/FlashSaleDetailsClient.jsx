"use client";

import { useAppStore } from "@/store/appStore";
import FlashSaleBanner from "@/components/store/FlashSaleBanner";
import CountdownTimer from "@/components/store/CountdownTimer";
import ProductCard from "@/components/common/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Clock, ShieldCheck, ArrowLeft, Timer, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function FlashSaleDetailsClient({ sale }) {
  const { isMounted } = useAppStore();
  const isLive = new Date(sale.startDate) <= new Date();

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-background  overflow-x-hidden">
      {/* 🧭 Navigation Header */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-12 mb-8 sm:mb-12">
        <Button variant="ghost" asChild className="group h-10 px-0 hover:bg-transparent text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-accent-secondary transition-colors">
          <Link href="/flash-sale">
            <ArrowLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" /> 
            Back to hub
          </Link>
        </Button>
      </div>

      {/* 🖼️ Strategic Hero Section */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-12 mb-12 sm:mb-24">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <FlashSaleBanner flashSale={sale} />
        </motion.div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-12">
        {/* 📟 Intelligence Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 sm:mb-24 gap-10 sm:gap-16 border-b border-border/10 pb-12 sm:pb-20">
          <div className="space-y-6 sm:space-y-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-accent-secondary text-white border-none px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest animate-pulse shadow-lg shadow-accent-secondary/20">
                {isLive ? "Active Drop" : "Scheduled"}
              </Badge>
              {sale.discount && (
                <Badge variant="outline" className="border-accent-secondary/30 text-accent-secondary px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest bg-accent-secondary/5">
                   {sale.discount}% Discount Protocol
                </Badge>
              )}
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl sm:text-7xl lg:text-8xl xl:text-[10rem] font-black uppercase italic tracking-tighter leading-[0.85] text-gradient"
            >
              {sale.name}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base sm:text-2xl text-muted-foreground font-medium leading-relaxed max-w-3xl opacity-80"
            >
              {sale.description || "Accessing limited duration tactical sequence. Secure curated artifacts before protocol termination."}
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-full lg:w-auto"
          >
            {!isLive ? (
              <div className="p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] bg-accent/10 border border-border/10 shadow-3xl backdrop-blur-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Clock size={80} />
                 </div>
                 <CountdownTimer 
                    targetDate={sale.startDate} 
                    label="Initiation In"
                    className="!items-start"
                 />
              </div>
            ) : (
              <div className="p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] bg-emerald-500/5 border border-emerald-500/10 shadow-3xl backdrop-blur-3xl flex items-center gap-8 group">
                 <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-3xl sm:rounded-[2rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-700">
                    <ShieldCheck size={40} className="sm:w-12 sm:h-12" />
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-emerald-500/60">System Status</p>
                    <p className="text-2xl sm:text-4xl font-black uppercase italic tracking-tighter text-emerald-500">Live & Secure</p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                       <Timer size={14} />
                       <p className="text-[10px] font-bold uppercase tracking-widest">Ending Soon</p>
                    </div>
                 </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* 📦 Artifact Manifest (Product Grid) */}
        <div className="space-y-12 sm:space-y-20">
          <div className="flex items-center gap-6">
             <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ShoppingBag size={20} />
             </div>
             <div>
                <h3 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter">Artifact Manifest</h3>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">Verified {sale.products?.length || 0} Units</p>
             </div>
             <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10 lg:gap-12">
            {sale.products?.map((product, idx) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={product} isFlashSale={true} />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* End of Line Signifier */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 sm:mt-64 flex flex-col items-center text-center gap-10 sm:gap-16"
        >
           <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-primary/20 animate-pulse" />
              <Zap size={48} className="text-primary relative z-10 sm:w-16 sm:h-16" />
           </div>
           <div className="space-y-4">
              <div className="h-px w-40 sm:w-64 bg-gradient-to-r from-transparent via-border to-transparent" />
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.6em] text-muted-foreground opacity-40 italic">End of Manifest Sequence</p>
           </div>
           <Link href="/flash-sale">
              <Button variant="outline" className="rounded-full px-12 h-14 font-black uppercase tracking-[0.3em] text-[10px] border-border hover:bg-foreground hover:text-background transition-all">
                 Return to hub
              </Button>
           </Link>
        </motion.div>
      </div>
    </main>
  );
}
