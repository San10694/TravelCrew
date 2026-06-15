/**
 * Scrollable chat message area inside the bottom sheet.
 *
 * Uses BottomSheetScrollView (not FlatList) for reliable auto-scroll with variable-height
 * bubbles. Reads messages and sendMessage from ChatSheetContext; delegates scroll to useChatAutoScroll.
 */
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';

import { ChatEmptyState } from '@/components/organisms/chat/ChatEmptyState';
import { ChatMessageBubble } from '@/components/molecules/chat/ChatMessageBubble';
import { ChatListHeader } from '@/components/molecules/chat/ChatListHeader';
import { TypingIndicator } from '@/components/molecules/chat/TypingIndicator';
import { useChatSheetContext } from '@/features/chat/context/ChatSheetContext';
import { useChatAutoScroll } from '@/features/chat/hooks/useChatAutoScroll';
import { spacing } from '@/features/shared/constants/theme';

export function ChatMessageList() {
  const { messages, isThinking, isStreaming, sendMessage } = useChatSheetContext();
  const hasMessages = messages.length > 0;
  const { scrollRef, onContentSizeChange, scrollEventsHandlersHook } = useChatAutoScroll({
    messages,
    isStreaming,
  });

  return (
    <BottomSheetScrollView
      ref={scrollRef}
      enableFooterMarginAdjustment
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.content, !hasMessages && styles.emptyContent]}
      scrollEventsHandlersHook={scrollEventsHandlersHook}
      onContentSizeChange={onContentSizeChange}
    >
      {hasMessages ? (
        <>
          <ChatListHeader />
          {messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))}
          <TypingIndicator isThinking={isThinking} isStreaming={isStreaming} />
        </>
      ) : (
        <ChatEmptyState onSuggestionPress={sendMessage} />
      )}
    </BottomSheetScrollView>
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
