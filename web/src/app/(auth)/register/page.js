"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { swalToast, swalError } from "@/utils/swal";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const { register } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return swalError("Missing Fields", "Please fill in all fields");
    }

    if (password !== confirmPassword) {
      return swalError("Password Mismatch", "Passwords do not match");
    }

    if (password.length < 6) {
      return swalError("Weak Password", "Password must be at least 6 characters");
    }

    setIsSubmitting(true);
    try {
      const data = await register(name, email, password);
      
      if (data.token) {
        swalToast(
          "Welcome to the Syndicate!",
          "Account created and verified. Auto-logging you in..."
        );
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        swalToast(
          "Registration Successful!",
          "Please check your email to verify your account."
        );
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      }
    } catch (err) {
      swalError("Registration Failed", err.response?.data?.message || "Something went wrong");
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
          Create Account
        </motion.h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">
          Join the syndicate and curate your aesthetic journey.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-zinc-50 dark:bg-[#0d0d0d] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-zinc-900 dark:focus:border-white transition-all font-bold text-sm"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-zinc-50 dark:bg-[#0d0d0d] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-zinc-900 dark:focus:border-white transition-all font-bold text-sm"
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
            Password
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
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl transition-all disabled:opacity-50"
        >
          {isSubmitting ? "CREATING ACCOUNT..." : "Create Account"}
        </motion.button>
      </form>

      <div className="mt-12 text-center">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white pb-0.5 ml-1"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}