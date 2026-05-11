import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cookies } from "next/headers";
import { getTranslation } from "@/utils/typography/handler";
import BlogListing from "./BlogListing";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://clothing-e-commerce-web.vercel.app";

export const metadata = {
  title: "Vanguard Journal | Streetwear Narrative",
  description:
    "Explore the tactical aesthetic and fabric narratives at the Vanguard Journal. Latest trends in sustainable streetwear.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

export default async function BlogPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("vanguard-lang")?.value || "en";
  const t = getTranslation('blog', lang);

  const postsPromise = fetch(
    `${API_URL}/blogs?fields=title,slug,featuredImage,category,readingTime,author,createdAt`,
    { next: { revalidate: 3600 } }
  ).then(res => res.ok ? res.json().then(data => data.blogs || []) : []);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Vanguard?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Vanguard is a premium streetwear brand focused on sustainable fabrics, ethical production, and bold urban silhouettes.",
        },
      },
      {
        "@type": "Question",
        name: "How often do you release new journals?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We release new fabric narratives and tactical aesthetic journals weekly.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Suspense fallback={<BlogSkeleton />}>
        <BlogDataWrapper postsPromise={postsPromise} t={t} />
      </Suspense>
    </main>
  );
}

async function BlogDataWrapper({ postsPromise, t }) {
  const posts = await postsPromise;
  return <BlogListing posts={posts} t={t} />;
}

function BlogSkeleton() {
  return (
    <div className="container mx-auto px-6 pt-32 space-y-20">
      <div className="space-y-4">
        <Skeleton className="h-24 w-2/3 rounded-3xl" />
        <Skeleton className="h-4 w-1/3 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-6">
            <Skeleton className="h-[300px] w-full rounded-[2.5rem]" />
            <div className="space-y-3 px-2">
              <Skeleton className="h-6 w-3/4 rounded-xl" />
              <Skeleton className="h-3 w-1/2 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
