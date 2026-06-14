import { StyleSheet, Text, View } from 'react-native';

import {
  colors,
  fontFamily,
  radii,
  spacing,
  typography,
} from '@/features/shared/constants/theme';

type BadgeProps = {
  label: string;
};

export function Badge({ label }: BadgeProps) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
  },
  text: {
    color: colors.primary,
    fontFamily: fontFamily.semiBold,
    fontSize: typography.caption,
    textTransform: 'capitalize',
  },
});
