// src/components/common/ProductSkeleton.js
export default function ProductSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col h-full bg-surface dark:bg-[#0a0a0a] rounded-[2rem] border border-light overflow-hidden animate-pulse shadow-sm"
        >
          {/* Image Skeleton */}
          <div className="aspect-[4/5] bg-elevated dark:bg-elevated w-full"></div>

          {/* Content Skeleton */}
          <div className="p-6 flex flex-col flex-1 gap-4">
            <div className="h-3 bg-elevated dark:bg-elevated rounded-full w-1/3"></div>
            <div className="h-5 bg-elevated dark:bg-elevated rounded-full w-3/4"></div>
            <div className="mt-auto flex items-end gap-3 pt-2">
              <div className="h-8 bg-elevated dark:bg-elevated rounded-full w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
