import FlashSaleClient from "./FlashSaleClient";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Exclusive Flash Drops | Vanguard",
  description: "Limited time premium offers and exclusive drops. High-performance streetwear artifacts.",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getFlashSales() {
  try {
    const res = await fetch(`${API_URL}/flash-sales/active`, {
      next: { revalidate: 30 }, // Revalidate every 30 seconds
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("Flash sales fetch failed:", e);
    return [];
  }
}

const FlashSaleSkeleton = () => (
  <div className="min-h-screen bg-background pt-32 pb-40 space-y-24">
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-12 space-y-12">
      <Skeleton className="h-[400px] w-full rounded-[4rem] bg-accent/10" />
      <div className="space-y-4">
        <Skeleton className="h-20 w-3/4 rounded-2xl" />
        <Skeleton className="h-4 w-1/4 rounded-full" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-[400px] w-full rounded-3xl" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default async function FlashSalePage() {
  const initialData = await getFlashSales();

  return (
    <main className="min-h-screen bg-page transition-colors duration-700">
      <Suspense fallback={<FlashSaleSkeleton />}>
        <FlashSaleClient initialData={initialData} />
      </Suspense>
    </main>
  );
}
