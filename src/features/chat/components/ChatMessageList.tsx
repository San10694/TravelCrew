import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { memo, useCallback } from 'react';
import { ListRenderItemInfo, StyleSheet, View } from 'react-native';

import { ChatEmptyState } from '@/features/chat/components/ChatEmptyState';
import { ChatMessageBubble } from '@/features/chat/components/ChatMessageBubble';
import { TypingIndicator } from '@/features/chat/components/TypingIndicator';
import { useStreamingResponse } from '@/features/chat/hooks/useStreamingResponse';
import { useChatStore } from '@/features/chat/store/chatStore';
import type { Message } from '@/features/chat/types/message';
import { AppText } from '@/features/shared/ui/AppText';
import { colors, fontFamily, radii, spacing } from '@/features/shared/constants/theme';

function ChatListHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.avatar}>
        <AppText variant="subtitle" color={colors.primary}>
          C
        </AppText>
      </View>
      <View style={styles.headerText}>
        <AppText variant="subtitle" style={styles.title}>
          Ask Crew
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          Your AI travel assistant
        </AppText>
      </View>
    </View>
  );
}

function ChatMessageListComponent() {
  const messages = useChatStore((state) => state.messages);
  const { sendMessage } = useStreamingResponse();

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Message>) => <ChatMessageBubble message={item} />,
    [],
  );

  const renderListHeader = useCallback(() => <ChatListHeader />, []);

  const renderListFooter = useCallback(() => <TypingIndicator />, []);

  const renderEmpty = useCallback(
    () => <ChatEmptyState onSuggestionPress={sendMessage} />,
    [sendMessage],
  );

  return (
    <BottomSheetFlatList
      data={messages}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={messages.length > 0 ? renderListHeader : null}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderListFooter}
      contentContainerStyle={[
        styles.content,
        messages.length === 0 && styles.emptyContent,
      ]}
      keyboardShouldPersistTaps="handled"
    />
  );
}

export const ChatMessageList = memo(ChatMessageListComponent);

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  content: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  emptyContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingTop: spacing.xs,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamily.bold,
  },
});
