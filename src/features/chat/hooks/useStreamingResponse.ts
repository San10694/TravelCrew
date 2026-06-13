import { useCallback, useRef } from 'react';

import { getMockAssistantResponse, tokenizeResponse } from '@/features/chat/data/mockResponses';
import { useChatStore } from '@/features/chat/store/chatStore';

const BATCH_INTERVAL_MS = 32;
const BATCH_CHAR_THRESHOLD = 4;

type StreamControls = {
  cancel: () => void;
};

export function useStreamingResponse(): {
  sendMessage: (content: string) => void;
} {
  const addUserMessage = useChatStore((state) => state.addUserMessage);
  const startAssistantResponse = useChatStore((state) => state.startAssistantResponse);
  const appendTokenBatch = useChatStore((state) => state.appendTokenBatch);
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
      let pendingChunk = '';
      let lastFlushAt = 0;
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      let isCancelled = false;
      let hasStarted = false;

      const flushChunk = () => {
        if (pendingChunk.length === 0) {
          return;
        }

        appendTokenBatch(messageId, pendingChunk);
        pendingChunk = '';
        lastFlushAt = Date.now();
      };

      const scheduleFlush = () => {
        if (timeoutId !== null) {
          return;
        }

        const elapsed = Date.now() - lastFlushAt;
        const delay = Math.max(0, BATCH_INTERVAL_MS - elapsed);

        timeoutId = setTimeout(() => {
          timeoutId = null;
          flushChunk();

          if (tokenIndex < tokens.length && !isCancelled) {
            scheduleNextToken();
          }
        }, delay);
      };

      const scheduleNextToken = () => {
        if (isCancelled) {
          return;
        }

        if (!hasStarted) {
          hasStarted = true;
          startAssistantResponse(messageId);
          setThinking(false);
          lastFlushAt = Date.now();
        }

        if (tokenIndex >= tokens.length) {
          flushChunk();
          finishStreaming();
          streamRef.current = null;
          return;
        }

        pendingChunk += tokens[tokenIndex] ?? '';
        tokenIndex += 1;

        if (pendingChunk.length >= BATCH_CHAR_THRESHOLD) {
          flushChunk();
          scheduleNextToken();
          return;
        }

        scheduleFlush();
      };

      streamRef.current = {
        cancel: () => {
          isCancelled = true;
          if (timeoutId !== null) {
            clearTimeout(timeoutId);
          }
          flushChunk();
          finishStreaming();
        },
      };

      scheduleNextToken();
    },
    [
      addUserMessage,
      appendTokenBatch,
      cancelActiveStream,
      finishStreaming,
      setThinking,
      startAssistantResponse,
    ],
  );

  return { sendMessage };
}
