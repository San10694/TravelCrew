import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import {
  colors,
  fontFamily,
  radii,
  spacing,
  typography,
} from '@/features/shared/constants/theme';

type MessageBubbleVariant = 'user' | 'assistant';

type MessageBubbleProps = {
  content: string;
  variant: MessageBubbleVariant;
};

const variantStyles: Record<MessageBubbleVariant, ViewStyle> = {
  assistant: {
    alignSelf: 'flex-start',
    backgroundColor: colors.assistantBubble,
    borderBottomLeftRadius: radii.sm,
    borderBottomRightRadius: radii.lg,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: colors.userBubble,
    borderBottomLeftRadius: radii.lg,
    borderBottomRightRadius: radii.sm,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
  },
};

const textStyles: Record<MessageBubbleVariant, object> = {
  assistant: {
    color: colors.text,
    fontFamily: fontFamily.regular,
  },
  user: {
    color: colors.surface,
    fontFamily: fontFamily.regular,
  },
};

export function MessageBubble({ content, variant }: MessageBubbleProps) {
  return (
    <View style={[styles.container, variantStyles[variant]]}>
      <Text style={[styles.text, textStyles[variant]]}>{content}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  text: {
    fontSize: typography.body,
    lineHeight: typography.lineHeight.body,
  },
});
