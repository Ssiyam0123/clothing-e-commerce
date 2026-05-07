"use client";

import { cn } from "@/lib/utils";

export default function SectionHeader({ title, subtitle, align = "center", className }) {
  return (
    <div className={cn(
      "space-y-6 relative overflow-hidden",
      align === "center" ? "text-center" : "text-left",
      className
    )}>
      {align === "center" && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] bg-accent-secondary/5 blur-[100px] rounded-full -z-10" />
      )}
      
      <div className={cn("space-y-4", align === "center" ? "mx-auto" : "")}>
        <h2 className="text-[12vw] md:text-8xl lg:text-9xl font-black uppercase italic tracking-tighter leading-[0.8] text-gradient">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-muted-foreground max-w-2xl mx-auto italic">
            // {subtitle}
          </p>
        )}
      </div>

      <div className={cn(
        "flex items-center gap-4",
        align === "center" ? "justify-center" : "justify-start"
      )}>
        <div className="h-px w-20 bg-accent-secondary/30" />
        <div className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.5)]" />
        <div className="h-px w-20 bg-accent-secondary/30" />
      </div>
    </div>
  );
}
