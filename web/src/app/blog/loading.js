import { BlogCardSkeleton } from "@/components/common/Skeletons";

export default function Loading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-24 md:pt-32 pb-32">
      <div className="text-center space-y-4 mb-20">
        <div className="h-4 w-32 skeleton mx-auto" />
        <div className="h-16 w-2/3 skeleton mx-auto rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
