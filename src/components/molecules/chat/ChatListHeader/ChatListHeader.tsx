import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { AvatarIcon } from '@/components/molecules/common/AvatarIcon';
import { colors, fontFamily, spacing } from '@/features/shared/constants/theme';

export function ChatListHeader() {
  return (
    <View style={styles.header}>
      <AvatarIcon label="TC" size="sm" />
      <View style={styles.headerText}>
        <AppText variant="subtitle" style={styles.title}>
          Travel Crew
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          Your AI travel assistant
        </AppText>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingTop: spacing.xs,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamily.bold,
  },
});
