import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { usePerformanceStore } from '@/features/performance/store/performanceStore';
import { colors, spacing, typography } from '@/features/shared/constants/theme';

function DevOverlayToggleComponent() {
  const toggleOverlay = usePerformanceStore((state) => state.toggleOverlay);
  const isOverlayVisible = usePerformanceStore((state) => state.isOverlayVisible);

  return (
    <Pressable onPress={toggleOverlay} style={styles.button}>
      <Text style={styles.label}>{isOverlayVisible ? 'Hide Perf' : 'Perf'}</Text>
    </Pressable>
  );
}

export const DevOverlayToggle = memo(DevOverlayToggleComponent);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.text,
    borderRadius: 20,
    bottom: spacing.lg,
    left: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    position: 'absolute',
    zIndex: 9998,
  },
  label: {
    color: colors.surface,
    fontSize: typography.caption,
    fontWeight: '700',
  },
});
