import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Share2 } from 'lucide-react';
import StarRating from '@/components/store/StarRating';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import WishlistButtonClient from '@/components/products/WishlistButtonClient';
import ProductActionsClient from '@/components/products/ProductActionsClient';
import RelatedProducts from '@/components/products/RelatedProducts';
import ReviewSectionWrapper from '@/components/products/ReviewSectionWrapper';
import Loader from '@/components/common/Loader';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://clothing-e-commerce-web.vercel.app';

const DICTIONARY = {
  en: { about: 'Narrative', related: 'The Sequence' },
  bn: { about: 'বিবরণ', related: 'অনুরূপ পণ্য' }
};

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
        'og:price:amount': discountedPrice.toString(),
        'og:price:currency': 'BDT',
        'og:availability': isAvailable ? 'instock' : 'oos',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.description?.slice(0, 160),
        images: [imageUrl],
      },
    };
  } catch (error) {
    return { title: 'Product Not Found | Vanguard' };
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
    notFound();
  }

  const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
  const isAvailable = product.sizes?.some(s => s.stock > 0);
  const lang = 'en'; // Ideally this comes from a layout or cookie, keeping 'en' as default
  const ui = DICTIONARY[lang];

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.map(img => img.startsWith('http') ? img : `${SITE_URL}${img}`),
    sku: product.sku || product._id,
    brand: { '@type': 'Brand', name: 'Vanguard' },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${slug}`,
      priceCurrency: 'BDT',
      price: discountedPrice,
      availability: isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <main className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] transition-colors duration-700">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      <div className="max-w-[1700px] mx-auto pt-24 lg:pt-32 px-4 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 xl:gap-24">
          
          {/* LEFT: Media Section (Client Island) */}
          <div className="lg:col-span-7">
            <ProductImageGallery 
              images={product.images} 
              name={product.name} 
              discount={product.discount} 
            />
          </div>

          {/* RIGHT: Information Engine (Static Shell + Small Client Islands) */}
          <div className="lg:col-span-5 py-6 lg:py-4">
            <section className="space-y-6 mb-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-600">
                    {product.category?.name}
                  </span>
                  <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <div className="flex items-center gap-1.5 opacity-60">
                    <StarRating rating={product.averageRating || 5} size="small" />
                    <span className="text-[9px] font-black dark:text-white">{product.totalReviews || 0}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <WishlistButtonClient product={product} />
                  <button className="p-3 rounded-full text-zinc-300 dark:text-zinc-700 hover:text-rose-500 transition-all">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <h1 className="text-[12vw] md:text-7xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] text-zinc-900 dark:text-white">
                  {product.name}
                </h1>
                <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  {product.description}
                </p>

                {/* AEO / FAQ Section (Static SSR) */}
                <div className="mt-10 space-y-6 border-t border-zinc-100 dark:border-zinc-800 pt-8">
                  <div itemScope itemType="https://schema.org/Question">
                    <h3 itemProp="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-2">Is this fabric sustainable?</h3>
                    <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                      <p itemProp="text" className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Yes, every Vanguard artifact is crafted from ethically sourced, sustainable materials designed for longevity and minimal environmental impact.
                      </p>
                    </div>
                  </div>
                  <div itemScope itemType="https://schema.org/Question">
                    <h3 itemProp="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-2">What is the return policy?</h3>
                    <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                      <p itemProp="text" className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        We offer a 30-day return policy on all unworn items. Your satisfaction is our primary protocol.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Actions (Client Island) */}
            <ProductActionsClient product={product} />
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 mt-24 lg:mt-40 pb-56 lg:pb-32 space-y-24 lg:space-y-48">
        {/* Reviews (Client Island - Lazy) */}
        <ReviewSectionWrapper productId={product._id} />
        
        {/* Related Products (Server Component) */}
        <RelatedProducts 
          categoryId={product.category?._id} 
          currentProductId={product._id} 
          title={ui.related} 
        />
      </div>
    </main>
  );
}