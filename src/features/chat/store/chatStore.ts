import { create } from 'zustand';

import type { Message } from '@/features/chat/types/message';
import { createSelectors } from '@/features/shared/utils/createSelectors';

type ChatState = {
  messages: Message[];
  isThinking: boolean;
  isStreaming: boolean;
  addUserMessage: (content: string) => void;
  startAssistantResponse: (messageId: string) => void;
  appendToken: (messageId: string, token: string) => void;
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

  appendToken: (messageId, token) => {
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === messageId
          ? { ...message, content: message.content + token }
          : message,
      ),
    }));
  },

  finishStreaming: () => {
    set({ isStreaming: false, isThinking: false });
  },

  setThinking: (value) => {
    set({ isThinking: value });
  },
}));

export const useChatStore = createSelectors(useChatStoreBase);
