import Link from 'next/link';
import FlashSaleProductCard from '@/components/store/FlashSaleProductCard';

export default function FlashSaleTeaser({ activeSale, flashSaleProducts, ui, lang }) {
  if (!activeSale || !flashSaleProducts?.products?.length) return null;

  return (
    <section className="py-24 bg-rose-500/[0.02] border-b border-zinc-100 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-rose-500 font-black text-[10px] uppercase tracking-[0.4em] mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
              Live Now
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-zinc-900 dark:text-white">
              Flash <span className="text-rose-600 italic">Sale</span>
            </h2>
          </div>
          <Link href="/flash-sale" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-rose-500 transition-colors">
            {lang === 'en' ? 'View All' : 'সব দেখুন'} →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {flashSaleProducts.products.slice(0, 4).map(p => (
            <FlashSaleProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
