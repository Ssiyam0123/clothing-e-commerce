'use client';

import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange, dict }) {
  if (!totalPages || totalPages <= 1) return null;

  // 🛰️ Smart Range Logic: ১, শেষ পেজ এবং কারেন্ট পেজের চারপাশ দেখাবে
  const pages = useMemo(() => {
    const range = [];
    const delta = 1; // কারেন্ট পেজের ডানে-বামে কয়টা পেজ দেখাবে

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i);
      } else if (i === page - delta - 1 || i === page + delta + 1) {
        range.push('...');
      }
    }
    return range;
  }, [page, totalPages]);

  return (
    <div className="mt-20 flex flex-col sm:flex-row justify-between items-center gap-8 px-2 border-t dark:border-white/5 pt-10">
      
      {/* 🏷️ Info Label */}
      <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] order-2 sm:order-1">
        {dict?.sector || 'Sector'} <span className="text-zinc-900 dark:text-white">{page < 10 ? `0${page}` : page}</span> 
        <span className="mx-3 opacity-20">/</span> 
        {totalPages < 10 ? `0${totalPages}` : totalPages}
      </div>

      {/* 🎮 Navigation Controls */}
      <div className="flex items-center gap-2 order-1 sm:order-2">
        
        {/* Previous Button */}
        <button 
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl disabled:opacity-10 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all border border-transparent dark:border-white/5 shadow-sm active:scale-90"
          aria-label="Previous Sector"
        >
          <ChevronLeft size={18} strokeWidth={3} />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1.5 px-2">
          {pages.map((p, i) => {
            if (p === '...') {
              return (
                <span key={`dots-${i}`} className="text-zinc-300 dark:text-zinc-800 px-1">
                  <MoreHorizontal size={14} />
                </span>
              );
            }

            const isActive = p === page;

            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-10 h-10 rounded-xl text-[11px] font-black transition-all duration-300 ${
                  isActive 
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20 scale-110 z-10' 
                    : 'bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {p < 10 ? `0${p}` : p}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button 
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="p-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl disabled:opacity-10 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all border border-transparent dark:border-white/5 shadow-sm active:scale-90"
          aria-label="Next Sector"
        >
          <ChevronRight size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}