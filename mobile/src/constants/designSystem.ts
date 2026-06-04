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

export const withAlpha = (hex: string, alpha: number) => {
  const clean = hex.replace('#', '');
  const value = parseInt(clean.length === 3
    ? clean.split('').map((char) => char + char).join('')
    : clean, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

export const getBrandTokens = (theme: 'light' | 'dark') => {
  const scheme = getBrandScheme(theme);
  const isDark = theme === 'dark';

  return {
    ...scheme,
    primary: brandColors.primary,
    accent: brandColors.accent,
    nav: isDark ? '#14100D' : '#3B281A',
    navText: '#FFF8F0',
    surfaceSoft: isDark ? '#241E1A' : '#F1ECE7',
    surfaceMuted: isDark ? '#353537' : '#EFE7DF',
    surfaceElevated: isDark ? '#343436' : '#FFFFFF',
    success: isDark ? '#51B582' : '#217A52',
    danger: isDark ? '#E86B6B' : '#B52323',
    warning: '#C07A22',
    onPrimary: '#FFFFFF',
    iconMuted: isDark ? '#A1A1A6' : '#8C8179',
  } as const;
};

export const getNativeThemeVars = (theme: 'light' | 'dark') => {
  const scheme = getBrandScheme(theme);
  const isDark = theme === 'dark';
  const paletteAliases = isDark
    ? {
        '--color-slate-50': '#241E1A',
        '--color-slate-100': '#2C2C2E',
        '--color-slate-200': '#3A3A3C',
        '--color-slate-300': '#5A5550',
        '--color-slate-400': '#A1A1A6',
        '--color-slate-500': '#A1A1A6',
        '--color-slate-600': '#FFFFFF',
        '--color-zinc-300': '#D8D8DC',
        '--color-zinc-400': '#A1A1A6',
        '--color-zinc-500': '#A1A1A6',
        '--color-zinc-600': '#5A5550',
        '--color-zinc-700': '#3A3A3C',
        '--color-zinc-800': '#3A3A3C',
        '--color-zinc-900': '#2C2C2E',
        '--color-zinc-950': '#1A1410',
        '--color-red-50': '#3A2020',
        '--color-red-200': '#6F3333',
        '--color-red-500': '#E86B6B',
        '--color-red-600': '#E86B6B',
        '--color-emerald-50': '#1F352A',
        '--color-emerald-600': '#51B582',
        '--color-amber-50': '#3A2A2A',
        '--color-amber-100': '#4A3525',
        '--color-amber-500': brandColors.accent,
        '--color-amber-600': brandColors.accent,
        '--color-white': '#FFFFFF',
        '--color-black': '#000000',
      }
    : {
        '--color-slate-50': '#F8F5F2',
        '--color-slate-100': '#F1ECE7',
        '--color-slate-200': '#E5E5E5',
        '--color-slate-300': '#D8CDC4',
        '--color-slate-400': '#8C8179',
        '--color-slate-500': '#6B6B6B',
        '--color-slate-600': '#4A3525',
        '--color-zinc-300': '#D8CDC4',
        '--color-zinc-400': '#8C8179',
        '--color-zinc-500': '#6B6B6B',
        '--color-zinc-600': '#4A3525',
        '--color-zinc-700': '#4A3525',
        '--color-zinc-800': '#E5E5E5',
        '--color-zinc-900': '#FFFFFF',
        '--color-zinc-950': '#F8F5F2',
        '--color-red-50': '#FFF0F0',
        '--color-red-200': '#F1CACA',
        '--color-red-500': '#B52323',
        '--color-red-600': '#B52323',
        '--color-emerald-50': '#EEF7F3',
        '--color-emerald-600': '#217A52',
        '--color-amber-50': '#FFF2F2',
        '--color-amber-100': '#F5D7D7',
        '--color-amber-500': brandColors.accent,
        '--color-amber-600': brandColors.primary,
        '--color-white': '#FFFFFF',
        '--color-black': '#000000',
      };

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
    ...paletteAliases,
  } as const;
};

export const fontClassForLang = (lang: 'en' | 'bn') =>
  lang === 'bn' ? 'font-body' : 'font-body';
