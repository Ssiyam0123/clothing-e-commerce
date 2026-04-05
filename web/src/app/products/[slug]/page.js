import { notFound } from 'next/navigation';
import ProductDetailsClient from './ProductDetailsClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_URL}/products/details/${slug}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error('Product not found');
    const product = await res.json();
    
    return {
      title: `${product.name} | Vanguard Collection`,
      description: product.description?.slice(0, 160) || `Shop ${product.name} – premium streetwear.`,
      openGraph: {
        title: product.name,
        description: product.description?.slice(0, 160),
        images: product.images?.[0] ? [{ url: product.images[0] }] : [],
        type: 'website', // ✅ Fixed: changed from 'product' to 'website'
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.description?.slice(0, 160),
        images: product.images?.[0] ? [product.images[0]] : [],
      },
    };
  } catch (error) {
    console.error('Metadata fetch failed:', error);
    return {
      title: 'Product Not Found | Vanguard',
      description: 'The requested product could not be found.',
    };
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  let product = null;

  try {
    const res = await fetch(`${API_URL}/products/details/${slug}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) {
      if (res.status === 404) notFound();
      throw new Error(`HTTP ${res.status}`);
    }
    product = await res.json();
  } catch (err) {
    console.error('Product fetch error:', err);
    notFound();
  }

  const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.[0],
    offers: {
      '@type': 'Offer',
      price: discountedPrice,
      priceCurrency: 'BDT',
      availability: product.sizes?.some(s => s.stock > 0) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    brand: { '@type': 'Brand', name: 'Vanguard' },
    category: product.category?.name,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailsClient product={product} />
    </>
  );
}