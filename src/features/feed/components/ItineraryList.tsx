import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { ItineraryRow } from '@/features/feed/components/ItineraryRow';
import type { ItineraryItem } from '@/features/feed/types/travelBundle';
import { layout, spacing } from '@/features/shared/constants/theme';
import type { FlashListPropsWithEstimate } from '@/features/shared/utils/flashListProps';

type ItineraryListProps = {
  items: ItineraryItem[];
};

function ItineraryListComponent({ items }: ItineraryListProps) {
  const keyExtractor = useCallback((item: ItineraryItem) => item.id, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ItineraryItem>) => <ItineraryRow item={item} />,
    [],
  );

  const listProps: FlashListPropsWithEstimate<ItineraryItem> = {
    data: items,
    horizontal: true,
    renderItem,
    keyExtractor,
    estimatedItemSize: layout.itineraryImageWidth + spacing.md,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: styles.content,
  };

  return (
    <View style={styles.container}>
      <FlashList {...listProps} />
    </View>
  );
}

export const ItineraryList = memo(ItineraryListComponent);

const styles = StyleSheet.create({
  container: {
    height: layout.itinerarySectionHeight,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
