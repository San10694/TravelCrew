import { memo, useEffect } from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ItineraryList } from '@/features/feed/components/ItineraryList';
import type { ItineraryItem } from '@/features/feed/types/travelBundle';
import { layout } from '@/features/shared/constants/theme';

type ExpandableDetailsProps = {
  isExpanded: boolean;
  itinerary: ItineraryItem[];
};

function ExpandableDetailsComponent({ isExpanded, itinerary }: ExpandableDetailsProps) {
  const expanded = useSharedValue(isExpanded ? 1 : 0);

  useEffect(() => {
    expanded.value = withTiming(isExpanded ? 1 : 0, { duration: 300 });
  }, [expanded, isExpanded]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: interpolate(expanded.value, [0, 1], [0, layout.itinerarySectionHeight]),
    opacity: expanded.value,
    overflow: 'hidden' as const,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ItineraryList items={itinerary} />
    </Animated.View>
  );
}

export const ExpandableDetails = memo(ExpandableDetailsComponent);
