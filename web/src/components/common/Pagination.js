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
    // Adjust visible pages based on screen size could be done with CSS or state
    // For simplicity, we'll keep the logic and use responsive sizing in tailwind
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic to keep current page in focus
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages.map((p, index) => (
      <div key={index} className={cn(
        // Hide "..." on mobile to save space
        p === "..." && "hidden sm:flex",
        // Show only current, first, and last on extreme mobile
        typeof p === "number" && p !== 1 && p !== totalPages && p !== page && "hidden sm:flex"
      )}>
        {p === "..." ? (
          <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-muted-foreground">
            <MoreHorizontal size={14} />
          </div>
        ) : (
          <Button
            variant={page === p ? "default" : "outline"}
            onClick={() => onPageChange(p)}
            className={cn(
              "w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl font-black text-[8px] sm:text-[10px] uppercase transition-all duration-500",
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
    <div className={cn("flex items-center justify-center gap-1.5 sm:gap-4 py-8 sm:py-20", className)}>
      <Button
        variant="outline"
        size="icon"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl border-border bg-muted/50 text-muted-foreground hover:bg-foreground hover:text-background disabled:opacity-20 transition-all duration-300"
      >
        <ChevronLeft size={14} className="sm:hidden" />
        <ChevronLeft size={20} className="hidden sm:block" />
      </Button>

      <div className="flex items-center gap-1 sm:gap-2">
        {renderPageNumbers()}
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl border-border bg-muted/50 text-muted-foreground hover:bg-foreground hover:text-background disabled:opacity-20 transition-all duration-300"
      >
        <ChevronRight size={14} className="sm:hidden" />
        <ChevronRight size={20} className="hidden sm:block" />
      </Button>
    </div>
  );
}
