import { GridSkeleton, FilterSkeleton } from "@/components/common/Skeletons";

export default function Loading() {
  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 pt-24 md:pt-32 pb-32">
      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="lg:w-80 hidden lg:block">
          <FilterSkeleton />
        </aside>
        <main className="flex-1">
          <div className="flex justify-between items-center mb-12">
             <div className="h-6 w-48 skeleton" />
             <div className="h-10 w-40 skeleton rounded-full" />
          </div>
          <GridSkeleton count={9} />
        </main>
      </div>
    </div>
  );
}
