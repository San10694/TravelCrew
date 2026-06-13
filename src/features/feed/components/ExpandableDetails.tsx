import { memo } from 'react';
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { ItineraryList } from '@/features/feed/components/ItineraryList';
import type { ItineraryItem } from '@/features/feed/types/travelBundle';
import { layout } from '@/features/shared/constants/theme';

type ExpandableDetailsProps = {
  isExpanded: boolean;
  expandedProgress: SharedValue<number>;
  itinerary: ItineraryItem[];
};

function ExpandableDetailsComponent({
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

export const ExpandableDetails = memo(ExpandableDetailsComponent);
