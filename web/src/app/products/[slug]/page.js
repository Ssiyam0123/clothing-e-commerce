import { notFound } from 'next/navigation';
import ProductDetailsClient from './ProductDetailsClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://clothing-e-commerce-web.vercel.app';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_URL}/products/details/${slug}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error('Product not found');
    const product = await res.json();
    
    const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
    const isAvailable = product.sizes?.some(s => s.stock > 0);
    const imageUrl = product.images?.[0] ? (product.images[0].startsWith('http') ? product.images[0] : `${SITE_URL}${product.images[0]}`) : `${SITE_URL}/og-image.jpg`;

    return {
      title: `${product.name} | Vanguard Collection`,
      description: product.description?.slice(0, 160) || `Shop ${product.name} – premium streetwear from Vanguard.`,
      keywords: [product.name, product.category?.name, "streetwear", "Vanguard"],
      openGraph: {
        title: product.name,
        description: product.description?.slice(0, 160),
        images: [{ url: imageUrl, width: 1200, height: 630, alt: product.name }],
        type: 'website',
        siteName: 'Vanguard',
        url: `${SITE_URL}/products/${slug}`,
        // Custom Product OG tags
        'og:price:amount': discountedPrice.toString(),
        'og:price:currency': 'BDT',
        'og:availability': isAvailable ? 'instock' : 'oos',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.description?.slice(0, 160),
        images: [imageUrl],
        'twitter:label1': 'Price',
        'twitter:data1': `৳${discountedPrice.toFixed(0)}`,
        'twitter:label2': 'Availability',
        'twitter:data2': isAvailable ? 'In Stock' : 'Out of Stock',
      },
      other: {
        'product:brand': 'Vanguard',
        'product:category': product.category?.name || 'Streetwear',
        'product:price:amount': discountedPrice.toString(),
        'product:price:currency': 'BDT',
        'product:availability': isAvailable ? 'instock' : 'oos',
      },
      alternates: {
        canonical: `${SITE_URL}/products/${slug}`,
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
  const isAvailable = product.sizes?.some(s => s.stock > 0);
  
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.map(img => img.startsWith('http') ? img : `${SITE_URL}${img}`),
    sku: product.sku || product._id,
    brand: { '@type': 'Brand', name: 'Vanguard' },
    category: product.category?.name,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${slug}`,
      priceCurrency: 'BDT',
      price: discountedPrice,
      priceValidUntil: '2027-01-01',
      availability: isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Vanguard' },
    },
    aggregateRating: product.totalReviews > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.averageRating || 5,
      reviewCount: product.totalReviews || 1,
    } : undefined,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.category?.name || 'Collection',
        item: `${SITE_URL}/products?category=${product.category?._id}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${SITE_URL}/products/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailsClient product={product} />
    </>
  );
}