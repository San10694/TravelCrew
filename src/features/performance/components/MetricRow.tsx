import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/features/shared/constants/theme';

type MetricRowProps = {
  label: string;
  value: string;
  valueColor?: string;
};

function MetricRowComponent({ label, value, valueColor = colors.surface }: MetricRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

export const MetricRow = memo(MetricRowComponent);

const styles = StyleSheet.create({
  label: {
    color: '#CBD5E1',
    fontSize: typography.caption,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.body,
    fontWeight: '700',
  },
});
