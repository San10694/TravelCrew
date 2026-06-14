
import { MessageBubble } from '@/components/molecules/common/MessageBubble';
import type { Message } from '@/features/chat/types/message';

type ChatMessageBubbleProps = {
  message: Message;
};

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  return (
    <MessageBubble
      content={message.content}
      variant={message.role === 'user' ? 'user' : 'assistant'}
    />
  );
}

