'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import CountdownTimer from './CountdownTimer';
import { getImageUrl } from '@/utils/imageUtils';
import { useAppStore } from '@/store/appStore';

const DICTIONARY = {
  en: {
    drop: 'Exclusive Drop',
    defaultDesc: "Limited time premium offer. Once it's gone, it's gone forever.",
    startsIn: 'Starts In',
    endsIn: 'Ends In',
    discountLabel: 'Storewide \n Discount',
    live: 'LIVE NOW',
  },
  bn: {
    drop: 'এক্সক্লুসিভ ড্রপ',
    defaultDesc: 'সীমিত সময়ের প্রিমিয়াম অফার। স্টক শেষ হওয়ার আগেই লুফে নিন।',
    startsIn: 'শুরু হতে',
    endsIn: 'শেষ হতে',
    discountLabel: 'অতিরিক্ত \n ছাড়',
    live: 'লাইভ',
  }
};

export default function FlashSaleBanner({ flashSale, onExpire }) {
  const { lang, isMounted } = useAppStore(); 
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY.en, [lang]);
  const isBn = lang === 'bn';
  const [isActive, setIsActive] = useState(false);

  if (!isMounted || !flashSale) return null;

  const now = new Date();
  const startDate = new Date(flashSale.startDate);
  const endDate = new Date(flashSale.endDate);
  const hasStarted = now >= startDate;
  const hasEnded = now >= endDate;

  let status = '';
  let targetDate = null;
  let countdownLabel = '';

  if (!hasStarted) {
    status = 'upcoming';
    targetDate = startDate;
    countdownLabel = ui.startsIn;
  } else if (hasStarted && !hasEnded) {
    status = 'active';
    targetDate = endDate;
    countdownLabel = ui.endsIn;
    if (!isActive) setIsActive(true);
  } else {
    status = 'ended';
  }

  const handleExpire = () => {
    if (status === 'upcoming') {
      window.location.reload(); // sale started, refresh to show products
    } else if (status === 'active') {
      setIsActive(false);
      if (onExpire) onExpire();
    }
  };

  return (
    <div className="relative bg-zinc-50 dark:bg-[#080808] rounded-[3rem] overflow-hidden border border-zinc-200 dark:border-zinc-800/50 shadow-2xl group">
      {/* Glow effect – pure CSS, no animation JS */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/5 dark:bg-rose-600/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-rose-500/10 dark:group-hover:bg-rose-600/15 transition-all duration-700"></div>
      
      {flashSale.bannerImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={getImageUrl(flashSale.bannerImage, 1920, 40)}
            alt={flashSale.name}
            fill
            className="object-cover opacity-20 dark:opacity-30 grayscale transition-transform duration-1000 group-hover:scale-105"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 dark:from-black dark:via-black/80 to-transparent"></div>
        </div>
      )}

      <div className="relative z-10 p-10 md:p-16 lg:p-20 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="text-center md:text-left max-w-xl">
          {/* Status badge – static, no animation */}
          <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-600/10 border border-rose-200 dark:border-rose-500/20 px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'} shadow-[0_0_8px_rgba(244,63,94,0.8)]`}></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600 dark:text-rose-500">
              {status === 'active' ? ui.live : ui.drop}
            </span>
          </div>
          
          <h2 className={`text-5xl md:text-7xl font-black text-zinc-900 dark:text-white uppercase leading-none mb-6 drop-shadow-sm ${isBn ? 'font-sans tracking-tight' : 'tracking-tighter'}`}>
            {flashSale.name}
          </h2>
          
          <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg font-medium tracking-wide mb-10 leading-relaxed max-w-md mx-auto md:mx-0">
            {flashSale.description || ui.defaultDesc}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-6">
            <span className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">
              -{flashSale.discount}%
            </span>
            <div className="h-12 w-px bg-zinc-300 dark:bg-zinc-800"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 whitespace-pre-line leading-tight">
              {ui.discountLabel}
            </span>
          </div>
        </div>

        {/* Countdown or ended message */}
        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl flex flex-col items-center min-w-[300px] shrink-0">
          {targetDate && (
            <CountdownTimer 
              targetDate={targetDate} 
              onExpire={handleExpire}
              label={countdownLabel}
            />
          )}
          {status === 'ended' && (
            <div className="text-center">
              <p className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.4em]">Campaign Ended</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}