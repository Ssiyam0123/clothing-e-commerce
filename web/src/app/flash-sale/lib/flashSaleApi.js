export const getFlashSales = async () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${API_URL}/flash-sales/active`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("Flash sales fetch failed:", e);
    return [];
  }
};
