"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { swalToast, swalError } from "@/utils/swal";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show success message if email was verified
  const verified = searchParams.get("verified");
  if (verified === "true") {
    swalToast("Email verified! Please login.", "success");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return swalError("Missing Fields", "Please enter email and password");
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      swalToast("Login successful!", "success");
      router.push("/");
    } catch (err) {
      swalError("Login Failed", err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl border border-zinc-100 dark:border-white/5">
      <div className="text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter"
        >
          Access Vault
        </motion.h1>
        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.4em] mt-2">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-zinc-50 dark:bg-[#0d0d0d] border border-zinc-200 dark:border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-zinc-900 dark:text-white font-medium"
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-zinc-50 dark:bg-[#0d0d0d] border border-zinc-200 dark:border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-zinc-900 dark:text-white font-medium"
            placeholder="••••••••"
          />
        </div>

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-[9px] font-black text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl transition-all disabled:opacity-50"
        >
          {isSubmitting ? "SIGNING IN..." : "Sign In"}
        </motion.button>
      </form>

      <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-white/5 text-center">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white pb-0.5 ml-1"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}