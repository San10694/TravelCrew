import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TravelFeedList } from '@/features/feed/components/TravelFeedList';
import { FeedSkeletonList } from '@/features/feed/components/FeedSkeletonList';
import { useSimulatedFeedLoad } from '@/features/feed/hooks/useSimulatedFeedLoad';
import { useFeedStore } from '@/features/feed/store/feedStore';
import { AppText } from '@/features/shared/ui/AppText';
import { colors, layout, spacing } from '@/features/shared/constants/theme';
import { useRerenderLogger } from '@/features/shared/utils/rerenderLogger';

function FeedScreenComponent() {
  useRerenderLogger('FeedScreen');

  const bundles = useFeedStore((state) => state.bundles);
  const insets = useSafeAreaInsets();
  const { isReady } = useSimulatedFeedLoad();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <AppText variant="display">Discover Trips</AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Curated travel bundles for your next adventure
        </AppText>
        <View style={styles.divider} />
      </View>
      {isReady ? (
        <TravelFeedList
          bundles={bundles}
          contentBottomPadding={layout.fabSize + spacing.lg * 2 + insets.bottom}
        />
      ) : (
        <FeedSkeletonList />
      )}
    </View>
  );
}

export const FeedScreen = memo(FeedScreenComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  divider: {
    backgroundColor: colors.border,
    height: StyleSheet.hairlineWidth,
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
