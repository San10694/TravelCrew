/**
 * Draggable dev-only HUD showing UI/JS FPS and supplementary frame metrics.
 * Reads Reanimated shared values for FPS; Zustand for percentiles and drops.
 */
import { StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { NativeMetricText } from '@/components/molecules/performance/NativeMetricText';
import { StaticMetricText } from '@/components/molecules/performance/StaticMetricText';
import { usePerformanceOverlay } from '@/features/performance/hooks/usePerformanceOverlay';
import { colors, fontFamily, spacing, typography } from '@/features/shared/constants/theme';

export function PerformanceOverlay() {
  const {
    isOverlayVisible,
    uiFpsText,
    jsFpsText,
    jsThreadStatusText,
    p50FrameTime,
    p95FrameTime,
    worstFrameTime,
    frameDrops,
  } = usePerformanceOverlay();

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
        <StaticMetricText label="Session Drops" value={String(frameDrops)} />
        <NativeMetricText label="JS Scheduling" value={jsThreadStatusText} />
        <StaticMetricText label="P50 (1s window)" value={`${p50FrameTime}ms`} />
        <StaticMetricText label="P95 (1s window)" value={`${p95FrameTime}ms`} />
        <StaticMetricText label="Worst (1s window)" value={`${worstFrameTime}ms`} />
      </Animated.View>
    </GestureDetector>
  );
}


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
