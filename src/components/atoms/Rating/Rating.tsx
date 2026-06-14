import { StyleSheet, Text, View } from 'react-native';

import {
  colors,
  fontFamily,
  radii,
  spacing,
  typography,
} from '@/features/shared/constants/theme';

type RatingProps = {
  value: number;
  variant?: 'default' | 'frosted';
};

export function Rating({ value, variant = 'default' }: RatingProps) {
  const isFrosted = variant === 'frosted';

  return (
    <View style={[styles.container, isFrosted && styles.frosted]}>
      <Text style={[styles.star, isFrosted && styles.frostedStar]}>★</Text>
      <Text style={[styles.value, isFrosted && styles.frostedValue]}>
        {value.toFixed(1)}
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  frosted: {
    backgroundColor: colors.frosted,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  frostedStar: {
    color: colors.warning,
  },
  frostedValue: {
    color: colors.text,
  },
  star: {
    color: colors.warning,
    fontSize: typography.body,
  },
  value: {
    color: colors.text,
    fontFamily: fontFamily.semiBold,
    fontSize: typography.body,
  },
});
