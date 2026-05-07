import {
  GridSkeleton,
  FlashBannerSkeleton,
} from "@/components/common/Skeletons";

export default function FlashSaleLoading() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <FlashBannerSkeleton />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-10 border-b pb-8">
          <div className="h-12 md:h-20 w-64 md:w-[400px] bg-elevated dark:bg-elevated rounded-2xl animate-pulse" />
          <div className="h-14 w-full md:w-48 bg-elevated dark:bg-elevated rounded-2xl animate-pulse" />
        </div>
        {/* <GridSkeleton count={8} /> */}
      </div>
    </div>
  );
}
