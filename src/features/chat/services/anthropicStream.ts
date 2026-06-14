import type { Message } from '@/features/chat/types/message';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const ANTHROPIC_MODEL = 'claude-3-5-haiku-20241022';

const SYSTEM_PROMPT =
  'You are Travel Crew, a concise AI travel assistant. Help users discover trip bundles, compare destinations, budgets, and trip types. Keep answers practical and friendly.';

export function getAnthropicApiKey(): string | undefined {
  const key = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY?.trim();
  return key && key.length > 0 ? key : undefined;
}

export function isAnthropicConfigured(): boolean {
  return getAnthropicApiKey() !== undefined;
}

type AnthropicStreamOptions = {
  messages: Message[];
  onTextDelta: (text: string) => void;
  signal?: AbortSignal;
};

function toAnthropicRole(role: Message['role']): 'user' | 'assistant' {
  return role === 'assistant' ? 'assistant' : 'user';
}

function parseSseChunk(
  chunk: string,
  onEvent: (eventType: string, data: string) => void,
): string {
  const lines = chunk.split('\n');
  let eventType = '';
  let remainder = '';

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? '';

    if (index === lines.length - 1 && !chunk.endsWith('\n')) {
      remainder = line;
      break;
    }

    if (line.startsWith('event:')) {
      eventType = line.slice(6).trim();
      continue;
    }

    if (line.startsWith('data:')) {
      onEvent(eventType, line.slice(5).trim());
    }
  }

  return remainder;
}

export async function streamAnthropicResponse({
  messages,
  onTextDelta,
  signal,
}: AnthropicStreamOptions): Promise<void> {
  const apiKey = getAnthropicApiKey();
  if (!apiKey) {
    throw new Error('Anthropic API key is not configured.');
  }

  const anthropicMessages = messages
    .filter((message) => message.content.trim().length > 0)
    .map((message) => ({
      role: toAnthropicRole(message.role),
      content: message.content,
    }));

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      stream: true,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
    }),
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errorBody}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Streaming is not supported in this environment.');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    buffer = parseSseChunk(buffer, (eventType, data) => {
      if (eventType !== 'content_block_delta' || data.length === 0) {
        return;
      }

      try {
        const payload = JSON.parse(data) as {
          delta?: { type?: string; text?: string };
        };

        if (payload.delta?.type === 'text_delta' && payload.delta.text) {
          onTextDelta(payload.delta.text);
        }
      } catch {
        // Ignore malformed SSE payloads.
      }
    });
  }
}
