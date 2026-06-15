/**
 * Chat domain state (Zustand). Single source of truth for messages and stream lifecycle.
 *
 * Holds messages[], isThinking, isStreaming. Mutations are synchronous; streaming
 * orchestration lives in useStreamingResponse, which calls these actions.
 */
import { create } from 'zustand';

import type { Message } from '@/features/chat/types/message';
import { createSelectors } from '@/features/shared/utils/createSelectors';

type ChatState = {
  messages: Message[];
  isThinking: boolean;
  isStreaming: boolean;
  addUserMessage: (content: string) => void;
  startAssistantResponse: (messageId: string) => void;
  appendTokenBatch: (messageId: string, chunk: string) => void;
  finishStreaming: () => void;
  setThinking: (value: boolean) => void;
};

const useChatStoreBase = create<ChatState>((set) => ({
  messages: [],
  isThinking: false,
  isStreaming: false,

  addUserMessage: (content) => {
    const message: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
    };

    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  startAssistantResponse: (messageId) => {
    const message: Message = {
      id: messageId,
      role: 'assistant',
      content: '',
    };

    set((state) => ({
      messages: [...state.messages, message],
      isStreaming: true,
    }));
  },

  appendTokenBatch: (messageId, chunk) => {
    if (chunk.length === 0) {
      return;
    }

    set((state) => {
      const messageIndex = state.messages.findIndex((message) => message.id === messageId);

      if (messageIndex === -1) {
        return state;
      }

      const targetMessage = state.messages[messageIndex] as Message;
      const updatedMessage: Message = {
        ...targetMessage,
        content: targetMessage.content + chunk,
      };

      if (updatedMessage.content === targetMessage.content) {
        return state;
      }

      const messages = state.messages.slice();
      messages[messageIndex] = updatedMessage;

      return { messages };
    });
  },

  finishStreaming: () => {
    set((state) =>
      state.isStreaming || state.isThinking
        ? { isStreaming: false, isThinking: false }
        : state,
    );
  },

  setThinking: (value) => {
    set((state) => (state.isThinking === value ? state : { isThinking: value }));
  },
}));

export const useChatStore = createSelectors(useChatStoreBase);
