import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { ItineraryItem } from '@/features/feed/types/travelBundle';
import { colors, layout, spacing, typography } from '@/features/shared/constants/theme';

type ItineraryRowProps = {
  item: ItineraryItem;
};

function ItineraryRowComponent({ item }: ItineraryRowProps) {
  return (
    <View style={styles.container}>
      <Image
        source={item.imageUrl}
        placeholder={{ blurhash: item.blurhash }}
        style={styles.image}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={150}
      />
      <Text style={styles.day}>Day {item.day}</Text>
      <Text style={styles.title} numberOfLines={1}>
        {item.title}
      </Text>
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
    color: colors.textSecondary,
    fontSize: typography.caption,
    marginTop: spacing.xs,
  },
  image: {
    borderRadius: 10,
    height: layout.itineraryImageHeight,
    width: layout.itineraryImageWidth,
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600',
    marginTop: 2,
  },
});
