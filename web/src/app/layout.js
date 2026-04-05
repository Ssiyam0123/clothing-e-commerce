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

export const metadata = {
  title: "Vanguard | Premium Urban Apparel & Streetwear",
  description: "Discover the latest sustainable streetwear. Ethical fabrics, bold silhouettes, free shipping on orders over $100.",
  keywords: "streetwear, urban fashion, sustainable clothing, Vanguard",
  authors: [{ name: "Vanguard Team" }],
  openGraph: {
    title: "Vanguard – The Architecture of Style",
    description: "Ethical fabrics, bold silhouettes. Shop the new collection.",
    url: "https://yourdomain.com",
    siteName: "Vanguard",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vanguard Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vanguard | Premium Urban Apparel",
    description: "Ethical fabrics, bold silhouettes.",
    images: ["https://yourdomain.com/og-image.jpg"],
    site: "@vanguard",
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
    canonical: "https://yourdomain.com",
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
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body suppressHydrationWarning>
        <QueryProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}