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

export function useTheme() {
  const pathname = usePathname();
  const { theme, themeColor, themeFont, identityTheme } = useAppStore();

  useEffect(() => {
    const applyTheme = (targetTheme, targetColor, targetFont) => {
      const root = document.documentElement;
      
      // ✅ Handle Color Mode
      root.classList.remove("light", "dark");
      const resolvedMode = targetTheme === "system" 
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : targetTheme;

      root.classList.add(resolvedMode);
      root.setAttribute("data-color-mode", resolvedMode);

      // ✅ Apply Global Color Theme (Zinc, Rose, etc.)
      setGlobalColorTheme(resolvedMode, targetColor);

      // ✅ Apply Theme Font
      if (targetFont) {
        const fontValue = FONT_MAPPING[targetFont] || "var(--font-inter)";
        root.style.setProperty("--font-theme", `${fontValue}, sans-serif`);
      }
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
    const root = document.documentElement;
    // Remove previous identity themes
    root.classList.remove(...IDENTITY_THEMES);

    if (identityTheme) {
      root.classList.add(identityTheme);
      root.setAttribute("data-theme", identityTheme);
    }
  }, [identityTheme]);
}
