"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const { forgetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await forgetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#fcfcfc] dark:bg-[#050505] px-6 text-center transition-colors duration-500">
        <span className="text-7xl mb-8 grayscale opacity-50 drop-shadow-lg">📬</span>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-zinc-900 dark:text-white">Check Your Mail</h1>
        <p className="text-zinc-500 mb-10 uppercase text-[10px] font-black tracking-[0.3em] max-w-md leading-relaxed">
          If an account exists for {email}, a recovery link has been dispatched to your inbox.
        </p>
        <Link href="/login" className="bg-zinc-900 dark:bg-white text-white dark:text-black px-12 py-5 rounded-full font-black uppercase text-[11px] tracking-widest hover:scale-105 transition-all shadow-2xl">
          Return to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#fcfcfc] dark:bg-[#050505] py-12 px-4 sm:px-6 transition-colors duration-700 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="max-w-md w-full z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none mb-4">
            Recovery
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">
            Enter email to reset your vault access.
          </p>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] p-8 md:p-10 rounded-[2.5rem] border border-zinc-100 dark:border-white/5 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="group">
              <label className="block text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1">Registered Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-50 dark:bg-[#0d0d0d] border border-zinc-200 dark:border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-zinc-900 dark:text-white font-medium"
                placeholder="name@example.com"
              />
            </div>

            {error && (
              <div className="text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase text-center bg-rose-500/10 py-3 rounded-xl border border-rose-500/20">
                {error}
              </div>
            )}

            <div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting} className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:shadow-black/20 dark:hover:shadow-white/10 transition-all disabled:opacity-50">
                {isSubmitting ? "Dispatching..." : "Send Recovery Link"}
              </motion.button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-white/5 text-center">
            <Link href="/login" className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:text-zinc-900 dark:hover:text-white transition-colors">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}