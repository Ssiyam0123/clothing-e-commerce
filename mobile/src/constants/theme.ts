/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#F8F5F2',
    backgroundElement: '#F1ECE7',
    backgroundSelected: '#E5E5E5',
    textSecondary: '#6B6B6B',
    primary: '#4A3525',
    accent: '#E59A9A',
    surface: '#FFFFFF',
    border: '#E5E5E5',
    success: '#217A52',
    danger: '#B52323',
    warning: '#C07A22',
  },
  dark: {
    text: '#FFFFFF',
    background: '#1A1410',
    backgroundElement: '#241E1A',
    backgroundSelected: '#3A3A3C',
    textSecondary: '#A1A1A6',
    primary: '#4A3525',
    accent: '#E59A9A',
    surface: '#2C2C2E',
    border: '#3A3A3C',
    success: '#51B582',
    danger: '#E86B6B',
    warning: '#C07A22',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
