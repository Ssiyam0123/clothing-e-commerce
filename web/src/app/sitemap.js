const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clothing-e-commerce-web.vercel.app";

// ১. সেইফ ডেট হেল্পার (যাতে ক্রাশ না করে)
const safeDate = (dateStr) => {
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? new Date() : date;
};

async function fetchAPI(endpoint) {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Sitemap fetch error for ${endpoint}:`, error.message);
    return null;
  }
}

export default async function sitemap() {
  // ২. Static Routes
  const staticEntries = [
    { url: "", changeFrequency: "daily", priority: 1.0 },
    { url: "/products", changeFrequency: "daily", priority: 0.9 },
    { url: "/blog", changeFrequency: "weekly", priority: 0.8 },
    { url: "/flash-sale", changeFrequency: "hourly", priority: 0.9 },
  ].map((route) => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // ৩. Dynamic Products
  const productsData = await fetchAPI("/products?limit=1000");
  const productEntries = (productsData?.products || []).map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: safeDate(product.updatedAt || product.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // ৪. Dynamic Blogs
  const blogsData = await fetchAPI("/blogs");
  const blogEntries = (Array.isArray(blogsData) ? blogsData : []).map(
    (blog) => ({
      url: `${BASE_URL}/blog/${blog.slug}`,
      lastModified: safeDate(blog.updatedAt || blog.createdAt),
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  // ৫. Categories
  const categoriesData = await fetchAPI("/categories");
  const categoryEntries = (
    Array.isArray(categoriesData) ? categoriesData : []
  ).map((cat) => ({
    url: `${BASE_URL}/products?category=${cat.slug}`,
    lastModified: safeDate(cat.updatedAt || cat.createdAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticEntries,
    ...productEntries,
    ...blogEntries,
    ...categoryEntries,
  ];
}
