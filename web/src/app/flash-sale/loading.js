import { GridSkeleton } from '@/components/common/Skeletons';

export default function FlashSaleLoading() {
  return (
    <div className="min-h-screen pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-[40vh] bg-zinc-200 dark:bg-zinc-800 rounded-[3rem] mb-12 animate-pulse" />
        <div className="h-12 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-8 animate-pulse" />
        <GridSkeleton count={8} />
      </div>
    </div>
  );
}
