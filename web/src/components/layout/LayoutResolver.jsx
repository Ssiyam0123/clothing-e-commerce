"use client";

import { StandardLayout } from "./identities/Identities";
import { useSettings } from "@/hooks/useSettings";

// Registry for different structural layouts
// We will add identities back 1 by 1
const registry = {
  standard: StandardLayout,
};

export default function LayoutResolver({ theme, children }) {
  const { settings } = useSettings();
  
  // Use standard layout for now
  const Layout = registry.standard;
  
  return <Layout settings={settings}>{children}</Layout>;
}
