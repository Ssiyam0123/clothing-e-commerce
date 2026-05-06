'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CountdownTimer({ targetDate, onExpire, label }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(timer);
        if (onExpire) onExpire();
        setTimeLeft(null);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  if (!timeLeft) return null;

  const Unit = ({ val, label }) => (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="flex flex-col items-center bg-white/10 dark:bg-black/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl min-w-[60px] md:min-w-[70px] shadow-2xl"
    >
      <span className="text-xl md:text-3xl font-black text-zinc-900 dark:text-white leading-none">
        {String(val).padStart(2, '0')}
      </span>
      <span className="text-[7px] md:text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em] mt-1 md:mt-2">
        {label}
      </span>
    </motion.div>
  );

  return (
    <div className="flex flex-col items-center">
      {label && <p className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.4em] mb-4">{label}</p>}
      <div className="flex gap-2">
        <AnimatePresence>
          {timeLeft.days > 0 && <Unit key="days" val={timeLeft.days} label="Days" />}
          <Unit key="hours" val={timeLeft.hours} label="Hrs" />
          <Unit key="minutes" val={timeLeft.minutes} label="Min" />
          <Unit key="seconds" val={timeLeft.seconds} label="Sec" />
        </AnimatePresence>
      </div>
    </div>
  );
}