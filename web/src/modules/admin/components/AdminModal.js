"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminModal({ isOpen, onClose, title, children, className }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "bg-background/80 backdrop-blur-3xl border-border/10 rounded-[2.5rem] shadow-2xl p-0 overflow-hidden max-w-2xl",
        className
      )}>
        {/* Tactical Header */}
        <DialogHeader className="px-10 py-8 border-b border-border/5 bg-accent/5 flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-black text-foreground tracking-tighter uppercase italic leading-none">
            {title}
          </DialogTitle>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-rose-600 transition-all hover:rotate-90"
          >
            <X size={24} />
          </button>
        </DialogHeader>

        {/* Modal Data Stream Body */}
        <div className="p-10 max-h-[80vh] overflow-y-auto no-scrollbar">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
