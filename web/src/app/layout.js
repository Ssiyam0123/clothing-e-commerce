import QueryProvider from "@/components/providers/QueryProvider";
import ClientWrapper from "@/components/layout/ClientWrapper";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://clothing-e-commerce-web.vercel.app';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vanguard | Premium Urban Apparel & Streetwear",
    template: "%s | Vanguard",
  },
  description:
    "Discover the latest sustainable streetwear at Vanguard. Ethical fabrics, bold silhouettes, and premium urban apparel. Free shipping on orders over $100.",
  keywords: ["streetwear", "urban fashion", "sustainable clothing", "Vanguard", "premium apparel", "ethical fashion"],
  authors: [{ name: "Vanguard Team" }],
  creator: "Vanguard Team",
  publisher: "Vanguard",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Vanguard – The Architecture of Style",
    description: "Ethical fabrics, bold silhouettes. Shop the new collection of premium sustainable streetwear.",
    url: SITE_URL,
    siteName: "Vanguard",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vanguard Premium Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vanguard | Premium Urban Apparel",
    description: "Ethical fabrics, bold silhouettes. Discover sustainable streetwear.",
    images: ["/og-image.jpg"],
    site: "@vanguard",
    creator: "@vanguard",
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
    // Add bing verification if available
    // bing: "...",
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

// Separate viewport export (required for Next.js 14+)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": "Vanguard Premium Streetwear",
    "image": `${SITE_URL}/og-image.jpg`,
    "@id": `${SITE_URL}/#vanguard`,
    "url": SITE_URL,
    "telephone": "+8801234567890",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Gulshan Avenue",
      "addressLocality": "Dhaka",
      "postalCode": "1212",
      "addressCountry": "BD"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.7925,
      "longitude": 90.4078
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      "https://facebook.com/vanguard",
      "https://instagram.com/vanguard",
      "https://twitter.com/vanguard"
    ]
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
          <ClientWrapper>{children}</ClientWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
