/**
 * Gorhom bottom sheet footer wrapping ChatInput.
 * Bridges sendMessage from ChatSheetContext; input disabled during thinking/streaming.
 */
import { BottomSheetFooter, type BottomSheetFooterProps } from '@gorhom/bottom-sheet';

import { ChatInput } from '@/components/molecules/chat/ChatInput';
import { useChatSheetContext } from '@/features/chat/context/ChatSheetContext';

export function ChatSheetFooter(props: BottomSheetFooterProps) {
  const { sendMessage, isStreaming, isThinking } = useChatSheetContext();

  function handleSend(message: string) {
    sendMessage(message);
  }

  return (
    <BottomSheetFooter {...props} bottomInset={0}>
      <ChatInput onSend={handleSend} disabled={isStreaming || isThinking} />
    </BottomSheetFooter>
  );
}
