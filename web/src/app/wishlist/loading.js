import { GridSkeleton } from "@/components/common/Skeletons";

export default function WishlistLoading() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <div className="h-12 w-64 bg-elevated dark:bg-elevated rounded-full mb-4 animate-pulse" />
          <div className="h-4 w-48 bg-elevated dark:bg-elevated rounded-full animate-pulse" />
        </div>
        <GridSkeleton count={8} />
      </div>
    </div>
  );
}
