"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export default function FormSelect({
  label,
  name,
  register,
  errors,
  options,
  required = false,
  placeholder = "Select an option",
  className,
  ...props
}) {
  const error = errors[name];

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label 
          htmlFor={name}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <select
          id={name}
          {...register(name, {
            required: required ? `${label} is required` : false,
          })}
          className={cn(
            "appearance-none w-full bg-background/50 border border-border/10 h-12 px-5 rounded-xl text-[11px] font-bold uppercase tracking-wider focus:ring-2 focus:ring-rose-600/20 focus:border-rose-600 transition-all shadow-inner outline-none text-foreground",
            error && "border-rose-600/50 bg-rose-600/5",
          )}
          {...props}
        >
          <option value="" className="bg-zinc-900 text-muted-foreground">{placeholder}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-zinc-900 text-foreground">
              {opt.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
          <ChevronDown size={14} />
        </div>
      </div>
      
      {error && (
        <p className="text-[9px] font-black uppercase tracking-widest text-rose-500 ml-1 animate-in fade-in slide-in-from-top-1">
          {error.message}
        </p>
      )}
    </div>
  );
}
