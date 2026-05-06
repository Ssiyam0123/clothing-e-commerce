export default function ProductDetailsLoading() {
  return (
    <div className="min-h-screen bg-page pt-32 pb-20">
      <div className="max-w-[1700px] mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <div className="aspect-[3/4] bg-zinc-200 dark:bg-zinc-800 rounded-[3rem] animate-pulse relative overflow-hidden">
               <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent" />
            </div>
            <div className="flex gap-4 mt-8 justify-center">
              {[1,2,3,4].map(i => <div key={i} className="w-20 h-28 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />)}
            </div>
          </div>
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
              <div className="h-16 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
              <div className="h-4 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
            </div>
            
            <div className="h-32 w-full bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse" />
            
            <div className="space-y-4">
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
              <div className="grid grid-cols-4 gap-3">
                {[1,2,3,4].map(i => <div key={i} className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />)}
              </div>
            </div>

            <div className="flex gap-4 pt-8">
              <div className="h-16 flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
              <div className="h-16 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
