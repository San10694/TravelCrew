import { BottomSheetFooter, type BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import { memo, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatInput } from '@/features/chat/components/ChatInput';
import { useStreamingResponse } from '@/features/chat/hooks/useStreamingResponse';
import { useChatStore } from '@/features/chat/store/chatStore';

function ChatSheetFooterComponent(props: BottomSheetFooterProps) {
  const insets = useSafeAreaInsets();
  const { sendMessage } = useStreamingResponse();
  const isStreaming = useChatStore((state) => state.isStreaming);
  const isThinking = useChatStore((state) => state.isThinking);

  const handleSend = useCallback(
    (message: string) => {
      sendMessage(message);
    },
    [sendMessage],
  );

  return (
    <BottomSheetFooter {...props} bottomInset={insets.bottom}>
      <ChatInput onSend={handleSend} disabled={isStreaming || isThinking} />
    </BottomSheetFooter>
  );
}

export const ChatSheetFooter = memo(ChatSheetFooterComponent);
