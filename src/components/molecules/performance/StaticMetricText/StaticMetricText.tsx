import { StyleSheet, TextInput } from 'react-native';

import { colors, fontFamily, typography } from '@/features/shared/constants/theme';

type StaticMetricTextProps = {
  label: string;
  value: string;
};

export function StaticMetricText({ label, value }: StaticMetricTextProps) {
  return (
    <TextInput
      editable={false}
      style={styles.metric}
      value={`${label}: ${value}`}
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
