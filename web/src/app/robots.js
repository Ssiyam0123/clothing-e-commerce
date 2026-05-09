// src/app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/cart/", "/profile/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://clothing-e-commerce-web.vercel.app"}/sitemap.xml`,
  };
}
