import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import type { ItineraryItem } from '@/features/feed/types/travelBundle';
import { AppText } from '@/features/shared/ui/AppText';
import { RemoteImage } from '@/features/shared/ui/RemoteImage';
import { colors, layout, radii, spacing } from '@/features/shared/constants/theme';

type ItineraryRowProps = {
  item: ItineraryItem;
};

function ItineraryRowComponent({ item }: ItineraryRowProps) {
  return (
    <View style={styles.container}>
      <RemoteImage
        uri={item.imageUrl}
        blurhash={item.blurhash}
        width={layout.itineraryImageWidth}
        height={layout.itineraryImageHeight}
        borderRadius={radii.md}
      />
      <AppText variant="caption" color={colors.textSecondary} style={styles.day}>
        Day {item.day}
      </AppText>
      <AppText variant="body" numberOfLines={1} style={styles.title}>
        {item.title}
      </AppText>
    </View>
  );
}

export const ItineraryRow = memo(ItineraryRowComponent);

const styles = StyleSheet.create({
  container: {
    marginRight: spacing.md,
    width: layout.itineraryImageWidth,
  },
  day: {
    marginTop: spacing.xs,
  },
  title: {
    marginTop: 2,
  },
});
