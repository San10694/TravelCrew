import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet } from 'react-native';

import { layout } from '@/features/shared/constants/theme';

type TravelCardHeroProps = {
  imageUrl: string;
  blurhash: string;
};

function TravelCardHeroComponent({ imageUrl, blurhash }: TravelCardHeroProps) {
  return (
    <Image
      source={imageUrl}
      placeholder={{ blurhash }}
      style={styles.image}
      contentFit="cover"
      cachePolicy="memory-disk"
      transition={200}
    />
  );
}

export const TravelCardHero = memo(TravelCardHeroComponent);

const styles = StyleSheet.create({
  image: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: layout.heroImageHeight,
    width: '100%',
  },
});
