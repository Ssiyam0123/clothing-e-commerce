import { HeroSkeleton, GridSkeleton } from "@/components/common/Skeletons";

export default function Loading() {
  return (
    <div className="space-y-20 pb-32">
      <HeroSkeleton />
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-4">
            <div className="h-4 w-32 skeleton" />
            <div className="h-12 w-96 skeleton" />
          </div>
        </div>
        <GridSkeleton count={8} />
      </div>
    </div>
  );
}
