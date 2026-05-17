"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { swalToast, swalError } from "@/utils/swal";
import { useAuthStore } from "@/modules/client/auth/lib/authStore";
import { useAppStore } from "@/store/appStore";
import { getTranslation } from "@/utils/typography/handler";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuthStore();
  const { lang } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = useMemo(() => getTranslation('auth', lang), [lang]);

  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "true") {
      swalToast(t.emailVerified, "success");
    }
  }, [searchParams, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return swalError(t.missingFields, t.provideCredentials);
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      swalToast(t.loginSuccess, "success");
      router.push("/");
    } catch (err) {
      swalError(
        t.loginFailed,
        err.response?.data?.message || t.invalidCredentials,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 sm:p-12 bg-background border border-border/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-secondary/0 via-accent-secondary/50 to-accent-secondary/0" />
      
      <div className="text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-foreground uppercase italic tracking-tighter"
        >
          {t.loginTitle}
        </motion.h1>
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em] mt-3 opacity-60">
          {t.loginSub}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">
            {t.emailLabel}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-accent/10 border border-border/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-accent-secondary/30 transition-all text-sm font-bold placeholder:text-muted-foreground/20"
            placeholder="IDENTITY@VANGUARD.COM"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">
            {t.passwordLabel}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-accent/10 border border-border/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-accent-secondary/30 transition-all text-sm font-bold placeholder:text-muted-foreground/20"
            placeholder="••••••••"
          />
        </div>

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-[9px] font-black text-muted-foreground hover:text-accent-secondary transition-colors uppercase tracking-widest"
          >
            {t.forgotPassword}
          </Link>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full bg-foreground text-background py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:bg-accent-secondary hover:text-white transition-all disabled:opacity-50"
        >
          {isSubmitting ? t.signingIn : t.signIn}
        </motion.button>
      </form>

      <div className="mt-10 pt-8 border-t border-border/10 text-center">
        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-60">
          {t.noAccount}{" "}
          <Link
            href="/register"
            className="text-foreground hover:text-accent-secondary border-b border-border/20 pb-0.5 ml-2 transition-colors"
          >
            {t.createAccount}
          </Link>
        </p>
      </div>
    </div>
  );
}
