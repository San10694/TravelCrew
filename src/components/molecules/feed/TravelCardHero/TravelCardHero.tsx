import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { Rating } from '@/components/atoms/Rating';
import { RemoteImage } from '@/components/atoms/RemoteImage';
import { colors, layout } from '@/features/shared/constants/theme';

type TravelCardHeroProps = {
  imageUrl: string;
  blurhash: string;
  destination: string;
  rating: number;
};

export function TravelCardHero({
  imageUrl,
  blurhash,
  destination,
  rating,
}: TravelCardHeroProps) {
  return (
    <View style={styles.container}>
      <RemoteImage
        uri={imageUrl}
        blurhash={blurhash}
        width="100%"
        height={layout.heroImageHeight}
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
