import { getSettings } from "@/lib/settings";
import Link from "next/link";
import {
  Scale,
  ShoppingBag,
  Truck,
  RotateCcw,
  CreditCard,
  AlertTriangle,
  FileText,
  Gavel,
  Users,
  ArrowLeft,
  Mail,
} from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clothing-e-commerce-web.vercel.app";

export async function generateMetadata() {
  const settings = await getSettings();
  const siteName = settings?.branding?.siteName || "Store";

  return {
    title: `Terms & Conditions | ${siteName}`,
    description: `Read the terms and conditions for using ${siteName}. Understand your rights and obligations when shopping with us.`,
    alternates: {
      canonical: `${SITE_URL}/terms`,
    },
    openGraph: {
      title: `Terms & Conditions | ${siteName}`,
      description: `Terms and conditions for ${siteName}. Understand your rights and obligations when shopping with us.`,
      type: "website",
      url: `${SITE_URL}/terms`,
    },
  };
}

const getSections = (siteName) => [
  {
    icon: FileText,
    title: "General Terms",
    content: [
      `Welcome to ${siteName}. By accessing or using our website, mobile application, or any of our services, you agree to be bound by these Terms and Conditions. Please read them carefully before making any purchase or using our platform.`,
      `These terms apply to all visitors, users, and customers of ${siteName}. If you do not agree with any part of these terms, you should not use our services.`,
    ],
  },
  {
    icon: Users,
    title: "Account Registration",
    content: [
      "To place orders and access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials.",
    ],
    list: [
      "You must provide accurate, current, and complete information during registration",
      "You are responsible for all activities that occur under your account",
      "You must notify us immediately of any unauthorized use of your account",
      "We reserve the right to suspend or terminate accounts that violate these terms",
      "You must be at least 16 years of age to create an account and use our services",
    ],
  },
  {
    icon: ShoppingBag,
    title: "Orders & Purchases",
    content: [
      "When you place an order through our platform, you are making an offer to purchase. We reserve the right to accept or decline any order.",
    ],
    list: [
      "All prices are listed in Bangladeshi Taka (BDT) and include applicable taxes unless stated otherwise",
      "Product availability is subject to change without notice. We do not guarantee stock availability",
      "We reserve the right to limit quantities, cancel orders, or refuse service at our discretion",
      "Order confirmation does not guarantee acceptance. We may cancel orders due to pricing errors, stock issues, or suspected fraud",
      "Product images are for illustration purposes. Actual colors and appearance may vary slightly due to screen differences",
      "Custom or personalized orders cannot be cancelled once production has started",
    ],
  },
  {
    icon: CreditCard,
    title: "Payment Terms",
    content: [
      "We accept various payment methods to ensure a convenient shopping experience:",
    ],
    list: [
      "Online payment via bKash, Nagad, and other mobile banking services",
      "SSL Commerz secure payment gateway for card payments (Visa, Mastercard, etc.)",
      "Cash on Delivery (COD) available for select locations within Bangladesh",
      "Payment must be completed before order processing begins (except COD)",
      "All transactions are processed through secure, encrypted payment gateways",
      "In case of payment failure, the order will be held and you will be notified to retry",
      "Refunds for cancelled or returned orders will be processed to the original payment method within 7-14 business days",
    ],
  },
  {
    icon: Truck,
    title: "Shipping & Delivery",
    content: [
      "We strive to deliver your orders as quickly and efficiently as possible:",
    ],
    list: [
      "Standard delivery within Dhaka: 1-3 business days",
      "Standard delivery outside Dhaka: 3-7 business days",
      "Delivery charges vary based on location and order value. Free shipping may apply on orders above a minimum threshold",
      "You will receive tracking information via SMS or email once your order is shipped",
      "Delivery times are estimates and may vary due to unforeseen circumstances (weather, holidays, etc.)",
      "Please ensure someone is available to receive the delivery at the provided address",
      "Risk of loss passes to you upon delivery of the product to the shipping carrier",
    ],
  },
  {
    icon: RotateCcw,
    title: "Returns & Refunds",
    content: [
      "We want you to be completely satisfied with your purchase. Our return policy is as follows:",
    ],
    list: [
      "Returns are accepted within 7 days of delivery for unused, unworn items in original packaging",
      "Items must be returned with all original tags, labels, and accessories intact",
      "Sale items, undergarments, and personalized products are non-returnable",
      "To initiate a return, contact our customer support through Live Support or email",
      "Return shipping costs are the responsibility of the customer unless the item is defective",
      "Refunds will be processed within 7-14 business days after we receive and inspect the returned item",
      "We reserve the right to decline returns that do not meet our return conditions",
      "Exchanges are subject to product availability",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Limitation of Liability",
    content: [
      `${siteName} and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.`,
    ],
    list: [
      "We do not guarantee that our services will be uninterrupted, secure, or error-free",
      "We are not liable for any damages resulting from unauthorized access to your account",
      "Our total liability for any claim shall not exceed the amount paid by you for the relevant order",
      "We are not responsible for delays caused by third-party shipping or payment providers",
      "Product descriptions and specifications are provided in good faith but may contain errors",
    ],
  },
  {
    icon: Gavel,
    title: "Governing Law",
    content: [
      "These Terms and Conditions are governed by and construed in accordance with the laws of the People's Republic of Bangladesh.",
      "Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts in Dhaka, Bangladesh.",
      `We reserve the right to update or modify these terms at any time. Continued use of ${siteName} after changes constitutes acceptance of the updated terms. We encourage you to review this page periodically.`,
    ],
  },
];

export default async function TermsPage() {
  const settings = await getSettings();
  const siteName = settings?.branding?.siteName || "Store";
  const contact = settings?.contact || {};
  const sections = getSections(siteName);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Terms & Conditions — ${siteName}`,
    description: `Terms and conditions for ${siteName}`,
    url: `${SITE_URL}/terms`,
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
              <Scale size={24} className="text-foreground/70" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] uppercase mb-6">
            Terms &
            <br />
            <span className="text-muted-foreground">Conditions</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium max-w-xl leading-relaxed">
            Please read these terms carefully before using{" "}
            <span className="text-foreground font-bold">{siteName}</span>. By accessing our platform, you agree to comply with and be bound by the following terms and conditions.
          </p>
          <div className="mt-8 flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
            <span>Last Updated: June 2026</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>Version 1.0</span>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-12 pb-24">
        <div className="max-w-3xl">
          {/* Table of Contents */}
          <div className="mb-16 p-6 md:p-8 rounded-[2rem] bg-muted/15 border border-border/5">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-5">
              Table of Contents
            </h2>
            <nav>
              <ol className="space-y-2">
                {sections.map((section, idx) => (
                  <li key={idx}>
                    <a
                      href={`#section-${idx}`}
                      className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1 group"
                    >
                      <span className="text-[10px] font-black text-muted-foreground/40 w-6">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform">
                        {section.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Sections */}
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div
                key={idx}
                id={`section-${idx}`}
                className="mb-14 last:mb-0 scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-accent/80 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-foreground/60" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-muted-foreground/30 tracking-wider">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-tight text-foreground">
                      {section.title}
                    </h2>
                  </div>
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
              <h3 className="text-sm font-black uppercase tracking-wider">Questions?</h3>
            </div>
            <p className="text-sm text-muted-foreground font-medium mb-4">
              If you have any questions about these Terms & Conditions, please contact us:
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
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy →
          </Link>
          <Link href="/live-support" className="text-muted-foreground hover:text-foreground transition-colors">
            Live Support →
          </Link>
        </div>
      </section>
    </main>
  );
}
