import React, { useMemo } from 'react';
import { Pressable, Text, ActivityIndicator, Animated, GestureResponderEvent } from 'react-native';

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

  // Build variant classes
  let variantClass = 'bg-primary border-primary';
  let textClass = 'text-white';

  if (variant === 'secondary') {
    variantClass = 'bg-slate-200 border-slate-200 dark:bg-zinc-800 dark:border-zinc-800';
    textClass = 'text-foreground';
  } else if (variant === 'danger') {
    variantClass = 'bg-red-500 border-red-500';
    textClass = 'text-white';
  } else if (variant === 'outline') {
    variantClass = 'bg-transparent border border-border';
    textClass = 'text-foreground';
  } else if (variant === 'ghost') {
    variantClass = 'bg-transparent border-transparent';
    textClass = 'text-foreground';
  }

  // Size classes
  let sizeClass = 'py-3 px-6 rounded-xl';
  let fontClass = 'text-base font-semibold';

  if (size === 'sm') {
    sizeClass = 'py-2 px-4 rounded-lg';
    fontClass = 'text-sm font-semibold';
  } else if (size === 'lg') {
    sizeClass = 'py-4 px-8 rounded-2xl';
    fontClass = 'text-lg font-bold';
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }} className="w-full">
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        className={`flex-row items-center justify-center border ${variantClass} ${sizeClass} ${disabled ? 'opacity-50' : ''} ${className}`}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#141414' : '#FFFFFF'} className="mr-2" />
        ) : null}
        <Text className={`${textClass} ${fontClass} text-center ${textClassName}`}>
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
