import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto px-4 sm:px-10 pt-10 animate-in fade-in duration-700">
      {/* 1. HEADER SKELETON */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <Skeleton className="h-16 w-[300px] md:w-[500px] rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-[200px] bg-zinc-100 dark:bg-zinc-800/50" />
        </div>
        <Skeleton className="h-[120px] w-[240px] rounded-[2rem] bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* 2. KPI GRID SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[160px] rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900/50" />
        ))}
      </div>

      {/* 3. ANALYTICS BLOCK SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="lg:col-span-2 h-[480px] rounded-[3rem] bg-zinc-100 dark:bg-zinc-900/40" />
        <Skeleton className="h-[480px] rounded-[3rem] bg-zinc-100 dark:bg-zinc-900/40" />
      </div>

      {/* 4. LOWER BLOCKS SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-[400px] rounded-[3rem] bg-zinc-100 dark:bg-zinc-900/30" />
        <Skeleton className="h-[400px] rounded-[3rem] bg-zinc-900 dark:bg-black" />
      </div>
    </div>
  );
}
