import { unstable_cache } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getSectionData = async (endpoint, tags = []) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    next: { revalidate: 60, tags: ['home-data', ...tags] }
  });
  if (!res.ok) return null;
  return res.json();
};

export const getLayoutData = unstable_cache(
  async () => {
    try {
      const res = await fetch(`${API_URL}/home-layouts/active`, { 
        next: { revalidate: 60, tags: ['layout'] } 
      });
      return res.ok ? await res.json() : { sections: [] };
    } catch (e) {
      return { sections: [] };
    }
  },
  ['home-layout-data'],
  { revalidate: 60, tags: ['layout'] }
);
