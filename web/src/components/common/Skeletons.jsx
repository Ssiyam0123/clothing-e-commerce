"use client";

const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent" />
);

export const HeroSkeleton = () => (
  <div className="relative w-full h-[70vh] md:h-[80vh] bg-zinc-200 dark:bg-zinc-900 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden m-2 md:m-4">
    <Shimmer />
  </div>
);

export const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-[#0a0a0a] rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-4 h-full relative overflow-hidden shadow-sm">
    <div className="aspect-[4/5] bg-zinc-100 dark:bg-zinc-900 rounded-[1.5rem] mb-6" />
    <div className="space-y-3 px-2">
      <div className="h-2 w-1/3 bg-zinc-200 dark:border-zinc-800 rounded-full" />
      <div className="h-4 w-3/4 bg-zinc-200 dark:border-zinc-800 rounded-full" />
      <div className="h-6 w-1/2 bg-zinc-200 dark:border-zinc-800 rounded-full mt-4" />
    </div>
    <Shimmer />
  </div>
);

export const GridSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full">
    {Array.from({ length: count }).map((_, i) => <ProductCardSkeleton key={i} />)}
  </div>
);

export const FilterSkeleton = () => (
  <div className="w-full space-y-6 animate-in fade-in duration-500">
    <div className="h-16 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full relative overflow-hidden">
      <Shimmer />
    </div>
    <div className="flex gap-4 overflow-hidden py-2">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-12 w-32 bg-zinc-100 dark:bg-zinc-900 rounded-full shrink-0 relative overflow-hidden">
          <Shimmer />
        </div>
      ))}
    </div>
  </div>
);


// এই অংশটুকু তোর Skeletons.jsx ফাইলে অ্যাড করবি
export const CartItemSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-8 pb-12 border-b border-zinc-100 dark:border-white/5 animate-pulse">
    <div className="w-full md:w-52 aspect-[3/4] bg-zinc-200 dark:bg-zinc-900 rounded-[2rem] relative overflow-hidden" />
    <div className="flex-1 space-y-6 py-2">
      <div className="space-y-3">
        <div className="h-8 w-3/4 bg-zinc-200 dark:bg-zinc-900 rounded-xl" />
        <div className="h-4 w-1/4 bg-zinc-200 dark:bg-zinc-900 rounded-lg" />
      </div>
      <div className="flex justify-between items-end mt-auto">
        <div className="h-12 w-32 bg-zinc-200 dark:bg-zinc-900 rounded-full" />
        <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-900 rounded-xl" />
      </div>
    </div>
  </div>
);

export const CartSummarySkeleton = () => (
  <div className="p-8 md:p-12 rounded-[3rem] bg-zinc-100/50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 space-y-8">
    <div className="h-8 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
    <div className="space-y-4">
      <div className="flex justify-between"><div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full"/><div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full"/></div>
      <div className="flex justify-between"><div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full"/><div className="h-3 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-full"/></div>
    </div>
    <div className="h-16 w-full bg-zinc-300 dark:bg-zinc-700 rounded-full" />
  </div>
);




// src/components/common/Skeletons.jsx (Add these)

export const AddressFormSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="h-12 bg-zinc-200 dark:bg-zinc-900 rounded-xl w-full" />
      <div className="h-12 bg-zinc-200 dark:bg-zinc-900 rounded-xl w-full" />
    </div>
    <div className="h-12 bg-zinc-200 dark:bg-zinc-900 rounded-xl w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="h-12 bg-zinc-200 dark:bg-zinc-900 rounded-xl w-full" />
      <div className="h-12 bg-zinc-200 dark:bg-zinc-900 rounded-xl w-full" />
    </div>
  </div>
);

export const CheckoutSummarySkeleton = () => (
  <div className="p-10 rounded-[3rem] bg-zinc-100/50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 space-y-8">
    <div className="h-8 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
    <div className="space-y-4">
      {[1, 2].map(i => (
        <div key={i} className="flex gap-4 items-center">
          <div className="w-16 h-20 bg-zinc-200 dark:bg-zinc-900 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 bg-zinc-200 dark:bg-zinc-900 rounded-full" />
            <div className="h-2 w-1/4 bg-zinc-200 dark:bg-zinc-900 rounded-full" />
          </div>
        </div>
      ))}
    </div>
    <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
    <div className="space-y-4">
      <div className="flex justify-between"><div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-900 rounded-full"/><div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full"/></div>
      <div className="flex justify-between"><div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-900 rounded-lg"/><div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg"/></div>
    </div>
  </div>
);










export const FlashBannerSkeleton = () => (
  <div className="relative w-full h-[40vh] md:h-[50vh] bg-zinc-200 dark:bg-zinc-900 rounded-[3rem] overflow-hidden mb-12 relative">
    <div className="absolute bottom-12 left-12 space-y-4 z-10">
      <div className="h-12 w-64 md:w-96 bg-zinc-300 dark:bg-zinc-800 rounded-2xl" />
      <div className="h-4 w-48 md:w-64 bg-zinc-300 dark:bg-zinc-800 rounded-full" />
    </div>
    <Shimmer />
  </div>
);
