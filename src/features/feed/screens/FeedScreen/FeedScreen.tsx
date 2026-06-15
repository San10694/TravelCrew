/**
 * Discover Trips route screen. Composes header, skeleton, and TravelFeedList.
 * Calls useFeedScreen() only — no direct store/repository access (MVVM boundary).
 */
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/molecules/common/ScreenHeader';
import { FeedSkeletonList } from '@/components/organisms/feed/FeedSkeletonList';
import { TravelFeedList } from '@/components/organisms/feed/TravelFeedList';
import { useFeedScreen } from '@/features/feed/hooks/useFeedScreen';
import { colors } from '@/features/shared/constants/theme';
import { useRerenderLogger } from '@/features/shared/utils/rerenderLogger';

export function FeedScreen() {
  useRerenderLogger('FeedScreen');

  const { bundles, isReady, isRefreshing, refresh, contentBottomPadding } = useFeedScreen();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Discover Trips"
        subtitle="Curated travel bundles for your next adventure"
      />
      {isReady ? (
        <TravelFeedList
          bundles={bundles}
          contentBottomPadding={contentBottomPadding}
          refreshing={isRefreshing}
          onRefresh={refresh}
        />
      ) : (
        <FeedSkeletonList />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
});
