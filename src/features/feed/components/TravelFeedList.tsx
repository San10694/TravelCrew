import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { TravelCard } from '@/features/feed/components/TravelCard';
import type { TravelBundle } from '@/features/feed/types/travelBundle';
import { colors, layout, spacing } from '@/features/shared/constants/theme';
import type { FlashListPropsWithEstimate } from '@/features/shared/utils/flashListProps';

type TravelFeedListProps = {
  bundles: TravelBundle[];
};

function TravelFeedListComponent({ bundles }: TravelFeedListProps) {
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
    contentContainerStyle: styles.content,
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
