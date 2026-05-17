"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCcw, ShieldAlert, KeyRound } from "lucide-react";

export default function ProfileSecurity({ ui, onUpdate, loading }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleProcess = async (data) => {
    const success = await onUpdate(data);
    if (success) reset();
  };

  return (
    <div className="space-y-12 max-w-2xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-border/10">
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tighter italic">{ui.secTitle}</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{ui.secSub}</p>
        </div>
      </div>

      <div className="bg-accent/5 border border-border/30 p-8 rounded-[2rem] flex gap-6 items-start">
         <ShieldAlert className="w-10 h-10 text-accent-secondary shrink-0" />
         <div className="space-y-1">
            <p className="text-xs font-black uppercase tracking-widest">Security Advisory</p>
            <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">Updating your cryptographic credentials will terminate all active sessions across devices for your protection.</p>
         </div>
      </div>

      <form onSubmit={handleSubmit(handleProcess)} className="space-y-8">
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <KeyRound size={12} /> Current Password
          </Label>
          <Input 
            type="password"
            {...register("currentPassword", { required: "Current password required" })}
            placeholder="••••••••"
            className="h-14 rounded-2xl bg-accent/5 border-border/50 focus:border-accent-secondary/50 transition-all font-bold"
          />
          {errors.currentPassword && (
            <p className="text-[9px] font-black text-destructive uppercase tracking-widest">{errors.currentPassword.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <KeyRound size={12} /> New Password
          </Label>
          <Input 
            type="password"
            {...register("newPassword", { 
              required: "New password required",
              minLength: { value: 6, message: "Minimum 6 characters" }
            })}
            placeholder="••••••••"
            className="h-14 rounded-2xl bg-accent/5 border-border/50 focus:border-accent-secondary/50 transition-all font-bold"
          />
          {errors.newPassword && (
            <p className="text-[9px] font-black text-destructive uppercase tracking-widest">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <KeyRound size={12} /> Confirm Password
          </Label>
          <Input 
            type="password"
            {...register("confirmPassword", { required: "Please confirm your password" })}
            placeholder="••••••••"
            className="h-14 rounded-2xl bg-accent/5 border-border/50 focus:border-accent-secondary/50 transition-all font-bold"
          />
          {errors.confirmPassword && (
            <p className="text-[9px] font-black text-destructive uppercase tracking-widest">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="pt-6 flex justify-start">
          <Button 
            type="submit" 
            disabled={loading}
            className="h-16 px-12 rounded-full bg-accent-secondary text-white font-black uppercase tracking-widest text-[11px] hover:brightness-110 transition-all shadow-2xl disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCcw className="mr-3 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
