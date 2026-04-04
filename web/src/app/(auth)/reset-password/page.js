"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { swalToast, swalError } from "@/utils/swal";
import { useAuthStore } from "@/store/authStore";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuthStore();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      return swalError("Invalid Link", "Reset token is missing");
    }

    if (password !== confirmPassword) {
      return swalError("Password Mismatch", "Passwords do not match");
    }

    if (password.length < 6) {
      return swalError("Weak Password", "Password must be at least 6 characters");
    }

    setIsSubmitting(true);
    try {
      await resetPassword(token, password);
      swalToast("Password Reset!", "You can now login with your new password.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      swalError("Reset Failed", err.response?.data?.message || "Invalid or expired token");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-10">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-3"
        >
          New Password
        </motion.h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">
          Enter your new secure password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-zinc-50 dark:bg-[#0d0d0d] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-zinc-900 dark:focus:border-white transition-all font-bold text-sm"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full bg-zinc-50 dark:bg-[#0d0d0d] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-zinc-900 dark:focus:border-white transition-all font-bold text-sm"
            placeholder="••••••••"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl transition-all disabled:opacity-50"
        >
          {isSubmitting ? "UPDATING..." : "Update Password"}
        </motion.button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-[10px] font-black text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            ← Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}