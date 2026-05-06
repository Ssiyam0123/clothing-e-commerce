import BlogMagazineClient from './BlogMagazineClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://clothing-e-commerce-web.vercel.app';

export const metadata = {
  title: 'Vanguard Journal | Streetwear Narrative',
  description: 'Explore the tactical aesthetic and fabric narratives at the Vanguard Journal. Latest trends in sustainable streetwear.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

export default async function BlogPage() {
  let posts = [];
  try {
    const res = await fetch(`${API_URL}/blogs?fields=title,slug,featuredImage,category,readingTime,author,createdAt`, {
      next: { revalidate: 3600 }
    });
    if (res.ok) {
      posts = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Vanguard?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vanguard is a premium streetwear brand focused on sustainable fabrics, ethical production, and bold urban silhouettes.',
        },
      },
      {
        '@type': 'Question',
        name: 'How often do you release new journals?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We release new fabric narratives and tactical aesthetic journals weekly.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BlogMagazineClient posts={posts} />
    </>
  );
}