import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/appStore";
import { setCookie } from "@/utils/cookies";
import setGlobalColorTheme from "@/lib/theme-colors";

const ADMIN_PATH_PREFIX = "/admin";
const IDENTITY_THEMES = ["executive", "streetwear", "earth", "luxury", "cyber"];

const FONT_MAPPING = {
  "Inter": "var(--font-inter)",
  "Roboto": "var(--font-roboto)",
  "Outfit": "var(--font-outfit)",
  "Playfair Display": "var(--font-playfair)",
  "Montserrat": "var(--font-montserrat)",
  "Space Grotesk": "var(--font-space)",
  "Poppins": "var(--font-poppins)",
  "Syncopate": "var(--font-syncopate)"
};

const disableTransitions = () => {
  if (typeof window === "undefined") return () => {};
  const css = document.createElement('style');
  css.type = 'text/css';
  css.appendChild(
    document.createTextNode(
      `* {
         -webkit-transition: none !important;
         -moz-transition: none !important;
         -o-transition: none !important;
         -ms-transition: none !important;
         transition: none !important;
      }`
    )
  );
  document.head.appendChild(css);
  
  return () => {
    // Force reflow to flush style updates
    const _ = window.getComputedStyle(css).opacity;
    requestAnimationFrame(() => {
      try {
        document.head.removeChild(css);
      } catch (e) {}
    });
  };
};

export function useTheme() {
  const pathname = usePathname();
  const { theme, themeColor, themeFont, identityTheme } = useAppStore();

  useEffect(() => {
    const applyTheme = (targetTheme, targetColor, targetFont) => {
      if (typeof window === "undefined") return;
      const enable = disableTransitions();
      const root = document.documentElement;
      
      // 1️⃣ Determine Mode
      const resolvedMode = targetTheme === "system" 
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : (targetTheme || "light");

      // 2️⃣ Sync Classes
      // Force remove all potential mode classes to avoid hybrid states
      root.classList.remove("light", "dark");
      root.classList.add(resolvedMode);
      
      // 3️⃣ Sync Data Attributes (for CSS selectors)
      root.setAttribute("data-color-mode", resolvedMode);
      
      // 4️⃣ Apply Global Color Theme (Zinc, Rose, etc.)
      setGlobalColorTheme(resolvedMode, targetColor);

      // 5️⃣ Apply Theme Font
      if (targetFont) {
        const fontValue = FONT_MAPPING[targetFont] || "var(--font-inter)";
        root.style.setProperty("--font-theme", `${fontValue}, sans-serif`);
      }
      
      enable();
    };

    applyTheme(theme, themeColor, themeFont);

    // Watch for system theme changes if in 'system' mode
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system", themeColor, themeFont);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, themeColor, themeFont]);

  // Handle Identity Themes (executive, streetwear, etc.)
  useEffect(() => {
    const enable = disableTransitions();
    const root = document.documentElement;
    // Remove previous identity themes
    root.classList.remove(...IDENTITY_THEMES);

    if (identityTheme) {
      root.classList.add(identityTheme);
      root.setAttribute("data-theme", identityTheme);
    }
    enable();
  }, [identityTheme]);
}
