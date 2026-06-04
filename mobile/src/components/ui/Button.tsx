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

  let variantClass = 'bg-primary border-primary';
  let textClass = 'text-primary-foreground';
  let indicatorColor = '#FFF8F0';

  if (variant === 'secondary') {
    variantClass = 'bg-accent border-accent';
    textClass = 'text-accent-foreground';
    indicatorColor = '#2A1C13';
  } else if (variant === 'danger') {
    variantClass = 'bg-danger border-danger';
    textClass = 'text-primary-foreground';
  } else if (variant === 'outline') {
    variantClass = 'bg-transparent border border-border';
    textClass = 'text-primary';
    indicatorColor = '#4A3525';
  } else if (variant === 'ghost') {
    variantClass = 'bg-transparent border-transparent';
    textClass = 'text-primary';
    indicatorColor = '#4A3525';
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
      >
        {loading ? <ActivityIndicator color={indicatorColor} className="mr-2" /> : null}
        <Text className={`${textClass} ${fontClass} text-center ${textClassName}`}>
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
