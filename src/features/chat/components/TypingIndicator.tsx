import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useChatStore } from '@/features/chat/store/chatStore';
import { colors, spacing, typography } from '@/features/shared/constants/theme';

function TypingIndicatorComponent() {
  const isThinking = useChatStore((state) => state.isThinking);
  const isStreaming = useChatStore((state) => state.isStreaming);

  if (!isThinking || isStreaming) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Thinking...</Text>
    </View>
  );
}

export const TypingIndicator = memo(TypingIndicatorComponent);

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    backgroundColor: colors.assistantBubble,
    borderRadius: 16,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    color: colors.textSecondary,
    fontSize: typography.body,
    fontStyle: 'italic',
  },
});
