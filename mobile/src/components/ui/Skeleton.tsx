import React, { useEffect, useMemo } from 'react';
import { Animated } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function Skeleton({ width = '100%', height = 20, className = '' }: SkeletonProps) {
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
        width: width as any,
        height: height as any,
        overflow: 'hidden',
      }}
      className={`rounded-field bg-surface-muted ${className}`}
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
        }}
        className="bg-card/40"
      />
    </Animated.View>
  );
}
