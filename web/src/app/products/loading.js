import { GridSkeleton, FilterSkeleton } from "@/components/common/Skeletons";

export default function Loading() {
  return (
    <main className="min-h-screen bg-page pt-10 transition-colors duration-700">
      <div className="container mx-auto px-4 md:px-6">
        <div className="w-full">
          <div className="mb-10">
            <FilterSkeleton />
          </div>
          <GridSkeleton count={12} />
        </div>
      </div>
    </main>
  );
}
