import React, { useMemo } from 'react';
import { Pressable, Text, ActivityIndicator, Animated, GestureResponderEvent } from 'react-native';
import { getBrandTokens } from '../../constants/designSystem';
import { useAppStore } from '../../store/appStore';

interface ButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
}

export function Button({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  textClassName = '',
}: ButtonProps) {
  const scaleAnim = useMemo(() => new Animated.Value(1), []);
  const theme = useAppStore((s) => s.theme);
  const palette = getBrandTokens(theme);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  let variantClass = 'bg-primary border-primary';
  let textClass = 'text-primary-foreground';
  let backgroundColor: string = palette.primary;
  let borderColor: string = palette.primary;
  let textColor: string = palette.onPrimary;
  let indicatorColor: string = palette.navText;

  if (variant === 'secondary') {
    variantClass = 'bg-accent border-accent';
    textClass = 'text-accent-foreground';
    backgroundColor = palette.accent;
    borderColor = palette.accent;
    textColor = palette.primary;
    indicatorColor = palette.primary;
  } else if (variant === 'danger') {
    variantClass = 'bg-danger border-danger';
    textClass = 'text-primary-foreground';
    backgroundColor = palette.danger;
    borderColor = palette.danger;
    textColor = palette.onPrimary;
  } else if (variant === 'outline') {
    variantClass = 'bg-transparent border border-border';
    textClass = 'text-primary';
    backgroundColor = 'transparent';
    borderColor = palette.border;
    textColor = palette.primary;
    indicatorColor = palette.primary;
  } else if (variant === 'ghost') {
    variantClass = 'bg-transparent border-transparent';
    textClass = 'text-primary';
    backgroundColor = 'transparent';
    borderColor = 'transparent';
    textColor = palette.primary;
    indicatorColor = palette.primary;
  }

  let sizeClass = 'h-12 px-6 rounded-button';
  let fontClass = 'text-xs font-black uppercase tracking-wider';

  if (size === 'sm') {
    sizeClass = 'h-10 px-4 rounded-button';
    fontClass = 'text-[10px] font-black uppercase tracking-wider';
  } else if (size === 'lg') {
    sizeClass = 'h-14 px-8 rounded-card';
    fontClass = 'text-sm font-black uppercase tracking-widest';
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }} className="w-full">
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        className={`flex-row items-center justify-center border ${variantClass} ${sizeClass} ${disabled ? 'opacity-50' : ''} ${className}`}
        style={{ backgroundColor, borderColor, opacity: disabled ? 0.5 : 1 }}
      >
        {loading ? <ActivityIndicator color={indicatorColor} className="mr-2" /> : null}
        <Text className={`${textClass} ${fontClass} text-center ${textClassName}`} style={{ color: textColor }}>
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
