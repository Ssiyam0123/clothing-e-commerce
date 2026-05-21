import { cache } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getInitialProducts = async (searchParams) => {
  const params = new URLSearchParams(searchParams);
  // Default values to match hook's initial state
  if (!params.has("page")) params.set("page", "1");
  if (!params.has("limit")) params.set("limit", "24");
  if (!params.has("category")) params.set("category", "all");

  const apiParams = new URLSearchParams();
  if (params.get("page")) apiParams.set("page", params.get("page"));
  if (params.get("limit")) apiParams.set("limit", params.get("limit"));
  if (params.get("search")) apiParams.set("search", params.get("search"));
  if (params.get("sort")) apiParams.set("sort", params.get("sort"));
  if (params.get("category") && params.get("category") !== "all") {
    if (params.get("category") === "isFeatured") {
      apiParams.set("isFeatured", "true");
    } else {
      apiParams.set("category", params.get("category"));
    }
  }

  if (params.get("subcategory") && params.get("subcategory") !== "all") {
    apiParams.set("subcategory", params.get("subcategory"));
  }

  // Optimize data transfer
  apiParams.set(
    "fields",
    "name,slug,price,discount,images,category,subcategory,averageRating,sizes,isFeatured,isNew",
  );

  try {
    const res = await fetch(`${API_URL}/products?${apiParams.toString()}`, {
      next: { revalidate: 60 }, // Revalidate every minute
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("Initial products fetch failed:", e);
    return null;
  }
};

