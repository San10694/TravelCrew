import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { Divider } from '@/components/atoms/Divider';
import { colors, spacing } from '@/features/shared/constants/theme';

type ScreenHeaderProps = {
  title: string;
  subtitle: string;
};

export function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <AppText variant="display">{title}</AppText>
      <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
        {subtitle}
      </AppText>
      <Divider style={styles.divider} />
    </View>
  );
}


const styles = StyleSheet.create({
  divider: {
    marginTop: spacing.md,
  },
  header: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
});
