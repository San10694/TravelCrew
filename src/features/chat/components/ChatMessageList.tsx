import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { memo, useCallback } from 'react';
import { ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';

import { ChatMessageBubble } from '@/features/chat/components/ChatMessageBubble';
import { TypingIndicator } from '@/features/chat/components/TypingIndicator';
import { useChatStore } from '@/features/chat/store/chatStore';
import type { Message } from '@/features/chat/types/message';
import { colors, spacing, typography } from '@/features/shared/constants/theme';

function ChatListHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Ask Crew</Text>
      <Text style={styles.subtitle}>Your AI travel assistant</Text>
    </View>
  );
}

function ChatMessageListComponent() {
  const messages = useChatStore((state) => state.messages);

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Message>) => <ChatMessageBubble message={item} />,
    [],
  );

  const renderListHeader = useCallback(() => <ChatListHeader />, []);

  const renderListFooter = useCallback(() => <TypingIndicator />, []);

  return (
    <BottomSheetFlatList
      data={messages}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={renderListHeader}
      ListFooterComponent={renderListFooter}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    />
  );
}

export const ChatMessageList = memo(ChatMessageListComponent);

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  header: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    marginTop: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '700',
  },
});
