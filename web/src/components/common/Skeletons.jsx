"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <Skeleton className="aspect-[3/4] w-full rounded-[2.5rem]" />
      <div className="space-y-3 px-2">
        <div className="flex justify-between items-center gap-4">
          <Skeleton className="h-5 w-2/3 rounded-lg" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="h-8 w-1/3 rounded-lg" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-20 rounded-full" />
          <div className="h-px flex-1 bg-border/5" />
          <Skeleton className="h-3 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8, className }) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="w-full h-[80vh] md:h-screen relative overflow-hidden">
      <Skeleton className="absolute inset-0" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-6 text-center">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-20 md:h-32 w-2/3 rounded-2xl" />
        <Skeleton className="h-5 w-1/2 rounded-lg" />
        <Skeleton className="h-16 w-48 rounded-full mt-4" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-10 flex-1 rounded-xl" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export function FilterSkeleton() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <Skeleton className="h-4 w-24 rounded-full" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-20 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-32 rounded-full" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AddressFormSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      ))}
      <div className="md:col-span-2 mt-8">
        <Skeleton className="h-16 w-full rounded-full" />
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-6 p-6 rounded-[2rem] border border-border/5 bg-accent/5">
      <Skeleton className="w-32 h-40 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-4 w-24 rounded-full" />
          </div>
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        <div className="flex items-center justify-between mt-auto">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CartSummarySkeleton() {
  return (
    <div className="p-8 rounded-[3rem] border border-border/10 glass space-y-8">
      <Skeleton className="h-8 w-1/2 rounded-xl" />
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
        <div className="h-px bg-border/10 my-4" />
        <div className="flex justify-between">
          <Skeleton className="h-6 w-20 rounded-lg" />
          <Skeleton className="h-6 w-24 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-16 w-full rounded-full" />
    </div>
  );
}

export function FlashBannerSkeleton() {
  return (
    <div className="w-full aspect-[21/9] md:aspect-[3/1] rounded-[3rem] overflow-hidden relative">
      <Skeleton className="absolute inset-0" />
      <div className="absolute inset-0 flex flex-col justify-center p-12 gap-6">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-16 w-1/2 rounded-2xl" />
        <Skeleton className="h-4 w-1/3 rounded-full" />
      </div>
    </div>
  );
}
