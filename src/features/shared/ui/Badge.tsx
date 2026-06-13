import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/features/shared/constants/theme';

type BadgeProps = {
  label: string;
};

function BadgeComponent({ label }: BadgeProps) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

export const Badge = memo(BadgeComponent);

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  text: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
