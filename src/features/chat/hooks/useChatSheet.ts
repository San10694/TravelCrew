import { useChatStore } from '@/features/chat/store/chatStore';
import { useStreamingResponse } from '@/features/chat/hooks/useStreamingResponse';
import type { Message } from '@/features/chat/types/message';

export type ChatSheetViewModel = {
  messages: Message[];
  isThinking: boolean;
  isStreaming: boolean;
  sendMessage: (content: string) => void;
};

export function useChatSheet(): ChatSheetViewModel {
  const messages = useChatStore((state) => state.messages);
  const isThinking = useChatStore((state) => state.isThinking);
  const isStreaming = useChatStore((state) => state.isStreaming);
  const { sendMessage } = useStreamingResponse();

  return {
    messages,
    isThinking,
    isStreaming,
    sendMessage,
  };
}
