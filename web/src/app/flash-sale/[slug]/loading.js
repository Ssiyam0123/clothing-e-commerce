import { GridSkeleton, FlashBannerSkeleton } from '@/components/common/Skeletons';
import { ChevronLeft } from 'lucide-react';

export default function FlashSaleDetailsLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] pb-40 pt-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-900 rounded-full animate-pulse flex items-center gap-2">
            <ChevronLeft size={14} className="opacity-20" />
            <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-900 rounded-full" />
          </div>
        </div>

        <div className="mb-20">
          <FlashBannerSkeleton />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-10">
          <div className="space-y-4">
            <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-900 rounded-full animate-pulse" />
            <div className="h-16 md:h-24 w-64 md:w-[600px] bg-zinc-100 dark:bg-zinc-900 rounded-2xl animate-pulse" />
            <div className="h-4 w-3/4 bg-zinc-100 dark:bg-zinc-900 rounded-full animate-pulse" />
          </div>
        </div>

        {/* <GridSkeleton count={8} /> */}
      </div>
    </div>
  );
}
