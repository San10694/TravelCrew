/**
 * Chat sheet context — shares one ViewModel instance across bottom sheet children.
 *
 * Provider wraps ChatBottomSheet content so ChatMessageList, ChatSheetFooter, and
 * TypingIndicator share the same stream controller and store subscriptions.
 */
import { createContext, useContext, type ReactNode } from 'react';

import { useChatSheet, type ChatSheetViewModel } from '@/features/chat/hooks/useChatSheet';

const ChatSheetContext = createContext<ChatSheetViewModel | null>(null);

type ChatSheetProviderProps = {
  children: ReactNode;
};

export function ChatSheetProvider({ children }: ChatSheetProviderProps) {
  const value = useChatSheet();

  return <ChatSheetContext.Provider value={value}>{children}</ChatSheetContext.Provider>;
}

export function useChatSheetContext(): ChatSheetViewModel {
  const context = useContext(ChatSheetContext);

  if (context === null) {
    throw new Error('useChatSheetContext must be used within ChatSheetProvider');
  }

  return context;
}
