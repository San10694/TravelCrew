import { BottomSheetFooter, type BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import { memo, useCallback } from 'react';

import { ChatInput } from '@/features/chat/components/ChatInput';
import { useChatSheetContext } from '@/features/chat/context/ChatSheetContext';

function ChatSheetFooterComponent(props: BottomSheetFooterProps) {
  const { sendMessage, isStreaming, isThinking } = useChatSheetContext();

  const handleSend = useCallback(
    (message: string) => {
      sendMessage(message);
    },
    [sendMessage],
  );

  return (
    <BottomSheetFooter {...props} bottomInset={0}>
      <ChatInput onSend={handleSend} disabled={isStreaming || isThinking} />
    </BottomSheetFooter>
  );
}

export const ChatSheetFooter = memo(ChatSheetFooterComponent);
