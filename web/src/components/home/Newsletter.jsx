'use client';

import { motion } from 'framer-motion';

// 🦴 Newsletter Skeleton View
const NewsletterSkeleton = () => (
  <div className="animate-pulse flex flex-col items-center">
    <div className="h-12 md:h-20 w-3/4 bg-zinc-800 rounded-2xl mb-6" />
    <div className="h-4 w-1/2 bg-zinc-800 rounded-full mb-12" />
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
      <div className="flex-1 h-14 bg-zinc-800 rounded-full" />
      <div className="w-full sm:w-32 h-14 bg-zinc-800 rounded-full" />
    </div>
  </div>
);

export default function Newsletter({ ui, lang = 'en' }) {
  const isBn = lang === 'bn';

  if (!ui) {
    return (
      <section className="py-40 bg-black text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <NewsletterSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section className="py-40 bg-black text-white relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800 rounded-full blur-[150px] opacity-20 -mr-48 -mt-48"></div>
      
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-none ${isBn ? 'font-sans' : ''}`}
        >
          {ui.newsletterTitle || 'Join the Syndicate'}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-zinc-500 mb-12 text-lg font-light tracking-wide"
        >
          {ui.newsletterSub || 'Subscribe for early access and exclusive drops.'}
        </motion.p>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <input 
            type="email" 
            placeholder={isBn ? "আপনার ইমেইল..." : "EMAIL@ADDRESS.COM"} 
            className="flex-1 bg-[#111] border border-zinc-800 rounded-full px-8 py-5 text-sm focus:outline-none focus:border-zinc-600 transition-all uppercase tracking-widest placeholder:text-zinc-700"
            required
          />
          <button 
            type="submit" 
            className="bg-white text-black px-10 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-200 active:scale-95 transition-all shadow-xl shadow-white/5"
          >
            {ui.subscribe || 'Subscribe'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}