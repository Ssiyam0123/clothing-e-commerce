"use client";

import { cn } from "@/lib/utils";

export default function SectionHeader({ 
  title, 
  subtitle, 
  align = "center", 
  className,
  casing = "uppercase",
  subtitleCasing = "uppercase"
}) {
  return (
    <div className={cn(
      "space-y-3 relative overflow-hidden",
      align === "center" ? "text-center" : "text-left",
      className
    )}>
      {align === "center" && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] bg-accent-secondary/5 blur-[100px] rounded-full -z-10" />
      )}
      
      <div className={cn("space-y-2", align === "center" ? "mx-auto" : "")}>
        <h2 className={cn(
          "text-[10vw] md:text-6xl lg:text-7xl font-black italic tracking-tighter leading-[0.8] text-gradient",
          casing
        )}>
          {title}
        </h2>
        {subtitle && (
          <p className={cn(
            "text-[10px] md:text-xs font-black tracking-[0.4em] text-muted-foreground max-w-2xl mx-auto italic",
            subtitleCasing
          )}>
            {subtitle}
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
