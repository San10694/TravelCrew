import { Image, type ImageContentFit } from 'expo-image';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { IMAGE_SHIMMER_MIN_MS } from '@/features/shared/constants/loadingTimings';
import { ShimmerBox } from '@/features/shared/ui/ShimmerBox';

type RemoteImageProps = {
  uri: string;
  blurhash: string;
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  contentFit?: ImageContentFit;
  style?: StyleProp<ViewStyle>;
};

function RemoteImageComponent({
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

  const clearHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current !== null) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => clearHideTimeout, [clearHideTimeout]);

  const handleLoadStart = useCallback(() => {
    loadStartedAtRef.current = Date.now();
    setShowShimmer(true);
  }, []);

  const handleLoadEnd = useCallback(() => {
    const startedAt = loadStartedAtRef.current ?? Date.now();
    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(0, IMAGE_SHIMMER_MIN_MS - elapsed);

    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      setShowShimmer(false);
      hideTimeoutRef.current = null;
    }, remaining);
  }, [clearHideTimeout]);

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

export const RemoteImage = memo(RemoteImageComponent);

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
