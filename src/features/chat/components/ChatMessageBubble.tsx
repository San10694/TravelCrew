import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Message } from '@/features/chat/types/message';
import { colors, spacing, typography } from '@/features/shared/constants/theme';

type ChatMessageBubbleProps = {
  message: Message;
};

function ChatMessageBubbleComponent({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
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
  },
  assistantText: {
    color: colors.text,
  },
  container: {
    borderRadius: 16,
    marginBottom: spacing.sm,
    maxWidth: '85%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    fontSize: typography.body,
    lineHeight: 20,
  },
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: colors.userBubble,
  },
  userText: {
    color: colors.surface,
  },
});
