import { GridSkeleton } from "@/components/common/Skeletons";

export default function WishlistLoading() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-32">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="mb-16 space-y-4">
          <div className="h-14 w-64 skeleton rounded-2xl" />
          <div className="h-4 w-48 skeleton rounded-full" />
        </div>
        <GridSkeleton count={8} />
      </div>
    </div>
  );
}
