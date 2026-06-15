/**
 * Sends user messages and streams assistant replies (Anthropic API or mock).
 *
 * Owns the single active stream controller. Batches tokens into chatStore for smooth
 * UI updates. Cancels in-flight streams when a new message is sent.
 */
import { useCallback, useRef } from 'react';

import { getMockAssistantResponse, tokenizeResponse } from '@/features/chat/data/mockResponses';
import {
  isAnthropicConfigured,
  streamAnthropicResponse,
} from '@/features/chat/services/anthropicStream';
import { MOCK_THINKING_DELAY_MS } from '@/features/shared/constants/loadingTimings';
import { useChatStore } from '@/features/chat/store/chatStore';

const BATCH_INTERVAL_MS = 32;
const BATCH_CHAR_THRESHOLD = 4;

type StreamControls = {
  cancel: () => void;
};

type BatchWriter = {
  append: (chunk: string) => void;
  flush: () => void;
  cancel: () => void;
};

function createBatchWriter(
  messageId: string,
  startAssistantResponse: (messageId: string) => void,
  appendTokenBatch: (messageId: string, chunk: string) => void,
  finishStreaming: () => void,
  setThinking: (value: boolean) => void,
): BatchWriter {
  let pendingChunk = '';
  let lastFlushAt = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isCancelled = false;
  let hasStarted = false;

  const flush = () => {
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
      flush();
    }, delay);
  };

  const ensureStarted = () => {
    if (hasStarted) {
      return;
    }

    hasStarted = true;
    startAssistantResponse(messageId);
    setThinking(false);
    lastFlushAt = Date.now();
  };

  return {
    append: (chunk: string) => {
      if (isCancelled || chunk.length === 0) {
        return;
      }

      ensureStarted();
      pendingChunk += chunk;

      if (pendingChunk.length >= BATCH_CHAR_THRESHOLD) {
        flush();
        return;
      }

      scheduleFlush();
    },
    flush: () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      flush();
    },
    cancel: () => {
      isCancelled = true;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      flush();
      finishStreaming();
    },
  };
}

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

  const streamMockResponse = useCallback(
    (messageId: string) => {
      const tokens = tokenizeResponse(getMockAssistantResponse());
      let tokenIndex = 0;
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      let isCancelled = false;

      const writer = createBatchWriter(
        messageId,
        startAssistantResponse,
        appendTokenBatch,
        finishStreaming,
        setThinking,
      );

      const scheduleNextToken = () => {
        if (isCancelled) {
          return;
        }

        if (tokenIndex >= tokens.length) {
          writer.flush();
          finishStreaming();
          streamRef.current = null;
          return;
        }

        writer.append(tokens[tokenIndex] ?? '');
        tokenIndex += 1;
        timeoutId = setTimeout(scheduleNextToken, BATCH_INTERVAL_MS / 2);
      };

      streamRef.current = {
        cancel: () => {
          isCancelled = true;
          if (timeoutId !== null) {
            clearTimeout(timeoutId);
          }
          writer.cancel();
        },
      };

      scheduleNextToken();
    },
    [appendTokenBatch, finishStreaming, setThinking, startAssistantResponse],
  );

  const streamAnthropic = useCallback(
    async (messageId: string) => {
      const abortController = new AbortController();
      const writer = createBatchWriter(
        messageId,
        startAssistantResponse,
        appendTokenBatch,
        finishStreaming,
        setThinking,
      );

      streamRef.current = {
        cancel: () => {
          abortController.abort();
          writer.cancel();
        },
      };

      try {
        const messages = useChatStore.getState().messages;
        await streamAnthropicResponse({
          messages,
          onTextDelta: writer.append,
          signal: abortController.signal,
        });
        writer.flush();
        finishStreaming();
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        writer.flush();
        if (!useChatStore.getState().isStreaming) {
          startAssistantResponse(messageId);
          setThinking(false);
        }

        const fallbackMessage =
          error instanceof Error
            ? `Sorry, I couldn't reach Travel Crew right now. ${error.message}`
            : 'Sorry, I could not reach Travel Crew right now.';

        appendTokenBatch(messageId, fallbackMessage);
        finishStreaming();
      } finally {
        streamRef.current = null;
      }
    },
    [
      appendTokenBatch,
      finishStreaming,
      setThinking,
      startAssistantResponse,
    ],
  );

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

      if (isAnthropicConfigured()) {
        void streamAnthropic(messageId);
        return;
      }

      const thinkingTimeoutId = setTimeout(() => {
        streamMockResponse(messageId);
      }, MOCK_THINKING_DELAY_MS);

      streamRef.current = {
        cancel: () => {
          clearTimeout(thinkingTimeoutId);
          setThinking(false);
        },
      };
    },
    [
      addUserMessage,
      cancelActiveStream,
      setThinking,
      streamAnthropic,
      streamMockResponse,
    ],
  );

  return { sendMessage };
}
