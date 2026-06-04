export const brandColors = {
  primary: '#4A3525',
  accent: '#E59A9A',
  light: {
    background: '#F8F5F2',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#6B6B6B',
    border: '#E5E5E5',
  },
  dark: {
    background: '#1A1410',
    surface: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#A1A1A6',
    border: '#3A3A3C',
  },
} as const;

export const getBrandScheme = (theme: 'light' | 'dark') =>
  theme === 'dark' ? brandColors.dark : brandColors.light;

export const getNativeThemeVars = (theme: 'light' | 'dark') => {
  const scheme = getBrandScheme(theme);
  const isDark = theme === 'dark';

  return {
    '--background': scheme.background,
    '--foreground': scheme.text,
    '--primary': brandColors.primary,
    '--primary-foreground': '#FFFFFF',
    '--secondary': isDark ? '#7D5A3D' : '#8A6A4F',
    '--secondary-foreground': '#FFFFFF',
    '--accent': brandColors.accent,
    '--accent-foreground': isDark ? brandColors.dark.background : brandColors.primary,
    '--card': scheme.surface,
    '--card-foreground': scheme.text,
    '--surface': scheme.surface,
    '--surface-soft': isDark ? '#241E1A' : '#F1ECE7',
    '--surface-muted': isDark ? '#353537' : '#EFE7DF',
    '--surface-primary': scheme.background,
    '--surface-secondary': scheme.surface,
    '--surface-elevated': isDark ? '#343436' : '#FFFFFF',
    '--muted': isDark ? '#2C2C2E' : '#F0ECE8',
    '--muted-foreground': scheme.textSecondary,
    '--border': scheme.border,
    '--input': scheme.surface,
    '--ring': brandColors.accent,
    '--success': isDark ? '#51B582' : '#217A52',
    '--danger': isDark ? '#E86B6B' : '#B52323',
    '--warning': '#C07A22',
    '--nav': isDark ? '#14100D' : '#3B281A',
    '--nav-foreground': '#FFF8F0',
    '--tab-inactive': scheme.textSecondary,
    '--chip': isDark ? '#2C2C2E' : '#F1ECE7',
    '--chip-active': brandColors.primary,
    '--overlay': isDark ? 'rgba(0, 0, 0, 0.58)' : 'rgba(35, 21, 12, 0.52)',
    '--accent-gold': '#D4AF37',
    '--accent-crimson': brandColors.accent,
    '--accent-slate': scheme.textSecondary,
    '--accent-light': scheme.background,
  } as const;
};

export const fontClassForLang = (lang: 'en' | 'bn') =>
  lang === 'bn' ? 'font-body' : 'font-body';
