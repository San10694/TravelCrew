import { useRecyclingState } from '@shopify/flash-list';
import { memo, useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';

import { ExpandableDetails } from '@/features/feed/components/ExpandableDetails';
import { TravelCardHero } from '@/features/feed/components/TravelCardHero';
import type { TravelBundle } from '@/features/feed/types/travelBundle';
import { Badge } from '@/features/shared/ui/Badge';
import { Rating } from '@/features/shared/ui/Rating';
import { colors, spacing, typography } from '@/features/shared/constants/theme';

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
      <TravelCardHero imageUrl={bundle.heroImage} blurhash={bundle.heroBlurhash} />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.destination}>{bundle.destination}</Text>
          <Rating value={bundle.rating} />
        </View>

        <Badge label={bundle.tripType} />

        <View style={styles.metaRow}>
          <Text style={styles.price}>${bundle.price.toLocaleString()}</Text>
          <Text style={styles.duration}>{bundle.duration}</Text>
        </View>

        <Pressable onPress={toggleExpanded} style={styles.toggleButton}>
          <Text style={styles.toggleText}>
            {isExpanded ? 'Hide itinerary' : 'View itinerary'}
          </Text>
        </Pressable>
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
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  content: {
    gap: spacing.sm,
    padding: spacing.md,
  },
  destination: {
    color: colors.text,
    flex: 1,
    fontSize: typography.subtitle,
    fontWeight: '700',
  },
  duration: {
    color: colors.textSecondary,
    fontSize: typography.body,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    color: colors.primary,
    fontSize: typography.title,
    fontWeight: '700',
  },
  toggleButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
  toggleText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '600',
  },
});
