import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { ListRenderItemInfo, StyleSheet } from 'react-native';

import { ChatEmptyState } from '@/components/organisms/chat/ChatEmptyState';
import { ChatMessageBubble } from '@/components/molecules/chat/ChatMessageBubble';
import { ChatListHeader } from '@/components/molecules/chat/ChatListHeader';
import { TypingIndicator } from '@/components/molecules/chat/TypingIndicator';
import { useChatSheetContext } from '@/features/chat/context/ChatSheetContext';
import { useChatAutoScroll } from '@/features/chat/hooks/useChatAutoScroll';
import type { Message } from '@/features/chat/types/message';
import { spacing } from '@/features/shared/constants/theme';

export function ChatMessageList() {
  const { messages, isThinking, isStreaming, sendMessage } = useChatSheetContext();
  const { listRef, onContentSizeChange, scrollEventsHandlersHook } = useChatAutoScroll({
    messages,
    isThinking,
    isStreaming,
  });

  return (
    <BottomSheetFlatList
      ref={listRef}
      data={messages}
      renderItem={({ item }: ListRenderItemInfo<Message>) => (
        <ChatMessageBubble message={item} />
      )}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={messages.length > 0 ? <ChatListHeader /> : null}
      ListEmptyComponent={<ChatEmptyState onSuggestionPress={sendMessage} />}
      ListFooterComponent={
        <TypingIndicator isThinking={isThinking} isStreaming={isStreaming} />
      }
      contentContainerStyle={[
        styles.content,
        messages.length === 0 && styles.emptyContent,
      ]}
      enableFooterMarginAdjustment
      keyboardShouldPersistTaps="handled"
      scrollEventsHandlersHook={scrollEventsHandlersHook}
      onContentSizeChange={onContentSizeChange}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  emptyContent: {
    flexGrow: 1,
  },
});
