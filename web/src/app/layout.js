import QueryProvider from "@/components/providers/QueryProvider";
import ClientWrapper from "@/components/layout/ClientWrapper";
import "./globals.css";

export const metadata = {
  title: "Your Clothing Brand",
  description: "Shop the latest trends",
  verification: {
    // Check your Search Console "HTML Tag" option for this string
    google: process.env.GOOGLE_VERIFICATION, 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <QueryProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}