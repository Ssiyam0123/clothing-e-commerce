import { CartItemSkeleton, CartSummarySkeleton } from "@/components/common/Skeletons";

export default function Loading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-24 md:pt-32 pb-32">
      <div className="h-12 w-64 skeleton mb-12 rounded-2xl" />
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          {[1, 2, 3].map((i) => (
            <CartItemSkeleton key={i} />
          ))}
        </div>
        <div className="lg:col-span-4">
          <CartSummarySkeleton />
        </div>
      </div>
    </div>
  );
}
