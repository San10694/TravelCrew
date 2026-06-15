/** Horizontal FlashList of day-by-day itinerary items inside an expanded TravelCard. */
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { ItineraryRow } from '@/components/molecules/feed/ItineraryRow';
import type { ItineraryItem } from '@/features/feed/types/travelBundle';
import { colors, fontFamily, layout, spacing } from '@/features/shared/constants/theme';
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
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: layout.itinerarySectionHeight,
    paddingTop: spacing.sm,
  },
  content: {
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingRight: spacing.lg,
  },
  sectionLabel: {
    fontFamily: fontFamily.semiBold,
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    textTransform: 'uppercase',
  },
});
