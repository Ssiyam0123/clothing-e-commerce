"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
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
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role?.name === "superadmin";

  const isSecretField = 
    type === "password" || 
    /key|token|secret|pass|password|id|pixel|credential/i.test(name) ||
    /key|token|secret|pass|password|id|pixel|credential/i.test(label);

  const [showSecret, setShowSecret] = useState(false);

  const inputType = isSecretField ? (showSecret && isSuperAdmin ? "text" : "password") : type;

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
        <Input
          id={name}
          type={inputType}
          {...register(name, {
            required: required ? `${label} is required` : false,
          })}
          placeholder={placeholder}
          className={cn(
            "bg-background/50 border-border/10 h-12 rounded-xl text-[11px] font-bold uppercase tracking-wider focus-visible:ring-rose-600/20 focus:border-rose-600 transition-all shadow-inner w-full pr-12",
            isSecretField && "font-mono normal-case tracking-normal",
            error && "border-rose-600/50 bg-rose-600/5 focus:border-rose-600"
          )}
          {...props}
        />
        {isSecretField && isSuperAdmin && (
          <button
            type="button"
            onClick={() => setShowSecret(!showSecret)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors p-1"
          >
            {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      
      {error && (
        <p className="text-[9px] font-black uppercase tracking-widest text-rose-500 ml-1 animate-in fade-in slide-in-from-top-1">
          {error.message}
        </p>
      )}
    </div>
  );
}
