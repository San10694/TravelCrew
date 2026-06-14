import { memo } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';

import { colors, fontFamily, typography } from '@/features/shared/constants/theme';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type NativeMetricTextProps = {
  label: string;
  value: SharedValue<string>;
  valueColor?: string;
};

function NativeMetricTextComponent({ label, value, valueColor = colors.surface }: NativeMetricTextProps) {
  const animatedProps = useAnimatedProps(() => {
    const text = `${label}: ${value.value}`;
    return {
      text,
      defaultValue: text,
    };
  });

  return (
    <AnimatedTextInput
      editable={false}
      style={[styles.metric, { color: valueColor }]}
      animatedProps={animatedProps}
    />
  );
}

export const NativeMetricText = memo(NativeMetricTextComponent);

type StaticMetricTextProps = {
  label: string;
  value: string;
};

function StaticMetricTextComponent({ label, value }: StaticMetricTextProps) {
  return (
    <TextInput
      editable={false}
      style={styles.metric}
      value={`${label}: ${value}`}
    />
  );
}

export const StaticMetricText = memo(StaticMetricTextComponent);

const styles = StyleSheet.create({
  metric: {
    color: colors.surface,
    fontFamily: fontFamily.medium,
    fontSize: typography.caption,
    fontVariant: ['tabular-nums'],
    marginBottom: 4,
    padding: 0,
  },
});
