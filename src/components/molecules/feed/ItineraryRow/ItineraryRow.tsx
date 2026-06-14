import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { RemoteImage } from '@/components/atoms/RemoteImage';
import type { ItineraryItem } from '@/features/feed/types/travelBundle';
import { colors, layout, radii, spacing } from '@/features/shared/constants/theme';

type ItineraryRowProps = {
  item: ItineraryItem;
};

export function ItineraryRow({ item }: ItineraryRowProps) {
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
