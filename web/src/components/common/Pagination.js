"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((p, index) => (
      <div key={index}>
        {p === "..." ? (
          <div className="w-12 h-12 flex items-center justify-center text-muted-foreground">
            <MoreHorizontal size={16} />
          </div>
        ) : (
          <Button
            variant={page === p ? "default" : "outline"}
            onClick={() => onPageChange(p)}
            className={cn(
              "w-12 h-12 rounded-2xl font-black text-[10px] uppercase transition-all duration-500",
              page === p 
                ? "bg-foreground text-background shadow-xl shadow-foreground/10 hover:bg-foreground/90 hover:scale-105" 
                : "border-border bg-muted/50 text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground"
            )}
          >
            {p.toString().padStart(2, "0")}
          </Button>
        )}
      </div>
    ));
  };

  return (
    <div className={cn("flex items-center justify-center gap-4 py-10 sm:py-20", className)}>
      <Button
        variant="outline"
        size="icon"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="w-12 h-12 rounded-2xl border-border bg-muted/50 text-muted-foreground hover:bg-foreground hover:text-background disabled:opacity-20 transition-all duration-300"
      >
        <ChevronLeft size={20} />
      </Button>

      <div className="flex items-center gap-2">
        {renderPageNumbers()}
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="w-12 h-12 rounded-2xl border-border bg-muted/50 text-muted-foreground hover:bg-foreground hover:text-background disabled:opacity-20 transition-all duration-300"
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  );
}
