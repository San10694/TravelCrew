import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { Platform, StyleSheet } from 'react-native';

import { TravelCard } from '@/components/organisms/feed/TravelCard';
import type { TravelBundle } from '@/features/feed/types/travelBundle';
import { colors, layout, spacing } from '@/features/shared/constants/theme';
import type { FlashListPropsWithEstimate } from '@/features/shared/utils/flashListProps';

type TravelFeedListProps = {
  bundles: TravelBundle[];
  contentBottomPadding?: number;
};

export function TravelFeedList({
  bundles,
  contentBottomPadding = 0,
}: TravelFeedListProps) {
  const listProps: FlashListPropsWithEstimate<TravelBundle> = {
    data: bundles,
    renderItem: ({ item }: ListRenderItemInfo<TravelBundle>) => (
      <TravelCard bundle={item} />
    ),
    keyExtractor: (item) => item.id,
    estimatedItemSize: layout.collapsedCardHeight,
    drawDistance: layout.collapsedCardHeight * 2,
    removeClippedSubviews: Platform.OS === 'android',
    contentContainerStyle: [styles.content, { paddingBottom: contentBottomPadding }],
    showsVerticalScrollIndicator: false,
  };

  return <FlashList {...listProps} />;
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
});
