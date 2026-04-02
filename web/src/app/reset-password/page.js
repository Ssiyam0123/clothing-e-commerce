"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setIsSubmitting(true);
    setError("");
    try {
      await resetPassword(password);
      // Success, route them back to login
      router.push("/login?redirect=/profile");
    } catch (err) {
      setError(err.message || "Reset failed. The link may have expired.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#fcfcfc] dark:bg-[#050505] py-12 px-4 sm:px-6 transition-colors duration-700 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="max-w-md w-full z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none mb-4">
            New Credentials
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">
            Enter your new secure password.
          </p>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] p-8 md:p-10 rounded-[2.5rem] border border-zinc-100 dark:border-white/5 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="group">
              <label className="block text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-zinc-50 dark:bg-[#0d0d0d] border border-zinc-200 dark:border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-zinc-900 dark:text-white font-medium"
                placeholder="••••••••"
              />
            </div>

            <div className="group">
              <label className="block text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-zinc-50 dark:bg-[#0d0d0d] border border-zinc-200 dark:border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-zinc-900 dark:text-white font-medium"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase text-center bg-rose-500/10 py-3 rounded-xl border border-rose-500/20">
                {error}
              </div>
            )}

            <div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting} className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:shadow-black/20 dark:hover:shadow-white/10 transition-all disabled:opacity-50">
                {isSubmitting ? "Encrypting..." : "Update Credentials"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}