'use client';

export default function Pagination({ page, totalPages, onPageChange, dict }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="mt-16 flex justify-center items-center gap-6">
      <button 
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
      >
        ← {dict?.prev || 'Previous'}
      </button>
      
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
        {dict?.page || 'Page'} <span className="text-zinc-900 dark:text-white">{page}</span> {dict?.of || 'of'} {totalPages}
      </span>

      <button 
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
      >
        {dict?.next || 'Next'} →
      </button>
    </div>
  );
}