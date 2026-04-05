"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { XCircle, RefreshCcw, HelpCircle, ArrowLeft } from "lucide-react";

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        
        {/* Error Animation */}
        <motion.div 
          initial={{ scale: 0, rotate: 45 }} animate={{ scale: 1, rotate: 12 }} 
          className="w-28 h-28 bg-rose-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-rose-500/20"
        >
          <XCircle size={56} className="text-white" />
        </motion.div>

        <h1 className="text-6xl font-black tracking-tighter uppercase mb-6 dark:text-white italic">Aborted.</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-12 leading-loose">
          The payment synchronization was interrupted. No credits were deducted from your vault. Protocol session terminated.
        </p>

        <div className="grid gap-4">
          <button 
            onClick={() => router.push('/cart')}
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-7 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl hover:bg-rose-600 hover:text-white transition-all active:scale-95"
          >
            <RefreshCcw size={18} /> Retry Settlement
          </button>
          
          <button 
            onClick={() => router.push('/contact')}
            className="w-full bg-transparent border-2 border-zinc-100 dark:border-white/5 text-zinc-500 py-7 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:border-zinc-900 dark:hover:border-white transition-all"
          >
            <HelpCircle size={18} /> Support Protocol
          </button>
        </div>

        <button 
          onClick={() => router.push('/')}
          className="mt-12 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300 hover:text-zinc-900 transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft size={12} /> Return to Home
        </button>
      </div>
    </div>
  );
}