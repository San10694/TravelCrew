import { memo } from 'react';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import {
  colors,
  textVariants,
  type TextVariant,
} from '@/features/shared/constants/theme';

type AppTextProps = TextProps & {
  variant?: TextVariant;
  color?: string;
  style?: TextStyle;
};

function AppTextComponent({
  variant = 'body',
  color,
  style,
  children,
  ...rest
}: AppTextProps) {
  return (
    <Text
      style={[textVariants[variant], color ? { color } : null, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export const AppText = memo(AppTextComponent);

export const mutedTextStyle = StyleSheet.create({
  secondary: { color: colors.textSecondary },
  muted: { color: colors.textMuted },
});
