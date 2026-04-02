
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { XCircle, RefreshCcw, HelpCircle } from "lucide-react";

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} 
          className="w-24 h-24 bg-rose-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-rose-500/20 rotate-12"
        >
          <XCircle size={48} className="text-white" />
        </motion.div>

        <h1 className="text-5xl font-black tracking-tighter uppercase mb-4 dark:text-white">Aborted.</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-12 leading-loose">
          The payment synchronization was interrupted. No credits were deducted from your vault.
        </p>

        <div className="space-y-4">
          <button 
            onClick={() => router.push('/checkout')}
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-6 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-xl"
          >
            <RefreshCcw size={16} /> Retry Settlement
          </button>
          
          <button 
            onClick={() => router.push('/contact')}
            className="w-full border-2 border-zinc-100 dark:border-white/5 text-zinc-500 py-6 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3"
          >
            <HelpCircle size={16} /> Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}