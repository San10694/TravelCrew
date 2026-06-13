import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { MetricRow } from '@/features/performance/components/MetricRow';
import { usePerformanceStore } from '@/features/performance/store/performanceStore';
import { colors, spacing, typography } from '@/features/shared/constants/theme';
import { useRerenderLogger } from '@/features/shared/utils/rerenderLogger';

function FpsMetric() {
  const fps = usePerformanceStore((state) => state.fps);
  const color = fps >= 55 ? colors.success : fps >= 45 ? colors.warning : colors.danger;
  return <MetricRow label="FPS" value={String(fps)} valueColor={color} />;
}

function FrameDropsMetric() {
  const frameDrops = usePerformanceStore((state) => state.frameDrops);
  return <MetricRow label="Frame Drops" value={String(frameDrops)} />;
}

function JsThreadMetric() {
  const jsThreadStatus = usePerformanceStore((state) => state.jsThreadStatus);
  const color = jsThreadStatus === 'Healthy' ? colors.success : colors.danger;
  return <MetricRow label="JS Thread" value={jsThreadStatus} valueColor={color} />;
}

function P50Metric() {
  const p50FrameTime = usePerformanceStore((state) => state.p50FrameTime);
  return <MetricRow label="P50 Frame Time" value={`${p50FrameTime}ms`} />;
}

function P95Metric() {
  const p95FrameTime = usePerformanceStore((state) => state.p95FrameTime);
  return <MetricRow label="P95 Frame Time" value={`${p95FrameTime}ms`} />;
}

function WorstFrameMetric() {
  const worstFrameTime = usePerformanceStore((state) => state.worstFrameTime);
  return <MetricRow label="Worst Frame" value={`${worstFrameTime}ms`} />;
}

function PerformanceOverlayComponent() {
  useRerenderLogger('PerformanceOverlay');

  const isOverlayVisible = usePerformanceStore((state) => state.isOverlayVisible);

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
        <FpsMetric />
        <FrameDropsMetric />
        <JsThreadMetric />
        <P50Metric />
        <P95Metric />
        <WorstFrameMetric />
      </Animated.View>
    </GestureDetector>
  );
}

export const PerformanceOverlay = memo(PerformanceOverlayComponent);

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: colors.overlay,
    borderRadius: 12,
    left: 0,
    padding: spacing.md,
    position: 'absolute',
    top: 0,
    width: 220,
    zIndex: 9999,
  },
  title: {
    color: colors.surface,
    fontSize: typography.subtitle,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
});
