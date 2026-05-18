"use client";

import { motion } from "framer-motion";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, DollarSign, Image, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductManageNavigation({ activeTab, product }) {
  const isReviewsOff = product?.showReviews === false;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl px-1">
      <TabsList className="bg-[#0b0813]/75 backdrop-blur-3xl border border-white/5 p-2 rounded-[2.2rem] shadow-[0_25px_60px_rgba(0,0,0,0.6),_inset_0_1px_1px_rgba(255,255,255,0.05)] flex items-center justify-around overflow-hidden relative group w-full h-16 md:h-20 gap-2">
        {/* Glowing cyber gradient line at the top border */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        
        {/* Cybernetic ambient background glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent-secondary/5 -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Stock Levels Trigger */}
        <TabsTrigger
          value="stock"
          className={cn(
            "relative flex items-center justify-center gap-3 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 flex-1 shadow-none h-full",
            activeTab === "stock"
              ? "bg-foreground text-background border-foreground shadow-2xl scale-105 data-[state=active]:bg-foreground data-[state=active]:text-background"
              : "bg-background/50 border-border/10 text-muted-foreground hover:border-primary/40 hover:bg-background data-[state=active]:bg-background/50 data-[state=active]:text-muted-foreground"
          )}
        >
          <Box className={cn(
            "w-4 h-4 transition-all duration-500",
            activeTab === "stock" ? "text-background scale-110" : "text-primary scale-100"
          )} />
          <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">
            Stock
          </span>
          {activeTab === "stock" && (
            <motion.div 
              layoutId="active-product-tab" 
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" 
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </TabsTrigger>

        {/* Pricing Metrics Trigger */}
        <TabsTrigger
          value="pricing"
          className={cn(
            "relative flex items-center justify-center gap-3 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 flex-1 shadow-none h-full",
            activeTab === "pricing"
              ? "bg-foreground text-background border-foreground shadow-2xl scale-105 data-[state=active]:bg-foreground data-[state=active]:text-background"
              : "bg-background/50 border-border/10 text-muted-foreground hover:border-primary/40 hover:bg-background data-[state=active]:bg-background/50 data-[state=active]:text-muted-foreground"
          )}
        >
          <DollarSign className={cn(
            "w-4 h-4 transition-all duration-500",
            activeTab === "pricing" ? "text-background scale-110" : "text-primary scale-100"
          )} />
          <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">
            Pricing
          </span>
          {activeTab === "pricing" && (
            <motion.div 
              layoutId="active-product-tab" 
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" 
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </TabsTrigger>

        {/* Product Images Trigger */}
        <TabsTrigger
          value="images"
          className={cn(
            "relative flex items-center justify-center gap-3 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 flex-1 shadow-none h-full",
            activeTab === "images"
              ? "bg-foreground text-background border-foreground shadow-2xl scale-105 data-[state=active]:bg-foreground data-[state=active]:text-background"
              : "bg-background/50 border-border/10 text-muted-foreground hover:border-primary/40 hover:bg-background data-[state=active]:bg-background/50 data-[state=active]:text-muted-foreground"
          )}
        >
          <Image className={cn(
            "w-4 h-4 transition-all duration-500",
            activeTab === "images" ? "text-background scale-110" : "text-primary scale-100"
          )} />
          <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">
            Images
          </span>
          {activeTab === "images" && (
            <motion.div 
              layoutId="active-product-tab" 
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" 
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </TabsTrigger>

        {/* Reviews Trigger */}
        <TabsTrigger
          value="reviews"
          className={cn(
            "relative flex items-center justify-center gap-3 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 flex-1 shadow-none h-full",
            activeTab === "reviews"
              ? "bg-foreground text-background border-foreground shadow-2xl scale-105 data-[state=active]:bg-foreground data-[state=active]:text-background"
              : "bg-background/50 border-border/10 text-muted-foreground hover:border-primary/40 hover:bg-background data-[state=active]:bg-background/50 data-[state=active]:text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            <MessageSquare className={cn(
              "w-4 h-4 transition-all duration-500",
              activeTab === "reviews" ? "text-background scale-110" : "text-primary scale-100"
            )} />
            <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">
              Reviews
            </span>
          </div>

          {/* Interactive neon badge for reviews active/disabled status */}
          <span className={cn(
            "absolute top-2 right-2 w-1.5 h-1.5 rounded-full transition-all duration-500",
            isReviewsOff 
              ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]" 
              : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
          )} />

          {activeTab === "reviews" && (
            <motion.div 
              layoutId="active-product-tab" 
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" 
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </TabsTrigger>
      </TabsList>
    </div>
  );
}
