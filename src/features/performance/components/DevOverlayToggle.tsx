import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDevOverlayToggle } from '@/features/performance/hooks/usePerformanceOverlay';
import { colors, spacing, typography } from '@/features/shared/constants/theme';

function DevOverlayToggleComponent() {
  const insets = useSafeAreaInsets();
  const { isOverlayVisible, toggleOverlay } = useDevOverlayToggle();

  return (
    <Pressable
      onPress={toggleOverlay}
      style={[styles.button, { top: insets.top + spacing.sm }]}
    >
      <Text style={styles.label}>{isOverlayVisible ? 'Hide Perf' : 'Perf'}</Text>
    </Pressable>
  );
}

export const DevOverlayToggle = memo(DevOverlayToggleComponent);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.text,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    position: 'absolute',
    right: spacing.lg,
    zIndex: 9998,
  },
  label: {
    color: colors.surface,
    fontSize: typography.caption,
    fontWeight: '700',
  },
});
