import React, { useEffect, useMemo } from 'react';
import { Animated, Platform, useColorScheme } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function Skeleton({ width = '100%', height = 20, className = '' }: SkeletonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const shimmerAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <Animated.View
      style={{
        width: typeof width === 'number' ? width : undefined,
        height: typeof height === 'number' ? height : undefined,
        backgroundColor: isDark
          ? 'rgba(39,39,42,0.7)'
          : Platform.select({
              ios: 'rgba(226,232,240,0.7)',
              default: '#E2E8F0',
            }),
        borderRadius: 12,
        overflow: 'hidden',
      }}
      className={className}
    >
      {/* Shimmer overlay */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '100%',
          transform: [{ translateX }],
          backgroundColor: isDark
            ? 'rgba(255,255,255,0.06)'
            : Platform.select({
                ios: 'rgba(255,255,255,0.45)',
                default: 'rgba(255,255,255,0.4)',
              }),
        }}
      />
    </Animated.View>
  );
}
