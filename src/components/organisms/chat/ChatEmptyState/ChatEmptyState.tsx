import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { PillButton } from '@/components/atoms/PillButton';
import { AvatarIcon } from '@/components/molecules/common/AvatarIcon';
import {
  colors,
  fontFamily,
  spacing,
} from '@/features/shared/constants/theme';

const SUGGESTIONS = [
  'Weekend getaways under $2k',
  'Best beach trips in Asia',
  'Family-friendly Europe bundles',
] as const;

type ChatEmptyStateProps = {
  onSuggestionPress?: (text: string) => void;
};

export function ChatEmptyState({ onSuggestionPress }: ChatEmptyStateProps) {
  return (
    <View style={styles.container}>
      <AvatarIcon label="C" size="lg" />
      <AppText variant="subtitle" style={styles.title}>
        Where to next?
      </AppText>
      <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
        Ask about destinations, budgets, trip types, or get personalized bundle
        recommendations.
      </AppText>
      <View style={styles.chips}>
        {SUGGESTIONS.map((suggestion) => (
          <PillButton
            key={suggestion}
            label={suggestion}
            variant="ghost"
            onPress={() => onSuggestionPress?.(suggestion)}
          />
        ))}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  chips: {
    gap: spacing.sm,
    marginTop: spacing.lg,
    width: '100%',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  title: {
    fontFamily: fontFamily.bold,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
