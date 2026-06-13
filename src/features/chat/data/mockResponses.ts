const RESPONSES = [
  'Hello traveler! I can help you find the perfect trip bundle based on your budget and interests.',
  'Based on your preferences, I recommend exploring cultural destinations in Kyoto or Lisbon this season.',
  'For adventure seekers, Queenstown and Patagonia offer incredible outdoor experiences with great ratings.',
  'Would you like me to filter bundles by trip type, duration, or price range?',
  'The Amalfi Coast bundle is trending right now with excellent reviews for food and relaxation.',
] as const;

let responseIndex = 0;

export function getMockAssistantResponse(): string {
  const response = RESPONSES[responseIndex % RESPONSES.length];
  responseIndex += 1;
  return response ?? RESPONSES[0];
}

export function tokenizeResponse(text: string): string[] {
  return text.split('');
}
