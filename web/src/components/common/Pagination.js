"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Pagination({
  currentPage,
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
      if (currentPage > 3) pages.push("...");
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((page, index) => (
      <div key={index}>
        {page === "..." ? (
          <div className="w-12 h-12 flex items-center justify-center text-muted-foreground">
            <MoreHorizontal size={16} />
          </div>
        ) : (
          <Button
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            className={cn(
              "w-12 h-12 rounded-2xl font-black text-[10px] uppercase transition-all duration-500",
              currentPage === page 
                ? "bg-foreground text-background shadow-xl shadow-foreground/10" 
                : "border-border/10 bg-accent/20 hover:bg-foreground hover:text-background"
            )}
          >
            {page.toString().padStart(2, "0")}
          </Button>
        )}
      </div>
    ));
  };

  return (
    <div className={cn("flex items-center justify-center gap-4 py-20", className)}>
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-12 h-12 rounded-2xl border-border/10 bg-accent/20 hover:bg-foreground hover:text-background disabled:opacity-20"
      >
        <ChevronLeft size={20} />
      </Button>

      <div className="flex items-center gap-2">
        {renderPageNumbers()}
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-12 h-12 rounded-2xl border-border/10 bg-accent/20 hover:bg-foreground hover:text-background disabled:opacity-20"
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  );
}
