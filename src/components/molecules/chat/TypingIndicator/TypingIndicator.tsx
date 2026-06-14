import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, radii, spacing } from '@/features/shared/constants/theme';

type TypingIndicatorProps = {
  isThinking: boolean;
  isStreaming: boolean;
};

function Dot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 350 }),
          withTiming(0.35, { duration: 350 }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export function TypingIndicator({ isThinking, isStreaming }: TypingIndicatorProps) {
  if (!isThinking || isStreaming) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Dot delay={0} />
      <Dot delay={150} />
      <Dot delay={300} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.assistantBubble,
    borderBottomLeftRadius: radii.sm,
    borderBottomRightRadius: radii.lg,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  dot: {
    backgroundColor: colors.textMuted,
    borderRadius: radii.pill,
    height: 7,
    width: 7,
  },
});
