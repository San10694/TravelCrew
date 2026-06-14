import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { colors, radii } from '@/features/shared/constants/theme';

type AvatarIconSize = 'sm' | 'lg';

type AvatarIconProps = {
  label: string;
  size?: AvatarIconSize;
};

const sizeStyles: Record<AvatarIconSize, { container: object; variant: 'subtitle' | 'heading' }> = {
  sm: {
    container: { height: 40, width: 40 },
    variant: 'subtitle',
  },
  lg: {
    container: { height: 56, width: 56 },
    variant: 'heading',
  },
};

export function AvatarIcon({ label, size = 'sm' }: AvatarIconProps) {
  const { container, variant } = sizeStyles[size];

  return (
    <View style={[styles.container, container]}>
      <AppText variant={variant} color={colors.primary}>
        {label}
      </AppText>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    justifyContent: 'center',
  },
});
