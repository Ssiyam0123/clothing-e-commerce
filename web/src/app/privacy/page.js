import { getSettings } from "@/lib/settings";
import Link from "next/link";
import { Shield, Lock, Eye, Database, Cookie, UserCheck, Globe, Mail, ArrowLeft } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clothing-e-commerce-web.vercel.app";

export async function generateMetadata() {
  const settings = await getSettings();
  const siteName = settings?.branding?.siteName || "Store";

  return {
    title: `Privacy Policy | ${siteName}`,
    description: `Read the privacy policy of ${siteName}. Learn how we collect, use, and protect your personal data when you shop with us.`,
    alternates: {
      canonical: `${SITE_URL}/privacy`,
    },
    openGraph: {
      title: `Privacy Policy | ${siteName}`,
      description: `Read the privacy policy of ${siteName}. Learn how we collect, use, and protect your personal data.`,
      type: "website",
      url: `${SITE_URL}/privacy`,
    },
  };
}

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      "When you visit our website, register an account, place an order, or interact with our services, we may collect the following types of information:",
    ],
    list: [
      "Personal identification — name, email address, phone number, shipping and billing addresses",
      "Payment information — processed securely through our payment partners (bKash, SSLCommerz). We do not store your full card or mobile banking details",
      "Device & usage data — IP address, browser type, operating system, pages viewed, and time spent on our site",
      "Order history — past purchases, wishlist items, and cart contents",
      "Communication records — messages sent through live support or customer service",
    ],
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      "We use the information we collect to provide, maintain, and improve our services:",
    ],
    list: [
      "Process and fulfill your orders, including delivery and payment confirmation",
      "Send order status updates and shipping notifications via SMS or email",
      "Provide customer support and respond to your inquiries",
      "Personalize your shopping experience with relevant product recommendations",
      "Send promotional emails and offers (you can unsubscribe at any time)",
      "Detect and prevent fraud, unauthorized access, and other security threats",
      "Analyze website traffic and usage patterns to improve our platform",
    ],
  },
  {
    icon: Lock,
    title: "Data Protection & Security",
    content: [
      "We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
    ],
    list: [
      "SSL/TLS encryption for all data transmitted between your browser and our servers",
      "Secure, encrypted storage of sensitive personal data",
      "Regular security audits and vulnerability assessments",
      "Access controls limiting employee access to personal data on a need-to-know basis",
      "PCI-compliant payment processing through trusted third-party providers",
    ],
  },
  {
    icon: Cookie,
    title: "Cookies & Tracking",
    content: [
      "We use cookies and similar technologies to enhance your browsing experience:",
    ],
    list: [
      "Essential cookies — required for site functionality, login sessions, and shopping cart",
      "Analytics cookies — help us understand how visitors interact with our site (Google Analytics)",
      "Marketing cookies — used to deliver relevant advertisements and track campaign performance",
      "You can manage cookie preferences through your browser settings at any time",
    ],
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    content: [
      "You have the following rights regarding your personal data:",
    ],
    list: [
      "Access — request a copy of the personal data we hold about you",
      "Correction — request corrections to any inaccurate or incomplete data",
      "Deletion — request deletion of your account and associated personal data",
      "Opt-out — unsubscribe from marketing communications at any time",
      "Data portability — request your data in a structured, commonly used format",
      "To exercise any of these rights, contact us at the email address below",
    ],
  },
  {
    icon: Globe,
    title: "Third-Party Services",
    content: [
      "We may share limited information with trusted third-party services that help us operate our business:",
    ],
    list: [
      "Payment processors (bKash, SSLCommerz) for secure transaction processing",
      "Delivery partners for order fulfillment and shipment tracking",
      "Analytics providers (Google Analytics) for website performance insights",
      "Cloud hosting services for secure data storage and server infrastructure",
      "We do not sell, trade, or rent your personal information to third parties for their marketing purposes",
    ],
  },
  {
    icon: Mail,
    title: "Contact Us",
    content: [
      "If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal data, please don't hesitate to reach out to us. We are committed to addressing your privacy concerns promptly.",
      "You can contact us through our website's Live Support feature, or by emailing our support team. We aim to respond to all privacy-related inquiries within 48 hours.",
    ],
  },
];

export default async function PrivacyPolicyPage() {
  const settings = await getSettings();
  const siteName = settings?.branding?.siteName || "Store";
  const contact = settings?.contact || {};

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Privacy Policy — ${siteName}`,
    description: `Privacy policy for ${siteName}`,
    url: `${SITE_URL}/privacy`,
    publisher: {
      "@type": "Organization",
      name: siteName,
    },
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-secondary/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-secondary/5 blur-[150px] rounded-full" />

        <div className="relative max-w-screen-xl mx-auto px-6 lg:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors mb-10 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Store
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-border/10 flex items-center justify-center">
              <Shield size={24} className="text-foreground/70" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] uppercase mb-6">
            Privacy
            <br />
            <span className="text-muted-foreground">Policy</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium max-w-xl leading-relaxed">
            At <span className="text-foreground font-bold">{siteName}</span>, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information when you use our services.
          </p>
          <div className="mt-8 flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
            <span>Last Updated: June 2026</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>Effective Immediately</span>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-12 pb-24">
        <div className="max-w-3xl">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div
                key={idx}
                className="mb-14 last:mb-0"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-accent/80 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-foreground/60" />
                  </div>
                  <h2 className="text-lg md:text-xl font-black uppercase tracking-tight text-foreground">
                    {section.title}
                  </h2>
                </div>

                <div className="pl-12 space-y-4">
                  {section.content.map((paragraph, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-sm text-muted-foreground leading-relaxed font-medium"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.list && (
                    <ul className="space-y-3 mt-4">
                      {section.list.map((item, lIdx) => (
                        <li
                          key={lIdx}
                          className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary/40 mt-2 shrink-0" />
                          <span className="font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        {contact.email && (
          <div className="mt-16 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-muted/20 border border-border/5 max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Mail size={18} className="text-accent-secondary" />
              <h3 className="text-sm font-black uppercase tracking-wider">Get In Touch</h3>
            </div>
            <p className="text-sm text-muted-foreground font-medium mb-4">
              For privacy-related inquiries, contact us at:
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="text-sm font-bold text-foreground hover:text-accent-secondary transition-colors underline underline-offset-4"
            >
              {contact.email}
            </a>
          </div>
        )}

        {/* Related Links */}
        <div className="mt-12 flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em]">
          <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
            Terms & Conditions →
          </Link>
          <Link href="/live-support" className="text-muted-foreground hover:text-foreground transition-colors">
            Live Support →
          </Link>
        </div>
      </section>
    </main>
  );
}
