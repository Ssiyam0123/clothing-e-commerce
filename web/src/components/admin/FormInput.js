"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function FormInput({
  label,
  name,
  register,
  errors,
  type = "text",
  required = false,
  placeholder = "",
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
      
      <Input
        id={name}
        type={type}
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
        placeholder={placeholder}
        className={cn(
          "bg-background/50 border-border/10 h-12 rounded-xl text-[11px] font-bold uppercase tracking-wider focus-visible:ring-rose-600/20 focus:border-rose-600 transition-all shadow-inner",
          error && "border-rose-600/50 bg-rose-600/5 focus:border-rose-600"
        )}
        {...props}
      />
      
      {error && (
        <p className="text-[9px] font-black uppercase tracking-widest text-rose-500 ml-1 animate-in fade-in slide-in-from-top-1">
          {error.message}
        </p>
      )}
    </div>
  );
}
