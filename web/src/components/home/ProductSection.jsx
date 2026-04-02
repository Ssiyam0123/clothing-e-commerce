import Link from 'next/link';
import ProductCard from '@/components/store/ProductCard';

export default function ProductSection({ title, subTitle, products, lang, isDarkBg = false, showLoadMore = false, ui }) {
  if (!products || products.length === 0) return null;

  return (
    <section className={`py-32 ${isDarkBg ? 'bg-zinc-50 dark:bg-[#080808] border-y border-zinc-100 dark:border-zinc-900' : ''}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex ${showLoadMore ? 'flex-col items-center text-center mb-20' : 'justify-between items-end mb-16 border-b border-zinc-200 dark:border-zinc-800 pb-8'}`}>
          <div>
            <p className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.4em] mb-3">{subTitle}</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-zinc-900 dark:text-white">{title}</h2>
          </div>
          {!showLoadMore && (
            <Link href="/products" className="hidden md:block text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white">View All</Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(p => <ProductCard key={p._id} product={p} lang={lang} />)}
        </div>

        {showLoadMore && (
          <div className="mt-20 text-center">
            <Link href="/products" className="inline-block border border-zinc-300 dark:border-zinc-800 px-12 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all">
              {ui?.loadMore || 'Load More'}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
