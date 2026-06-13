export const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  text: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
  overlay: 'rgba(15, 23, 42, 0.85)',
  userBubble: '#2563EB',
  assistantBubble: '#F1F5F9',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const layout = {
  heroImageWidth: 360,
  heroImageHeight: 200,
  itineraryImageWidth: 140,
  itineraryImageHeight: 100,
  collapsedCardHeight: 320,
  itinerarySectionHeight: 140,
  fabSize: 56,
} as const;

export const typography = {
  title: 22,
  subtitle: 16,
  body: 14,
  caption: 12,
} as const;
