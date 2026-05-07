export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-page py-20">
      <div className="max-w-[1700px] mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <div className="aspect-[3/4] bg-elevated dark:bg-elevated rounded-[3rem] animate-pulse" />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="h-8 w-32 bg-elevated dark:bg-elevated rounded-full animate-pulse" />
            <div className="h-16 w-3/4 bg-elevated dark:bg-elevated rounded-xl animate-pulse" />
            <div className="h-24 w-full bg-elevated dark:bg-elevated rounded-xl animate-pulse" />
            <div className="h-12 w-full bg-elevated dark:bg-elevated rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
