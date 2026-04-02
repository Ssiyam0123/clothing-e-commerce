'use client';

import { motion } from 'framer-motion';

// 🦴 Skeleton version of the USP item
const UspSkeleton = () => (
  <div className="flex flex-col items-center text-center animate-pulse">
    <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full mb-6" />
    <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-900 rounded-full mb-2" />
    <div className="h-2 w-24 bg-zinc-100 dark:bg-zinc-900 rounded-full" />
  </div>
);

export default function UspSection({ ui }) {
  // 🚀 SENIOR FIX: Defensive logic to prevent 'undefined' crash
  const uspData = ui?.usp || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  return (
    <section className="py-20 border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-[#080808] overflow-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12"
      >
        {/* 🛡️ Guard: যদি ডাটা না থাকে তবে স্কেলিটন দেখাবে, ক্র্যাশ করবে না */}
        {uspData.length === 0 ? (
          <>
            <UspSkeleton />
            <UspSkeleton />
            <UspSkeleton />
          </>
        ) : (
          uspData.map((item, i) => (
            <motion.div 
              variants={itemVariants} 
              key={i} 
              className="flex flex-col items-center text-center group cursor-default"
            >
              <div className="w-20 h-20 bg-zinc-50 dark:bg-[#111] rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-colors duration-500">
                <span className="text-3xl grayscale group-hover:grayscale-0 group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </span>
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-2 bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent">
                {item.title}
              </h4>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                {item.desc}
              </p>
            </motion.div>
          ))
        )}
      </motion.div>
    </section>
  );
}