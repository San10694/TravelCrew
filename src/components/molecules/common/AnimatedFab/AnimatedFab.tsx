import { useEffect } from 'react';
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

type AnimatedFabProps = {
  label: string;
  icon: string;
  onPress: () => void;
  visible?: boolean;
};

export function AnimatedFab({
  label,
  icon,
  onPress,
  visible = true,
}: AnimatedFabProps) {
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(visible ? 1 : 0);
  const translateY = useSharedValue(visible ? 0 : 8);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withTiming(0, { duration: 200 });
      return;
    }

    opacity.value = 0;
    translateY.value = 8;
  }, [opacity, translateY, visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
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
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}


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
