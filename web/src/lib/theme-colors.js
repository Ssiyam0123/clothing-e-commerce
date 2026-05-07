/**
 * Utility to set global CSS variables for theme colors.
 * Using OKLCH for perceptually uniform color scaling in Tailwind v4.
 */

export const THEME_COLORS = {
  Zinc: {
    light: { primary: "oklch(0.205 0 0)", primaryForeground: "oklch(0.985 0 0)" },
    dark: { primary: "oklch(0.922 0 0)", primaryForeground: "oklch(0.205 0 0)" },
  },
  Rose: {
    light: { primary: "oklch(0.6 0.22 0)", primaryForeground: "oklch(0.985 0 0)" },
    dark: { primary: "oklch(0.65 0.22 0)", primaryForeground: "oklch(0.1 0 0)" },
  },
  Blue: {
    light: { primary: "oklch(0.6 0.18 250)", primaryForeground: "oklch(0.985 0 0)" },
    dark: { primary: "oklch(0.65 0.18 250)", primaryForeground: "oklch(0.1 0 0)" },
  },
  Green: {
    light: { primary: "oklch(0.6 0.18 150)", primaryForeground: "oklch(0.985 0 0)" },
    dark: { primary: "oklch(0.65 0.18 150)", primaryForeground: "oklch(0.1 0 0)" },
  },
  Orange: {
    light: { 
      primary: "oklch(0.7 0.16 45)", 
      primaryForeground: "oklch(0.985 0 0)",
      background: "oklch(0.99 0.01 45)",
      foreground: "oklch(0.15 0.05 45)" 
    },
    dark: { 
      primary: "oklch(0.65 0.16 45)", 
      primaryForeground: "oklch(0.1 0 0)",
      background: "oklch(0.12 0.04 45)",
      foreground: "oklch(0.98 0.02 45)"
    },
  },
  Slate: {
    light: { primary: "oklch(0.279 0.041 260.031)", primaryForeground: "oklch(0.985 0 0)" },
    dark: { primary: "oklch(0.898 0.014 249.584)", primaryForeground: "oklch(0.21 0.006 285.885)" },
  }
};

export default function setGlobalColorTheme(mode, colorName) {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  const colors = THEME_COLORS[colorName] || THEME_COLORS.Zinc;
  const palette = mode === "dark" ? colors.dark : colors.light;

  // Set Core Primary Colors
  root.style.setProperty("--primary", palette.primary);
  root.style.setProperty("--primary-foreground", palette.primaryForeground);
  
  // Set Optional Background/Foreground Overrides
  if (palette.background) {
    root.style.setProperty("--background", palette.background);
  } else {
    root.style.removeProperty("--background");
  }

  if (palette.foreground) {
    root.style.setProperty("--foreground", palette.foreground);
  } else {
    root.style.removeProperty("--foreground");
  }

  // Set the accent color variable for specific legacy components
  root.style.setProperty("--accent-secondary", palette.primary);
}


