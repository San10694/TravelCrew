/**
 * Animated height container for itinerary section inside TravelCard.
 * Interpolates expandedProgress (0→1) to layout.itinerarySectionHeight; mounts ItineraryList when expanded.
 */
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { ItineraryList } from '@/components/molecules/feed/ItineraryList';
import type { ItineraryItem } from '@/features/feed/types/travelBundle';
import { layout } from '@/features/shared/constants/theme';

type ExpandableDetailsProps = {
  isExpanded: boolean;
  expandedProgress: SharedValue<number>;
  itinerary: ItineraryItem[];
};

export function ExpandableDetails({
  isExpanded,
  expandedProgress,
  itinerary,
}: ExpandableDetailsProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    height: interpolate(expandedProgress.value, [0, 1], [0, layout.itinerarySectionHeight]),
    opacity: expandedProgress.value,
    overflow: 'hidden' as const,
  }));

  return (
    <Animated.View style={animatedStyle}>
      {isExpanded ? <ItineraryList items={itinerary} /> : null}
    </Animated.View>
  );
}

