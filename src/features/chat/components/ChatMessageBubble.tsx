import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Message } from '@/features/chat/types/message';
import {
  colors,
  fontFamily,
  radii,
  spacing,
  typography,
} from '@/features/shared/constants/theme';

type ChatMessageBubbleProps = {
  message: Message;
};

function ChatMessageBubbleComponent({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
        {message.content}
      </Text>
    </View>
  );
}

export const ChatMessageBubble = memo(ChatMessageBubbleComponent);

const styles = StyleSheet.create({
  assistantContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.assistantBubble,
    borderBottomLeftRadius: radii.sm,
    borderBottomRightRadius: radii.lg,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
  },
  assistantText: {
    color: colors.text,
    fontFamily: fontFamily.regular,
  },
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
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: colors.userBubble,
    borderBottomLeftRadius: radii.lg,
    borderBottomRightRadius: radii.sm,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
  },
  userText: {
    color: colors.surface,
    fontFamily: fontFamily.regular,
  },
});
