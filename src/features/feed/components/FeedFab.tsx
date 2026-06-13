import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '@/features/shared/constants/theme';

type FeedFabProps = {
  onPress: () => void;
};

function FeedFabComponent({ onPress }: FeedFabProps) {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.fab, { bottom: spacing.lg + insets.bottom }]}
    >
      <Text style={styles.label}>Ask Crew</Text>
    </Pressable>
  );
}

export const FeedFab = memo(FeedFabComponent);

const styles = StyleSheet.create({
  fab: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: layout.fabSize / 2,
    elevation: 6,
    height: layout.fabSize,
    justifyContent: 'center',
    position: 'absolute',
    right: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    width: layout.fabSize,
    zIndex: 10,
  },
  label: {
    color: colors.surface,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});
