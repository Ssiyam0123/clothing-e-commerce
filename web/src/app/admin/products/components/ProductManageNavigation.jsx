"use client";

import { motion } from "framer-motion";
import { Tabs as TabsPrimitive } from "radix-ui";
import { Box, DollarSign, Image, MessageSquare, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductManageNavigation({ activeTab, product }) {
  const isReviewsOff = product?.showReviews === false;

  const tabs = [
    { id: "stock", label: "Stock", icon: Box },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "images", label: "Images", icon: Image },
    { id: "reviews", label: "Reviews", icon: MessageSquare, isReviewsDot: true },
    { id: "seo", label: "SEO", icon: Search },
  ];

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50">
      <TabsPrimitive.List className="max-w-2xl mx-auto bg-background/80 border border-border/10 p-1.5 rounded-[2rem] overflow-hidden flex items-center justify-between relative group w-full h-auto gap-1">
        {/* Subtle ambient gradient overlay inside the nav */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent-secondary/5 -z-10 rounded-[2rem]" />

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <TabsPrimitive.Trigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "relative flex flex-col items-center gap-1 py-2 px-1 rounded-2xl transition-all duration-500 min-w-[60px] md:min-w-[75px] flex-1 text-center border-0 bg-transparent shadow-none hover:text-foreground cursor-pointer select-none outline-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground",
                isActive ? "text-foreground font-black" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="unifiedActiveProductTabBg"
                  className="absolute inset-0 bg-accent/10 -z-10 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <div className="relative">
                <Icon className={cn(
                  "w-3.5 h-3.5 md:w-4.5 md:h-4.5 transition-all duration-500",
                  isActive ? "text-accent-secondary scale-110 animate-pulse-subtle" : "group-hover:scale-110"
                )} />
                {/* Special notification dot for reviews status */}
                {tab.isReviewsDot && (
                  <span className={cn(
                    "absolute -top-1 -right-1 w-2 h-2 rounded-full border border-background",
                    isReviewsOff ? "bg-rose-500" : "bg-emerald-500"
                  )} />
                )}
              </div>

              <span className={cn(
                "text-[6px] md:text-[8px] font-black uppercase tracking-wider block truncate w-full",
                isActive ? "opacity-100" : "opacity-60"
              )}>
                {tab.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="unifiedActiveProductIndicator"
                  className="absolute -bottom-1 w-1 h-1 bg-accent-secondary rounded-full"
                />
              )}
            </TabsPrimitive.Trigger>
          );
        })}
      </TabsPrimitive.List>
    </div>
  );
}
