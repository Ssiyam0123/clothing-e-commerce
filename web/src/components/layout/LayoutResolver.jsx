"use client";

import { usePathname } from "next/navigation";
import { StandardLayout } from "./identities/Identities";
import { useSettings } from "@/hooks/useSettings";

// Registry for different structural layouts
const registry = {
  standard: StandardLayout,
};

export default function LayoutResolver({ theme, children }) {
  const { settings } = useSettings();
  const pathname = usePathname();
  
  // 🛡️ Admin Route Protection for Layout
  // If we are in the admin dashboard, we don't render the Storefront Navbar/Footer
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <div className="admin-root min-h-screen bg-background">
        {children}
      </div>
    );
  }
  
  // 🏢 Standard Storefront Layout
  const Layout = registry.standard;
  return <Layout settings={settings}>{children}</Layout>;
}
