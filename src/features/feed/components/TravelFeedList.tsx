import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { memo, useCallback } from 'react';
import { Platform, StyleSheet } from 'react-native';

import { TravelCard } from '@/features/feed/components/TravelCard';
import type { TravelBundle } from '@/features/feed/types/travelBundle';
import { colors, layout, spacing } from '@/features/shared/constants/theme';
import type { FlashListPropsWithEstimate } from '@/features/shared/utils/flashListProps';

type TravelFeedListProps = {
  bundles: TravelBundle[];
  contentBottomPadding?: number;
};

function TravelFeedListComponent({
  bundles,
  contentBottomPadding = 0,
}: TravelFeedListProps) {
  const keyExtractor = useCallback((item: TravelBundle) => item.id, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TravelBundle>) => <TravelCard bundle={item} />,
    [],
  );

  const listProps: FlashListPropsWithEstimate<TravelBundle> = {
    data: bundles,
    renderItem,
    keyExtractor,
    estimatedItemSize: layout.collapsedCardHeight,
    drawDistance: layout.collapsedCardHeight * 2,
    removeClippedSubviews: Platform.OS === 'android',
    contentContainerStyle: [styles.content, { paddingBottom: contentBottomPadding }],
    showsVerticalScrollIndicator: false,
  };

  return <FlashList {...listProps} />;
}

export const TravelFeedList = memo(TravelFeedListComponent);

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
});
