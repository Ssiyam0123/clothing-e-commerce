export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-page pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Category & Title */}
        <div className="space-y-4 mb-12 text-center">
          <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto animate-pulse" />
          <div className="h-16 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-xl mx-auto animate-pulse" />
          <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto animate-pulse" />
        </div>

        {/* Hero Image */}
        <div className="aspect-[21/9] bg-zinc-200 dark:bg-zinc-800 rounded-[2rem] mb-16 animate-pulse" />

        {/* Content */}
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
          <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
          <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
          <div className="pt-8">
            <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-4 animate-pulse" />
            <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
            <div className="h-4 w-4/5 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
