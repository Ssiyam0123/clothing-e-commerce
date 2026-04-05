'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/appStore';
import { useFlashSales } from '@/hooks/useFlashSale';
import FlashSaleBanner from '@/components/store/FlashSaleBanner';
import FlashSaleProductCard from '@/components/store/FlashSaleProductCard';
import { GridSkeleton } from '@/components/common/Skeletons';
import { ChevronRight, Zap, Clock } from 'lucide-react';

// ⏱️ SUB-COMPONENT: Real-time Countdown Timer
const CountdownTimer = ({ targetDate, lang }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const labels = lang === 'bn' ? ['দিন', 'ঘণ্টা', 'মিনিট', 'সেকেন্ড'] : ['D', 'H', 'M', 'S'];

  return (
    <div className="flex gap-2 mt-4">
      {[
        { val: timeLeft.days, label: labels[0] },
        { val: timeLeft.hours, label: labels[1] },
        { val: timeLeft.minutes, label: labels[2] },
        { val: timeLeft.seconds, label: labels[3] }
      ].map((unit, i) => (
        <div key={i} className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl min-w-[50px] border border-white/5">
          <span className="text-xl font-black text-white leading-none">{unit.val < 10 ? `0${unit.val}` : unit.val}</span>
          <span className="text-[7px] font-black uppercase tracking-widest text-zinc-400 mt-1">{unit.label}</span>
        </div>
      ))}
    </div>
  );
};

const DICTIONARY = {
  en: { emptyTitle: 'The Vault is Closed', explore: 'Explore Collection', activeTitle: 'Live Drops Active', upcomingTitle: 'Starting Soon', viewDetails: 'Explore Drop' },
  bn: { emptyTitle: 'ক্যাম্পেইন বন্ধ আছে', explore: 'কালেকশন দেখুন', activeTitle: 'লাইভ অফার চলছে', upcomingTitle: 'শীঘ্রই আসছে', viewDetails: 'বিস্তারিত দেখুন' }
};

export default function FlashSaleClient() {
  const { lang } = useAppStore();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY.en, [lang]);
  const { allActiveSales, isLoading } = useFlashSales(); 
  const now = useMemo(() => new Date(), []);

  const { activeSales, upcomingSales } = useMemo(() => {
    if (!allActiveSales || !Array.isArray(allActiveSales)) return { activeSales: [], upcomingSales: [] };
    const active = allActiveSales.filter(s => new Date(s.startDate) <= now);
    const upcoming = allActiveSales.filter(s => new Date(s.startDate) > now);
    return { activeSales: active, upcomingSales: upcoming };
  }, [allActiveSales, now]);

  if (isLoading) return <div className="p-12"><GridSkeleton count={8} /></div>;

  return (
    <div className="pb-32 font-sans pt-12 space-y-28">
      
      {/* 🔥 ACTIVE DROPS SECTION */}
      {activeSales.map((sale) => (
        <section key={sale._id} className="max-w-7xl mx-auto px-6">
          <FlashSaleBanner flashSale={sale} />
          <div className="flex justify-between items-end mt-12 mb-10 border-b dark:border-white/5 pb-8">
            <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">{sale.name}</h2>
            <Link href={`/flash-sale/${sale.slug}`} className="bg-zinc-900 dark:bg-white text-white dark:text-black px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-rose-600 transition-all">
              {ui.viewDetails}
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {sale.products?.slice(0, 4).map(p => <FlashSaleProductCard key={p._id} product={p} />)}
          </div>
        </section>
      ))}

      {/* ⏳ UPCOMING DROPS SECTION WITH COUNTDOWN */}
      {upcomingSales.length > 0 && (
        <section className="bg-zinc-50 dark:bg-zinc-900/40 py-28 border-y dark:border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-4 mb-12">
               <Clock className="text-rose-600 animate-pulse" size={28} />
               <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-zinc-400">
                 {ui.upcomingTitle}
               </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {upcomingSales.map((sale) => (
                <Link 
                  key={sale._id} 
                  href={`/flash-sale/${sale?.slug}`}
                  className="group relative h-[350px] rounded-[3rem] overflow-hidden bg-zinc-900 border border-white/5 hover:border-rose-600/40 transition-all duration-700"
                >
                  {/* Background Image Effect */}
                  <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                    <img src={sale.bannerImage || '/api/placeholder/800/400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" alt="" />
                  </div>

                  <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent">
                    <div className="space-y-4">
                      <p className="text-rose-600 text-[10px] font-black uppercase tracking-[0.4em]">Encrypted sequence</p>
                      <h4 className="text-4xl md:text-5xl font-black text-white uppercase italic leading-none group-hover:translate-x-2 transition-transform duration-500">{sale.name}</h4>
                      
                      {/* 🚀 REAL-TIME COUNTDOWN COMPONENT */}
                      <CountdownTimer targetDate={sale.startDate} lang={lang} />

                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest pt-4">
                        Drops on: {new Date(sale.startDate).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute top-10 right-10 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl group-hover:bg-rose-600 transition-colors">
                    <Zap size={24} className="text-white" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}