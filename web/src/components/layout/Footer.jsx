'use client';

import Link from 'next/link';

const DICTIONARY = {
  en: { footer: 'Established 2026. Crafted for trendsetters.' },
  bn: { footer: 'প্রতিষ্ঠিত ২০২৬। সচেতনদের জন্য তৈরি।' }
};

export default function Footer({ lang }) {
  const ui = DICTIONARY[lang] || DICTIONARY['en'];

  return (
    <footer className="py-24 border-t transition-colors duration-700 bg-zinc-50 dark:bg-[#050505] border-zinc-200 dark:border-zinc-900 text-zinc-500 dark:text-zinc-600">
      <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter opacity-20 mb-8">ECOWEAR</h2>
        <p className={`max-w-md mx-auto leading-relaxed ${lang === 'en' ? 'text-[10px] font-black uppercase tracking-[0.5em]' : 'text-sm font-semibold'}`}>
          {ui.footer}
        </p>
        <div className="mt-14 flex justify-center gap-10 text-[9px] font-black uppercase tracking-widest opacity-60">
           <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy</Link>
           <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms</Link>
           <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Instagram</Link>
        </div>
      </div>
    </footer>
  );
}
