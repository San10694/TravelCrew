import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { ItineraryRow } from '@/components/molecules/feed/ItineraryRow';
import type { ItineraryItem } from '@/features/feed/types/travelBundle';
import { colors, layout, spacing } from '@/features/shared/constants/theme';
import type { FlashListPropsWithEstimate } from '@/features/shared/utils/flashListProps';

type ItineraryListProps = {
  items: ItineraryItem[];
};

export function ItineraryList({ items }: ItineraryListProps) {
  const listProps: FlashListPropsWithEstimate<ItineraryItem> = {
    data: items,
    horizontal: true,
    renderItem: ({ item }: ListRenderItemInfo<ItineraryItem>) => (
      <ItineraryRow item={item} />
    ),
    keyExtractor: (item) => item.id,
    estimatedItemSize: layout.itineraryImageWidth + spacing.md,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: styles.content,
  };

  return (
    <View style={styles.container}>
      <AppText variant="caption" color={colors.textSecondary} style={styles.sectionLabel}>
        Itinerary
      </AppText>
      <FlashList {...listProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: layout.itinerarySectionHeight,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  sectionLabel: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    textTransform: 'uppercase',
  },
});
