import { Image, type ImageContentFit } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ShimmerBox } from '@/components/atoms/ShimmerBox';
import { IMAGE_SHIMMER_MIN_MS } from '@/features/shared/constants/loadingTimings';

type RemoteImageProps = {
  uri: string;
  blurhash: string;
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  contentFit?: ImageContentFit;
  style?: StyleProp<ViewStyle>;
};

export function RemoteImage({
  uri,
  blurhash,
  width,
  height,
  borderRadius = 0,
  contentFit = 'cover',
  style,
}: RemoteImageProps) {
  const [showShimmer, setShowShimmer] = useState(true);
  const loadStartedAtRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearHideTimeout() {
    if (hideTimeoutRef.current !== null) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }

  useEffect(() => () => clearHideTimeout(), []);

  function handleLoadStart() {
    loadStartedAtRef.current = Date.now();
    setShowShimmer(true);
  }

  function handleLoadEnd() {
    const startedAt = loadStartedAtRef.current ?? Date.now();
    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(0, IMAGE_SHIMMER_MIN_MS - elapsed);

    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      setShowShimmer(false);
      hideTimeoutRef.current = null;
    }, remaining);
  }

  return (
    <View style={[styles.container, { borderRadius, height, width }, style]}>
      <Image
        source={uri}
        placeholder={{ blurhash }}
        style={[styles.image, { borderRadius, height, width }]}
        contentFit={contentFit}
        cachePolicy="memory-disk"
        transition={200}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
      />
      {showShimmer ? (
        <View
          pointerEvents="none"
          style={[styles.shimmerOverlay, { borderRadius }]}
        >
          <ShimmerBox width="100%" height={height} borderRadius={borderRadius} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFill,
  },
});
