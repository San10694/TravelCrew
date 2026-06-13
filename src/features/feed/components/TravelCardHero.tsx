import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/features/shared/ui/AppText';
import { Rating } from '@/features/shared/ui/Rating';
import { colors, layout } from '@/features/shared/constants/theme';

type TravelCardHeroProps = {
  imageUrl: string;
  blurhash: string;
  destination: string;
  rating: number;
};

function TravelCardHeroComponent({
  imageUrl,
  blurhash,
  destination,
  rating,
}: TravelCardHeroProps) {
  return (
    <View style={styles.container}>
      <Image
        source={imageUrl}
        placeholder={{ blurhash }}
        style={styles.image}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={200}
      />
      <View style={styles.scrimFade} pointerEvents="none" />
      <View style={styles.scrim} pointerEvents="none" />
      <View style={styles.overlayContent}>
        <AppText variant="heading" color={colors.surface} style={styles.destination}>
          {destination}
        </AppText>
        <Rating value={rating} variant="frosted" />
      </View>
    </View>
  );
}

export const TravelCardHero = memo(TravelCardHeroComponent);

const styles = StyleSheet.create({
  container: {
    height: layout.heroImageHeight,
    position: 'relative',
    width: '100%',
  },
  destination: {
    flex: 1,
    marginRight: 8,
  },
  image: {
    height: layout.heroImageHeight,
    width: '100%',
  },
  overlayContent: {
    alignItems: 'flex-end',
    bottom: 0,
    flexDirection: 'row',
    left: 0,
    padding: 16,
    position: 'absolute',
    right: 0,
  },
  scrim: {
    backgroundColor: colors.overlayScrim,
    bottom: 0,
    height: '40%',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  scrimFade: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    bottom: '40%',
    height: '15%',
    left: 0,
    position: 'absolute',
    right: 0,
  },
});
