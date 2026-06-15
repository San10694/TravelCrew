/**
 * Single travel bundle card with expandable itinerary section.
 *
 * Hero image, price, trip type badge, and animated ExpandableDetails. Uses
 * useRecyclingState so expand state resets when FlashList recycles the row.
 */
import { useRecyclingState } from '@shopify/flash-list';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';

import { ExpandableDetails } from '@/components/molecules/feed/ExpandableDetails';
import { TravelCardHero } from '@/components/molecules/feed/TravelCardHero';
import type { TravelBundle } from '@/features/feed/types/travelBundle';
import { AppText } from '@/components/atoms/AppText';
import { Badge } from '@/components/atoms/Badge';
import { PillButton } from '@/components/atoms/PillButton';
import { colors, fontFamily, radii, shadows, spacing } from '@/features/shared/constants/theme';

type TravelCardProps = {
  bundle: TravelBundle;
};

export function TravelCard({ bundle }: TravelCardProps) {
  const [isExpanded, setIsExpanded] = useRecyclingState(false, [bundle.id]);
  const expandedProgress = useSharedValue(0);

  useEffect(() => {
    expandedProgress.value = 0;
  }, [bundle.id, expandedProgress]);

  function toggleExpanded() {
    setIsExpanded((current) => {
      const nextExpanded = !current;
      expandedProgress.value = withTiming(nextExpanded ? 1 : 0, { duration: 300 });
      return nextExpanded;
    });
  }

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
