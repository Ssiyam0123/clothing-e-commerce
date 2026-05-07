"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CustomAlert({ 
  title, 
  description, 
  variant = "default", 
  onClose,
  className 
}) {
  const icons = {
    default: <Info className="h-5 w-5" />,
    destructive: <AlertCircle className="h-5 w-5" />,
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  };

  return (
    <Alert 
      variant={variant === "success" ? "default" : variant} 
      className={cn(
        "relative rounded-2xl border-border/10 bg-background/50 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-500",
        variant === "success" && "border-emerald-500/20 bg-emerald-500/5",
        className
      )}
    >
      <div className="flex gap-4">
        {icons[variant] || icons.default}
        <div className="flex-1 space-y-1">
          {title && <AlertTitle className="font-black text-xs uppercase tracking-widest">{title}</AlertTitle>}
          {description && <AlertDescription className="text-sm font-medium text-muted-foreground">{description}</AlertDescription>}
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-accent/30 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </Alert>
  );
}
