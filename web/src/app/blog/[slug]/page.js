import { notFound } from "next/navigation";
import BlogDetailsClient from "./BlogDetailsClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://clothing-e-commerce-web.vercel.app";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_URL}/blogs/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Blog not found");
    const blog = await res.json();

    const imageUrl = blog.featuredImage?.startsWith("http")
      ? blog.featuredImage
      : `${SITE_URL}${blog.featuredImage}`;

    return {
      title: `${blog.title} | Vanguard Journal`,
      description: blog.excerpt?.slice(0, 160) || blog.title,
      openGraph: {
        title: blog.title,
        description: blog.excerpt?.slice(0, 160),
        images: [{ url: imageUrl, width: 1200, height: 630, alt: blog.title }],
        type: "article",
        publishedTime: blog.createdAt,
        authors: [blog.author?.name || "Vanguard Team"],
        tags: [blog.category],
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.excerpt?.slice(0, 160),
        images: [imageUrl],
        "twitter:label2": "Reading Time",
        "twitter:data2": blog.readingTime,
      },
      alternates: {
        canonical: `${SITE_URL}/blog/${slug}`,
      },
    };
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    return {
      title: "Blog Not Found | Vanguard",
    };
  }
}

export default async function BlogPage({ params }) {
  const { slug } = await params;
  let blog = null;

  try {
    const res = await fetch(`${API_URL}/blogs/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      if (res.status === 404) notFound();
      throw new Error(`HTTP ${res.status}`);
    }
    blog = await res.json();
  } catch (err) {
    console.error("Blog fetch error:", err);
    notFound();
  }

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    image: blog.featuredImage?.startsWith("http")
      ? blog.featuredImage
      : `${SITE_URL}${blog.featuredImage}`,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      "@type": "Person",
      name: blog.author?.name || "Vanguard Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Vanguard",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    description: blog.excerpt,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.title,
        item: `${SITE_URL}/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogDetailsClient blog={blog} />
    </>
  );
}
