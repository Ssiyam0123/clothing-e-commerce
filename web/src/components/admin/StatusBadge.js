"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function StatusBadge({ value, className }) {
  if (!value) return null;

  const normalizedValue = value.toLowerCase();

  const getStatusStyles = (val) => {
    switch (val) {
      case "delivered":
      case "paid":
      case "completed":
      case "active":
      case "visible":
      case "in stock":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "shipped":
      case "processing":
      case "synced":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "pending":
      case "unpaid":
      case "low stock":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "cancelled":
      case "failed":
      case "inactive":
      case "hidden":
      case "out of stock":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border shadow-none",
        getStatusStyles(normalizedValue),
        className
      )}
    >
      <span className="mr-1.5 h-1 w-1 rounded-full bg-current animate-pulse"></span>
      {value}
    </Badge>
  );
}
