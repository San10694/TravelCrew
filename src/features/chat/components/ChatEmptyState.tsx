import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/features/shared/ui/AppText';
import { PillButton } from '@/features/shared/ui/PillButton';
import {
  colors,
  fontFamily,
  radii,
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

function ChatEmptyStateComponent({ onSuggestionPress }: ChatEmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <AppText variant="heading" color={colors.primary}>
          C
        </AppText>
      </View>
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

export const ChatEmptyState = memo(ChatEmptyStateComponent);

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
  iconCircle: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    height: 56,
    justifyContent: 'center',
    marginBottom: spacing.md,
    width: 56,
  },
  subtitle: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  title: {
    fontFamily: fontFamily.bold,
    textAlign: 'center',
  },
});
