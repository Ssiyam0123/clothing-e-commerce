"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import { useRouter, useSearchParams } from "next/navigation";
import { swalToast, swalError } from "@/utils/swal";

const DICTIONARY = {
  en: {
    title: "Initialize Profile",
    sub: "Join the syndicate and curate your aesthetic journey.",
    name: "Full Identity",
    email: "Neural Contact (Email)",
    pass: "Access Key (Password)",
    btn: "Create Identity",
    social: "Or synchronize with",
    hasAccount: "Already a member?",
    login: "Authenticate Now",
    reqName: "Name is mandatory",
    reqEmail: "Contact identity required",
    invEmail: "Invalid neural link (email)",
    reqPass: "Access key required",
    minPass: "Minimum 6 characters for security",
  },
  bn: {
    title: "প্রোফাইল তৈরি",
    sub: "সিন্ডিকেটে যোগ দিন এবং আপনার যাত্রা শুরু করুন।",
    name: "পূর্ণ নাম",
    email: "ইমেইল আইডি",
    pass: "পাসওয়ার্ড",
    btn: "অ্যাকাউন্ট তৈরি করুন",
    social: "অথবা যুক্ত হন",
    hasAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
    login: "লগইন করুন",
    reqName: "নাম প্রয়োজন",
    reqEmail: "ইমেইল প্রয়োজন",
    invEmail: "ভুল ইমেইল ফরম্যাট",
    reqPass: "পাসওয়ার্ড প্রয়োজন",
    minPass: "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে",
  },
};

export default function RegisterPage() {
  const { registerUser, loginWithSocial } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useAppStore();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const redirectUrl = searchParams.get("redirect") || "/profile";

  const { register, handleSubmit, formState: { errors } } = useForm();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY["en"], [lang]);

  // 📝 Registration Handler
  const onSubmit = async (data) => {
    setIsRegistering(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: redirectUrl
      });
      swalToast(lang === 'bn' ? "অ্যাকাউন্ট তৈরি সফল!" : "Identity Created Successfully", "success");
      // Better Auth handles auto-login, so redirecting to intended path
      router.push(redirectUrl);
    } catch (err) {
      swalError(lang === 'bn' ? "ব্যর্থ হয়েছে" : "Protocol Failed", err.message);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-3 ${lang === 'bn' ? 'font-sans' : ''}`}
        >
          {ui.title}
        </motion.h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">
          {ui.sub}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
            {ui.name}
          </label>
          <input
            {...register("name", { required: ui.reqName })}
            type="text"
            placeholder="John Doe"
            className="w-full bg-zinc-50 dark:bg-[#0d0d0d] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-zinc-900 dark:focus:border-white transition-all font-bold text-sm"
          />
          {errors.name && <p className="text-[9px] text-rose-500 font-black uppercase ml-1">{errors.name.message}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
            {ui.email}
          </label>
          <input
            {...register("email", { 
              required: ui.reqEmail,
              pattern: { value: /\S+@\S+\.\S+/, message: ui.invEmail }
            })}
            type="email"
            placeholder="identity@vanguard.os"
            className="w-full bg-zinc-50 dark:bg-[#0d0d0d] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-zinc-900 dark:focus:border-white transition-all font-bold text-sm"
          />
          {errors.email && <p className="text-[9px] text-rose-500 font-black uppercase ml-1">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
            {ui.pass}
          </label>
          <input
            {...register("password", { 
              required: ui.reqPass,
              minLength: { value: 6, message: ui.minPass }
            })}
            type="password"
            placeholder="••••••••"
            className="w-full bg-zinc-50 dark:bg-[#0d0d0d] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-zinc-900 dark:focus:border-white transition-all font-bold text-sm"
          />
          {errors.password && <p className="text-[9px] text-rose-500 font-black uppercase ml-1">{errors.password.message}</p>}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isRegistering}
          type="submit"
          className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl transition-all disabled:opacity-50"
        >
          {isRegistering ? "Initializing..." : ui.btn}
        </motion.button>
      </form>

      {/* Social Register */}
      <div className="mt-10">
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute w-full border-t border-zinc-100 dark:border-zinc-800"></div>
          <span className="relative bg-[#fcfcfc] dark:bg-[#050505] px-4 text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em]">
            {ui.social}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => loginWithSocial('google', redirectUrl)}
            className="flex items-center justify-center gap-3 bg-white dark:bg-[#0d0d0d] border border-zinc-200 dark:border-zinc-800 py-3.5 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shadow-sm"
          >
            {/* 🚀 Rock-solid Inline Google SVG */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300">Google</span>
          </button>
          <button 
            onClick={() => loginWithSocial('facebook', redirectUrl)}
            className="flex items-center justify-center gap-3 bg-white dark:bg-[#0d0d0d] border border-zinc-200 dark:border-zinc-800 py-3.5 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shadow-sm"
          >
            {/* 🚀 Rock-solid Inline Facebook SVG */}
            <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300">Facebook</span>
          </button>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
          {ui.hasAccount}{" "}
          <Link href="/login" className="text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white pb-0.5 hover:opacity-60 transition-opacity ml-1">
            {ui.login}
          </Link>
        </p>
      </div>
    </div>
  );
}