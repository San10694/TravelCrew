import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { usePerformanceMetrics } from '@/features/performance/context/PerformanceMetricsContext';
import {
  NativeMetricText,
  StaticMetricText,
} from '@/features/performance/components/NativeMetricText';
import { usePerformanceStore } from '@/features/performance/store/performanceStore';
import { colors, fontFamily, spacing, typography } from '@/features/shared/constants/theme';

function PercentileMetrics() {
  const p50FrameTime = usePerformanceStore((state) => state.p50FrameTime);
  const p95FrameTime = usePerformanceStore((state) => state.p95FrameTime);
  const worstFrameTime = usePerformanceStore((state) => state.worstFrameTime);

  return (
    <>
      <StaticMetricText label="P50 (1s window)" value={`${p50FrameTime}ms`} />
      <StaticMetricText label="P95 (1s window)" value={`${p95FrameTime}ms`} />
      <StaticMetricText label="Worst (1s window)" value={`${worstFrameTime}ms`} />
    </>
  );
}

function SessionDropsMetric() {
  const frameDrops = usePerformanceStore((state) => state.frameDrops);

  return <StaticMetricText label="Session Drops" value={String(frameDrops)} />;
}

function PerformanceOverlayComponent() {
  const isOverlayVisible = usePerformanceStore((state) => state.isOverlayVisible);
  const { uiFpsText, jsFpsText, jsThreadStatusText } = usePerformanceMetrics();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(16);
  const offsetY = useSharedValue(80);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      offsetX.value += translateX.value;
      offsetY.value += translateY.value;
      translateX.value = 0;
      translateY.value = 0;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value + translateX.value },
      { translateY: offsetY.value + translateY.value },
    ],
  }));

  if (!isOverlayVisible) {
    return null;
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.overlay, animatedStyle]} pointerEvents="box-none">
        <Text style={styles.title}>Performance</Text>
        <Text style={styles.note}>Metrics include dev overlay overhead</Text>
        <NativeMetricText label="UI FPS" value={uiFpsText} />
        <NativeMetricText label="JS FPS" value={jsFpsText} />
        <SessionDropsMetric />
        <NativeMetricText label="JS Scheduling" value={jsThreadStatusText} />
        <PercentileMetrics />
      </Animated.View>
    </GestureDetector>
  );
}

export const PerformanceOverlay = memo(PerformanceOverlayComponent);

const styles = StyleSheet.create({
  note: {
    color: colors.textMuted,
    fontFamily: fontFamily.regular,
    fontSize: typography.caption,
    marginBottom: spacing.sm,
  },
  overlay: {
    backgroundColor: colors.overlay,
    borderRadius: 12,
    left: 0,
    padding: spacing.md,
    position: 'absolute',
    top: 0,
    width: 260,
    zIndex: 9999,
  },
  title: {
    color: colors.surface,
    fontFamily: fontFamily.bold,
    fontSize: typography.subtitle,
    marginBottom: spacing.xs,
  },
});
