"use client";

import { useUploadStore } from "@/store/uploadStore";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function UploadProgressBar() {
  const { progress, isUploading, uploadName } = useUploadStore();

  return (
    <AnimatePresence>
      {isUploading && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[99999] w-[92%] max-w-sm bg-background/80 backdrop-blur-2xl border border-border/20 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)] rounded-3xl p-5 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-secondary/10 flex items-center justify-center flex-shrink-0">
                <Loader2 className="w-4 h-4 text-accent-secondary animate-spin" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
                  {uploadName}
                </span>
                <span className="text-[8px] text-muted-foreground font-semibold mt-0.5">
                  Please keep this page open
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-black text-accent-secondary italic">{progress}</span>
              <span className="text-[10px] font-black text-accent-secondary italic">%</span>
            </div>
          </div>
          
          <div className="w-full h-1.5 bg-muted/50 rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute left-0 top-0 bottom-0 bg-accent-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
