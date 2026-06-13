import { memo, useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  colors,
  fontFamily,
  layout,
  radii,
  shadows,
  spacing,
} from '@/features/shared/constants/theme';

type FeedFabProps = {
  onPress: () => void;
  visible?: boolean;
};

function FeedFabComponent({ onPress, visible = true }: FeedFabProps) {
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 200 });
  }, [opacity, visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.wrapper,
        { bottom: spacing.lg + insets.bottom },
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={!visible}
        style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
      >
        <Text style={styles.icon}>✦</Text>
        <Text style={styles.label}>Ask Crew</Text>
      </Pressable>
    </Animated.View>
  );
}

export const FeedFab = memo(FeedFabComponent);

const styles = StyleSheet.create({
  fab: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: spacing.xs,
    height: layout.fabSize,
    justifyContent: 'center',
    minWidth: layout.fabMinWidth,
    paddingHorizontal: spacing.lg,
    ...shadows.fab,
  },
  icon: {
    color: colors.surface,
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  label: {
    color: colors.surface,
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
  },
  pressed: {
    opacity: 0.88,
  },
  wrapper: {
    position: 'absolute',
    right: spacing.lg,
    zIndex: 10,
  },
});
