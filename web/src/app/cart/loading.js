import {
  CartItemSkeleton,
  CartSummarySkeleton,
} from "@/components/common/Skeletons";

export default function CartLoading() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 w-64 bg-elevated dark:bg-elevated rounded-2xl mb-16 animate-pulse" />

        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            {[1, 2, 3].map((i) => (
              <CartItemSkeleton key={i} />
            ))}
          </div>
          <div className="lg:col-span-4">
            <CartSummarySkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
