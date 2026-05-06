import QueryProvider from "@/components/providers/QueryProvider";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

import { headers } from "next/headers";
import { getSettings } from "@/lib/settings";
import { getImageUrl } from "@/utils/imageUtils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://clothing-e-commerce-web.vercel.app';

export async function generateMetadata() {
  const settings = await getSettings();
  const branding = settings?.branding || {};
  const siteName = branding.siteName || 'VANGUARD';
  const siteTitle = branding.siteTitle || 'Premium Urban Apparel & Streetwear';
  const description = settings?.branding?.description || "Discover the latest sustainable streetwear at Vanguard. Ethical fabrics, bold silhouettes, and premium urban apparel.";
  const favicon = branding.favicon ? getImageUrl(branding.favicon) : "/favicon.ico";
  const ogImage = branding.headerLogo ? getImageUrl(branding.headerLogo) : "/og-image.jpg";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteTitle,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: ["streetwear", "urban fashion", "sustainable clothing", siteName, "premium apparel", "ethical fashion"],
    authors: [{ name: `${siteName} Team` }],
    creator: `${siteName} Team`,
    publisher: siteName,
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: `${siteName} – The Architecture of Style`,
      description,
      url: SITE_URL,
      siteName: siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteName} Premium Collection`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} | Premium Urban Apparel`,
      description,
      images: [ogImage],
      site: `@${siteName.toLowerCase()}`,
      creator: `@${siteName.toLowerCase()}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION,
    },
    alternates: {
      canonical: SITE_URL,
      languages: {
        'en-US': '/en',
        'bn-BD': '/bn',
      },
    },
    other: {
      "facebook-domain-verification": process.env.FB_DOMAIN_VERIFICATION || "",
    },
  };
}

// Separate viewport export (required for Next.js 14+)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ClientInitialization from '@/components/layout/ClientInitialization';
import SupportChat from '@/components/chat/SupportChat';

export default async function RootLayout({ children }) {
  const settings = await getSettings();
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";
  
  const branding = settings?.branding || {};
  const contact = settings?.contact || {};
  const siteName = branding.siteName || "Vanguard Premium Streetwear";
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://clothing-e-commerce-web.vercel.app';

  // Maintenance Mode Check - Skip for admin routes
  const isAdminRoute = pathname.startsWith('/admin');
  const isMaintenance = settings?.config?.maintenanceMode && !isAdminRoute;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": siteName,
    "image": branding.headerLogo || `${SITE_URL}/og-image.jpg`,
    "@id": `${SITE_URL}/#vanguard`,
    "url": SITE_URL,
    "telephone": contact.phone || "+8801234567890",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": contact.address || "Gulshan Avenue",
      "addressLocality": "Dhaka",
      "postalCode": "1212",
      "addressCountry": "BD"
    },
    "sameAs": settings?.socialLinks?.map(l => l.url) || []
  };

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body suppressHydrationWarning>
        <QueryProvider>
          <ClientInitialization />
          {isMaintenance ? (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6">
              <h1 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-4">Under Maintenance</h1>
              <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px]">We are upgrading the protocol. Check back soon.</p>
              <div className="mt-10 w-20 h-[2px] bg-rose-600 animate-pulse" />
            </div>
          ) : (
            <>
              {!isAdminRoute && <Navbar settings={settings} />}
              <main className={!isAdminRoute ? 'min-h-screen' : ''}>
                {children}
              </main>
              {!isAdminRoute && <Footer settings={settings} />}
              {!isAdminRoute && <SupportChat />}
            </>
          )}
        </QueryProvider>
      </body>
    </html>
  );
}
