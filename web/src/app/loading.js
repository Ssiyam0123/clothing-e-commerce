import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505]">
      <div className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-12">
        {/* Instant Skeleton Shell */}
        <div className="space-y-6">
          <Skeleton className="h-[500px] w-full rounded-[3rem] bg-zinc-50 dark:bg-zinc-900/40" />
          <div className="flex gap-4">
             <Skeleton className="h-4 w-32 rounded-full" />
             <Skeleton className="h-4 w-48 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[350px] w-full rounded-3xl bg-zinc-50 dark:bg-zinc-900/20" />
              <div className="space-y-2 px-2">
                <Skeleton className="h-3 w-3/4 rounded-full" />
                <Skeleton className="h-3 w-1/2 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
