import { cache } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getProductDetails = cache(async (slug) => {
  try {
    const res = await fetch(`${API_URL}/products/details/${slug}`, {
      // FIX: revalidate every 15 min instead of 1 hour for fresher data
      next: { revalidate: 900, tags: [`product-${slug}`] },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      if (res.status === 404) return { error: 404 };
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    return { error: true };
  }
});
