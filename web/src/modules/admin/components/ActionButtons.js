"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ActionButtons({ editUrl, onDelete, className }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button 
        asChild 
        variant="outline" 
        size="icon" 
        className="h-10 w-10 rounded-xl border-border/10 hover:border-foreground/50 hover:bg-foreground hover:text-background bg-background/50 transition-all active:scale-95"
      >
        <Link href={editUrl}>
          <Edit3 size={16} />
        </Link>
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onDelete}
        className="h-10 w-10 rounded-xl border-border/10 hover:border-rose-600/50 hover:bg-rose-600 hover:text-white bg-background/50 transition-all active:scale-95"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
}
