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

export function NativeMetricText({
  label,
  value,
  valueColor = colors.surface,
}: NativeMetricTextProps) {
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
