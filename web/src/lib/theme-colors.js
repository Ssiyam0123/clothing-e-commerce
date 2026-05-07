/**
 * Utility to set global CSS variables for theme colors.
 * Using OKLCH for perceptually uniform color scaling in Tailwind v4.
 */

export const THEME_COLORS = {
  Zinc: {
    light: { 
      primary: "oklch(0.205 0 0)", 
      primaryForeground: "oklch(0.985 0 0)",
      background: "oklch(1 0 0)",
      foreground: "oklch(0.145 0 0)",
      card: "oklch(0.985 0 0)",
      cardForeground: "oklch(0.145 0 0)",
      mutedForeground: "oklch(0.45 0 0)"
    },
    dark: { 
      primary: "oklch(0.922 0 0)", 
      primaryForeground: "oklch(0.205 0 0)",
      background: "oklch(0.145 0 0)",
      foreground: "oklch(0.985 0 0)",
      card: "oklch(0.185 0 0)",
      cardForeground: "oklch(0.985 0 0)",
      mutedForeground: "oklch(0.75 0 0)"
    },
  },
  Rose: {
    light: { 
      primary: "oklch(0.5 0.15 0)", 
      primaryForeground: "oklch(0.985 0 0)",
      background: "oklch(0.96 0.02 0)",
      foreground: "oklch(0.2 0.05 0)",
      card: "oklch(0.98 0.03 0)",
      cardForeground: "oklch(0.2 0.05 0)",
      mutedForeground: "oklch(0.45 0.05 0)"
    },
    dark: { 
      primary: "oklch(0.7 0.12 0)", 
      primaryForeground: "oklch(0.1 0 0)",
      background: "oklch(0.15 0.06 0)",
      foreground: "oklch(0.95 0.03 0)",
      card: "oklch(0.18 0.08 0)",
      cardForeground: "oklch(0.95 0.03 0)",
      mutedForeground: "oklch(0.75 0.05 0)"
    },
  },
  Blue: {
    light: { 
      primary: "oklch(0.55 0.15 250)", 
      primaryForeground: "oklch(0.985 0 0)",
      background: "oklch(0.95 0.03 250)",
      foreground: "oklch(0.15 0.05 250)",
      card: "oklch(0.97 0.04 250)",
      cardForeground: "oklch(0.15 0.05 250)",
      mutedForeground: "oklch(0.45 0.05 250)"
    },
    dark: { 
      primary: "oklch(0.75 0.12 250)", 
      primaryForeground: "oklch(0.05 0 0)",
      background: "oklch(0.12 0.05 250)",
      foreground: "oklch(0.94 0.03 250)",
      card: "oklch(0.15 0.06 250)",
      cardForeground: "oklch(0.94 0.03 250)",
      mutedForeground: "oklch(0.7 0.05 250)"
    },
  },
  Green: {
    light: { 
      primary: "oklch(0.55 0.15 160)", 
      primaryForeground: "oklch(0.985 0 0)",
      background: "oklch(0.95 0.03 160)",
      foreground: "oklch(0.15 0.05 160)",
      card: "oklch(0.97 0.04 160)",
      cardForeground: "oklch(0.15 0.05 160)",
      mutedForeground: "oklch(0.45 0.05 160)"
    },
    dark: { 
      primary: "oklch(0.75 0.12 160)", 
      primaryForeground: "oklch(0.05 0 0)",
      background: "oklch(0.12 0.05 160)",
      foreground: "oklch(0.94 0.03 160)",
      card: "oklch(0.15 0.06 160)",
      cardForeground: "oklch(0.94 0.03 160)",
      mutedForeground: "oklch(0.7 0.05 160)"
    },
  },
  Orange: {
    light: { 
      primary: "oklch(0.6 0.18 45)", 
      primaryForeground: "oklch(0.985 0 0)",
      background: "oklch(0.97 0.03 45)",
      foreground: "oklch(0.15 0.05 45)",
      card: "oklch(0.98 0.04 45)",
      cardForeground: "oklch(0.15 0.05 45)",
      mutedForeground: "oklch(0.45 0.05 45)"
    },
    dark: { 
      primary: "oklch(0.75 0.15 45)", 
      primaryForeground: "oklch(0.1 0 0)",
      background: "oklch(0.15 0.06 45)",
      foreground: "oklch(0.96 0.03 45)",
      card: "oklch(0.18 0.08 45)",
      cardForeground: "oklch(0.96 0.03 45)",
      mutedForeground: "oklch(0.7 0.05 45)"
    },
  },
  Amethyst: {
    light: { 
      primary: "oklch(0.5 0.15 300)", 
      primaryForeground: "oklch(0.985 0 0)",
      background: "oklch(0.96 0.02 300)",
      foreground: "oklch(0.2 0.05 300)",
      card: "oklch(0.98 0.03 300)",
      cardForeground: "oklch(0.2 0.05 300)",
      mutedForeground: "oklch(0.45 0.05 300)"
    },
    dark: { 
      primary: "oklch(0.7 0.12 300)", 
      primaryForeground: "oklch(0.1 0 0)",
      background: "oklch(0.15 0.06 300)",
      foreground: "oklch(0.95 0.03 300)",
      card: "oklch(0.18 0.08 300)",
      cardForeground: "oklch(0.95 0.03 300)",
      mutedForeground: "oklch(0.75 0.05 300)"
    },
  },
  Citrine: {
    light: { 
      primary: "oklch(0.7 0.15 80)", 
      primaryForeground: "oklch(0.1 0 0)",
      background: "oklch(0.97 0.03 80)",
      foreground: "oklch(0.15 0.05 80)",
      card: "oklch(0.98 0.04 80)",
      cardForeground: "oklch(0.15 0.05 80)",
      mutedForeground: "oklch(0.45 0.05 80)"
    },
    dark: { 
      primary: "oklch(0.85 0.15 85)", 
      primaryForeground: "oklch(0.05 0 0)",
      background: "oklch(0.18 0.08 80)",
      foreground: "oklch(0.98 0.04 85)",
      card: "oklch(0.22 0.09 80)",
      cardForeground: "oklch(0.98 0.04 85)",
      mutedForeground: "oklch(0.75 0.05 85)"
    },
  },
  Ruby: {
    light: { 
      primary: "oklch(0.45 0.18 25)", 
      primaryForeground: "oklch(0.985 0 0)",
      background: "oklch(0.96 0.02 25)",
      foreground: "oklch(0.2 0.05 25)",
      card: "oklch(0.98 0.03 25)",
      cardForeground: "oklch(0.2 0.05 25)",
      mutedForeground: "oklch(0.45 0.05 25)"
    },
    dark: { 
      primary: "oklch(0.65 0.18 25)", 
      primaryForeground: "oklch(0.1 0 0)",
      background: "oklch(0.15 0.06 25)",
      foreground: "oklch(0.95 0.03 25)",
      card: "oklch(0.18 0.08 25)",
      cardForeground: "oklch(0.95 0.03 25)",
      mutedForeground: "oklch(0.7 0.05 25)"
    },
  },
  Teal: {
    light: { 
      primary: "oklch(0.5 0.1 200)", 
      primaryForeground: "oklch(0.985 0 0)",
      background: "oklch(0.95 0.03 200)",
      foreground: "oklch(0.15 0.05 200)",
      card: "oklch(0.97 0.04 200)",
      cardForeground: "oklch(0.15 0.05 200)",
      mutedForeground: "oklch(0.45 0.05 200)"
    },
    dark: { 
      primary: "oklch(0.7 0.1 200)", 
      primaryForeground: "oklch(0.05 0 0)",
      background: "oklch(0.12 0.05 200)",
      foreground: "oklch(0.94 0.03 200)",
      card: "oklch(0.15 0.06 200)",
      cardForeground: "oklch(0.94 0.03 200)",
      mutedForeground: "oklch(0.7 0.05 200)"
    },
  },
  Brown: {
    light: { 
      primary: "oklch(0.45 0.08 40)", 
      primaryForeground: "oklch(0.985 0 0)",
      background: "oklch(0.95 0.02 40)",
      foreground: "oklch(0.15 0.04 40)",
      card: "oklch(0.97 0.03 40)",
      cardForeground: "oklch(0.15 0.04 40)",
      mutedForeground: "oklch(0.45 0.04 40)"
    },
    dark: { 
      primary: "oklch(0.65 0.08 40)", 
      primaryForeground: "oklch(0.1 0 0)",
      background: "oklch(0.15 0.04 40)",
      foreground: "oklch(0.95 0.02 40)",
      card: "oklch(0.18 0.05 40)",
      cardForeground: "oklch(0.95 0.02 40)",
      mutedForeground: "oklch(0.7 0.04 40)"
    },
  },
  Slate: {
    light: { 
      primary: "oklch(0.279 0.041 260.031)", 
      primaryForeground: "oklch(0.985 0 0)",
      background: "oklch(1 0 0)",
      foreground: "oklch(0.145 0 0)",
      card: "oklch(0.98 0.01 260)",
      cardForeground: "oklch(0.145 0 0)",
      mutedForeground: "oklch(0.45 0.01 260)"
    },
    dark: { 
      primary: "oklch(0.898 0.014 249.584)", 
      primaryForeground: "oklch(0.21 0.006 285.885)",
      background: "oklch(0.15 0.02 260)",
      foreground: "oklch(0.98 0.01 260)",
      card: "oklch(0.18 0.03 260)",
      cardForeground: "oklch(0.98 0.01 260)",
      mutedForeground: "oklch(0.7 0.01 260)"
    },
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

  // Set Card Colors
  if (palette.card) {
    root.style.setProperty("--card", palette.card);
  }
  if (palette.cardForeground) {
    root.style.setProperty("--card-foreground", palette.cardForeground);
  }

  // Set Muted Colors for Contrast
  if (palette.mutedForeground) {
    root.style.setProperty("--muted-foreground", palette.mutedForeground);
  }

  // Set the accent color variable for specific legacy components
  root.style.setProperty("--accent-secondary", palette.primary);
}
