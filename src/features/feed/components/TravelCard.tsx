import { useRecyclingState } from '@shopify/flash-list';
import { memo, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';

import { ExpandableDetails } from '@/features/feed/components/ExpandableDetails';
import { TravelCardHero } from '@/features/feed/components/TravelCardHero';
import type { TravelBundle } from '@/features/feed/types/travelBundle';
import { AppText } from '@/features/shared/ui/AppText';
import { Badge } from '@/features/shared/ui/Badge';
import { PillButton } from '@/features/shared/ui/PillButton';
import { colors, fontFamily, radii, shadows, spacing } from '@/features/shared/constants/theme';

type TravelCardProps = {
  bundle: TravelBundle;
};

function TravelCardComponent({ bundle }: TravelCardProps) {
  const [isExpanded, setIsExpanded] = useRecyclingState(false, [bundle.id]);
  const expandedProgress = useSharedValue(0);

  useEffect(() => {
    expandedProgress.value = 0;
  }, [bundle.id, expandedProgress]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((current) => {
      const nextExpanded = !current;
      expandedProgress.value = withTiming(nextExpanded ? 1 : 0, { duration: 300 });
      return nextExpanded;
    });
  }, [expandedProgress, setIsExpanded]);

  return (
    <View style={styles.card}>
      <TravelCardHero
        imageUrl={bundle.heroImage}
        blurhash={bundle.heroBlurhash}
        destination={bundle.destination}
        rating={bundle.rating}
      />

      <View style={styles.content}>
        <Badge label={bundle.tripType} />

        <View style={styles.metaRow}>
          <AppText variant="heading" color={colors.text} style={styles.price}>
            ${bundle.price.toLocaleString()}
          </AppText>
          <AppText variant="body" color={colors.textSecondary}>
            {bundle.duration}
          </AppText>
        </View>

        <PillButton
          label={isExpanded ? 'Hide itinerary' : 'View itinerary'}
          onPress={toggleExpanded}
          variant="outline"
        />
      </View>

      <ExpandableDetails
        isExpanded={isExpanded}
        expandedProgress={expandedProgress}
        itinerary={bundle.itinerary}
      />
    </View>
  );
}

export const TravelCard = memo(TravelCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.card,
  },
  content: {
    gap: spacing.sm,
    padding: spacing.md,
  },
  metaRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    fontFamily: fontFamily.bold,
  },
});
