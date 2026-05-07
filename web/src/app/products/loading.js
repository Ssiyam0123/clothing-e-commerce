import { GridSkeleton } from "@/components/common/Skeletons";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <div className="h-12 w-48 bg-elevated dark:bg-elevated rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-4 w-64 bg-elevated dark:bg-elevated rounded-full mx-auto animate-pulse" />
        </div>
        <GridSkeleton count={12} />
      </div>
    </div>
  );
}
