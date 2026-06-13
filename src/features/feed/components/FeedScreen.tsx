import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TravelFeedList } from '@/features/feed/components/TravelFeedList';
import { useFeedStore } from '@/features/feed/store/feedStore';
import { colors, spacing, typography } from '@/features/shared/constants/theme';
import { useRerenderLogger } from '@/features/shared/utils/rerenderLogger';

function FeedScreenComponent() {
  useRerenderLogger('FeedScreen');

  const bundles = useFeedStore((state) => state.bundles);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Trips</Text>
        <Text style={styles.subtitle}>Curated travel bundles for your next adventure</Text>
      </View>
      <TravelFeedList bundles={bundles} />
    </View>
  );
}

export const FeedScreen = memo(FeedScreenComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    marginTop: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '700',
  },
});
