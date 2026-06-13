import { memo } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { AppText } from '@/features/shared/ui/AppText';
import {
  colors,
  fontFamily,
  radii,
  spacing,
} from '@/features/shared/constants/theme';

type PillButtonVariant = 'primary' | 'ghost' | 'outline';

type PillButtonProps = {
  label: string;
  onPress: () => void;
  variant?: PillButtonVariant;
  style?: ViewStyle;
};

const labelColors: Record<PillButtonVariant, string> = {
  primary: colors.surface,
  ghost: colors.primary,
  outline: colors.text,
};

function PillButtonComponent({
  label,
  onPress,
  variant = 'primary',
  style,
}: PillButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && styles.pressed,
        style,
      ]}
    >
      <AppText variant="caption" color={labelColors[variant]} style={styles.label}>
        {label}
      </AppText>
    </Pressable>
  );
}

export const PillButton = memo(PillButtonComponent);

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  label: {
    fontFamily: fontFamily.semiBold,
  },
  pressed: {
    opacity: 0.85,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
  },
  ghost: {
    backgroundColor: colors.primarySoft,
  },
  outline: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
});
