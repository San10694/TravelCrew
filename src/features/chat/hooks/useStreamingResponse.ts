import { useCallback, useRef } from 'react';

import { getMockAssistantResponse, tokenizeResponse } from '@/features/chat/data/mockResponses';
import { useChatStore } from '@/features/chat/store/chatStore';

type StreamControls = {
  cancel: () => void;
};

export function useStreamingResponse(): {
  sendMessage: (content: string) => void;
} {
  const addUserMessage = useChatStore((state) => state.addUserMessage);
  const startAssistantResponse = useChatStore((state) => state.startAssistantResponse);
  const appendToken = useChatStore((state) => state.appendToken);
  const finishStreaming = useChatStore((state) => state.finishStreaming);
  const setThinking = useChatStore((state) => state.setThinking);

  const streamRef = useRef<StreamControls | null>(null);

  const cancelActiveStream = useCallback(() => {
    streamRef.current?.cancel();
    streamRef.current = null;
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) {
        return;
      }

      cancelActiveStream();
      addUserMessage(trimmed);
      setThinking(true);

      const messageId = `assistant-${Date.now()}`;
      const tokens = tokenizeResponse(getMockAssistantResponse());
      let tokenIndex = 0;
      let rafId: number | null = null;
      let isCancelled = false;

      const streamNextToken = () => {
        if (isCancelled) {
          return;
        }

        if (tokenIndex === 0) {
          startAssistantResponse(messageId);
          setThinking(false);
        }

        if (tokenIndex >= tokens.length) {
          finishStreaming();
          streamRef.current = null;
          return;
        }

        appendToken(messageId, tokens[tokenIndex] ?? '');
        tokenIndex += 1;
        rafId = requestAnimationFrame(streamNextToken);
      };

      streamRef.current = {
        cancel: () => {
          isCancelled = true;
          if (rafId !== null) {
            cancelAnimationFrame(rafId);
          }
          finishStreaming();
        },
      };

      rafId = requestAnimationFrame(streamNextToken);
    },
    [
      addUserMessage,
      appendToken,
      cancelActiveStream,
      finishStreaming,
      setThinking,
      startAssistantResponse,
    ],
  );

  return { sendMessage };
}
