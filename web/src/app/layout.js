import QueryProvider from "@/components/providers/QueryProvider";
import ClientWrapper from "@/components/layout/ClientWrapper";
import "./globals.css";

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