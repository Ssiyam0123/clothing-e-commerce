import { unstable_cache } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getSectionData = async (endpoint, tags = []) => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      next: { revalidate: 60, tags: ['home-data', ...tags] },
      signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.warn(`⚠️ Section data fetch failed for ${endpoint}:`, error.message);
    return null;
  }
};

export const getLayoutData = unstable_cache(
  async () => {
    try {
      const res = await fetch(`${API_URL}/home-layouts/active`, { 
        next: { revalidate: 60, tags: ['layout'] },
        signal: AbortSignal.timeout(15000)
      });
      return res.ok ? await res.json() : { sections: [] };
    } catch (e) {
      console.warn("⚠️ Layout data fetch failed:", e.message);
      return { sections: [] };
    }
  },
  ['home-layout-data'],
  { revalidate: 60, tags: ['layout'] }
);
