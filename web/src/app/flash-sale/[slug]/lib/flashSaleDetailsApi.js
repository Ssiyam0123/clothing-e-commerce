import { cache } from 'react';
export const getFlashSaleDetails = cache(async (slug) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${API_URL}/flash-sales/slug/${slug}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      if (res.status === 404) return { error: 404 };
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Flash sale fetch error:", err);
    return { error: true };
  }
});
