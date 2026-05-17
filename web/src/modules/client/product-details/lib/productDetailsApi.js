import { cache } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getProductDetails = cache(async (slug) => {
  try {
    const res = await fetch(`${API_URL}/products/details/${slug}`, {
      next: { revalidate: 3600, tags: [`product-${slug}`] }
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
