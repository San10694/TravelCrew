import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/features/shared/constants/theme';

type RatingProps = {
  value: number;
};

function RatingComponent({ value }: RatingProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.star}>★</Text>
      <Text style={styles.value}>{value.toFixed(1)}</Text>
    </View>
  );
}

export const Rating = memo(RatingComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  star: {
    color: colors.warning,
    fontSize: typography.body,
  },
  value: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600',
  },
});
