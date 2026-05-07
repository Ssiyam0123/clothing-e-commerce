"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { swalToast, swalError } from "@/utils/swal";

export default function Newsletter({ lang = "en" }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
      swalToast("Transmission Successful", "success");
      setEmail("");
    } catch (err) {
      swalError("Sync Failed", "Could not join the sequence.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {isSuccess ? (
        <div className="flex flex-col items-center gap-6 p-10 rounded-[3rem] bg-accent/20 border border-accent-secondary/10">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
            <CheckCircle2 size={32} />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-foreground">Entry Secured</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-secondary/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 h-5 w-5" />
              <Input
                type="email"
                placeholder="CODENAME@VAN-GUARD.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-16 rounded-full bg-background/50 border-none px-16 font-black text-xs uppercase tracking-widest shadow-2xl focus-visible:ring-2 focus-visible:ring-accent-secondary/30 transition-all placeholder:text-muted-foreground/20"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-16 rounded-full bg-foreground text-background hover:bg-accent-secondary hover:text-white transition-all px-10 shadow-2xl shadow-foreground/5 min-w-[180px]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                   Syncing...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <Send size={16} />
                  <span className="font-black uppercase text-[10px] tracking-[0.2em]">Transmit</span>
                </span>
              )}
            </Button>
          </div>
          <p className="mt-6 text-[8px] font-bold text-muted-foreground/30 uppercase tracking-[0.4em] text-center">
            By joining, you agree to our Protocol and Privacy Framework.
          </p>
        </form>
      )}
    </div>
  );
}
