import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors } from '@/features/shared/constants/theme';

type DividerProps = {
  style?: ViewStyle;
};

export function Divider({ style }: DividerProps) {
  return <View style={[styles.divider, style]} />;
}


const styles = StyleSheet.create({
  divider: {
    backgroundColor: colors.border,
    height: StyleSheet.hairlineWidth,
  },
});
