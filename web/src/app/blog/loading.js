import { GridSkeleton } from "@/components/common/Skeletons";

export default function BlogLoading() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="h-20 w-64 bg-elevated dark:bg-elevated rounded-full mx-auto mb-20 animate-pulse" />
        <GridSkeleton count={6} />
      </div>
    </div>
  );
}
