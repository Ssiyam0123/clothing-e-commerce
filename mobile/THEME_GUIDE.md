# Drip Nation - Mobile Theme Styling Guide

This guide explains how to use the **Rose / Warm Espresso** color theme in the mobile application (React Native / Expo). It documents the color values and provides copy-pasteable code examples showing how to style components in both **Light Mode** and **Dark Mode**.

---

## 1. The Rose Palette Values

| Component Property | Light Mode | Dark Mode | Description |
| :--- | :--- | :--- | :--- |
| **Primary** | `#4A3525` | `#4A3525` | Deep Rosewood / Espresso (Theme main color) |
| **Accent** | `#E59A9A` | `#E59A9A` | Soft Rose / Accent pink |
| **Background** | `#F8F5F2` | `#1A1410` | Screen background color |
| **Surface / Card** | `#FFFFFF` | `#2C2C2E` | Container cards, inputs, drop-downs |
| **Surface Soft** | `#F1ECE7` | `#241E1A` | Selected tab backdrops, pill items |
| **Text (Main)** | `#1A1A1A` | `#FFFFFF` | Bold headings, titles, price text |
| **Text Muted** | `#6B6B6B` | `#A1A1A6` | Description text, dates, subheadings |
| **Border** | `#E5E5E5` | `#3A3A3C` | Thin separation lines |
| **Success** | `#217A52` | `#51B582` | Positive badges / Green highlights |
| **Danger** | `#B52323` | `#E86B6B` | Error text / Cancelled badges / Red |

---

## 2. Option A: Using Tailwind / NativeWind Classes (Recommended)

NativeWind compiles colors directly from [global.css](file:///d:/pg/clothing-e-commerce-main/clothing-e-commerce-main/mobile/src/global.css) to native styling variables. You can write class names exactly like standard web Tailwind.

### Example: Card Component
```tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';

export function PremiumCard({ title, subtitle, price }) {
  return (
    // Container uses: bg-card, border-border, dark:bg-card-dark, etc.
    <View className="p-4 rounded-3xl border border-border bg-card dark:bg-zinc-900 shadow-md">
      {/* Muted Text */}
      <Text className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
        {subtitle}
      </Text>
      
      {/* Main Text */}
      <Text className="mt-1 text-base font-black text-foreground">
        {title}
      </Text>
      
      {/* Pricing / Custom Scheme */}
      <View className="mt-4 flex-row items-center justify-between">
        <Text className="text-lg font-black text-foreground italic">
          ৳{price}
        </Text>
        
        {/* Button using brand Primary color */}
        <Pressable className="bg-primary px-4 py-2 rounded-xl active:scale-95">
          <Text className="text-xs font-black uppercase text-primary-foreground">
            Buy Now
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
```

---

## 3. Option B: Using Style Objects programmatically (JS constants)

For styling things that cannot use NativeWind (like SVG color props, shadows, or library components), use the dynamic design system helper [designSystem.ts](file:///d:/pg/clothing-e-commerce-main/clothing-e-commerce-main/mobile/src/constants/designSystem.ts).

### Example: Programmatic Color & Custom Shadow
```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useAppStore } from '../../store/appStore';
import { getBrandScheme } from '../../constants/designSystem';
import { Star } from 'lucide-react-native';

export function StarRatingCard({ rating }) {
  const theme = useAppStore((s) => s.theme);
  const colors = getBrandScheme(theme); // Resolves automatically based on light/dark mode

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        // Native shadow properties must be specified in style objects
        shadowColor: theme === 'dark' ? '#000000' : '#4A3525',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: theme === 'dark' ? 0.4 : 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
      className="p-4 border rounded-3xl"
    >
      <Text style={{ color: colors.text }} className="text-sm font-bold">
        User Review Rating
      </Text>
      
      <View className="flex-row items-center gap-1 mt-2">
        {/* Pass dynamically resolved colors directly into vector icons */}
        <Star size={16} color={colors.accent || '#E59A9A'} fill={colors.accent || '#E59A9A'} />
        <Text style={{ color: colors.textSecondary }} className="text-xs font-semibold">
          {rating} / 5.0
        </Text>
      </View>
    </View>
  );
}
```

---

## 4. Key Takeaways for Developers:
1. Always add `dark:` prefix to class names for dark mode variants (e.g., `text-foreground dark:text-white`).
2. Avoid hardcoding hex colors (like `#FFFFFF` or `#000000`) inside styles. Instead, use Tailwind classes like `bg-background`, `bg-card`, `border-border`, and `text-foreground`.
3. Use the helper `getBrandScheme(theme)` to dynamically support SVG strokes, indicators, or loading spinners.
