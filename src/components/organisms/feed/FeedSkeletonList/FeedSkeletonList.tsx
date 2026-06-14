import { ScrollView, StyleSheet, View } from 'react-native';

import { ShimmerBox } from '@/components/atoms/ShimmerBox';
import { colors, layout, radii, spacing } from '@/features/shared/constants/theme';

const SKELETON_CARD_COUNT = 3;

function SkeletonCard() {
  return (
    <View style={styles.card}>
      <ShimmerBox width="100%" height={layout.heroImageHeight} borderRadius={0} />
      <View style={styles.content}>
        <ShimmerBox width={80} height={22} borderRadius={radii.pill} />
        <View style={styles.metaRow}>
          <ShimmerBox width={100} height={24} borderRadius={radii.sm} />
          <ShimmerBox width={56} height={16} borderRadius={radii.sm} />
        </View>
        <ShimmerBox width={120} height={36} borderRadius={radii.pill} />
      </View>
    </View>
  );
}

export function FeedSkeletonList() {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    >
      {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
        <SkeletonCard key={`skeleton-card-${index}`} />
      ))}
    </ScrollView>
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
  },
  content: {
    gap: spacing.sm,
    padding: spacing.md,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
});
