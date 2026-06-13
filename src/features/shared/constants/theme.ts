import type { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  background: '#FAFAFA',
  surface: '#FFFFFF',
  inputBackground: '#F4F4F5',
  primary: '#FF385C',
  primaryDark: '#E31C5F',
  primarySoft: '#FFF1F3',
  accent: '#FF385C',
  accentDark: '#E31C5F',
  text: '#222222',
  textSecondary: '#717171',
  textMuted: '#B0B0B0',
  border: '#EBEBEB',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
  overlay: 'rgba(34, 34, 34, 0.88)',
  overlayScrim: 'rgba(0, 0, 0, 0.45)',
  userBubble: '#FF385C',
  assistantBubble: '#F4F4F5',
  frosted: 'rgba(255, 255, 255, 0.92)',
} as const;

export const fontFamily = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#222222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sheet: {
    shadowColor: '#222222',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  input: {
    shadowColor: '#222222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  fab: {
    shadowColor: '#FF385C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
} satisfies Record<string, ViewStyle>;

export const layout = {
  heroImageWidth: 360,
  heroImageHeight: 240,
  itineraryImageWidth: 140,
  itineraryImageHeight: 100,
  collapsedCardHeight: 340,
  itinerarySectionHeight: 160,
  fabSize: 52,
  fabMinWidth: 140,
  inputHeight: 44,
} as const;

export const typography = {
  display: 28,
  heading: 20,
  subtitle: 16,
  body: 15,
  caption: 12,
  lineHeight: {
    display: 34,
    heading: 26,
    subtitle: 22,
    body: 22,
    caption: 16,
  },
  letterSpacing: {
    display: -0.5,
    heading: -0.3,
    body: 0,
    caption: 0.2,
  },
} as const;

export type TextVariant = 'display' | 'heading' | 'subtitle' | 'body' | 'caption';

export const textVariants: Record<TextVariant, TextStyle> = {
  display: {
    fontFamily: fontFamily.bold,
    fontSize: typography.display,
    lineHeight: typography.lineHeight.display,
    letterSpacing: typography.letterSpacing.display,
    color: colors.text,
  },
  heading: {
    fontFamily: fontFamily.bold,
    fontSize: typography.heading,
    lineHeight: typography.lineHeight.heading,
    letterSpacing: typography.letterSpacing.heading,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: typography.subtitle,
    lineHeight: typography.lineHeight.subtitle,
    color: colors.text,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: typography.body,
    lineHeight: typography.lineHeight.body,
    color: colors.text,
  },
  caption: {
    fontFamily: fontFamily.medium,
    fontSize: typography.caption,
    lineHeight: typography.lineHeight.caption,
    letterSpacing: typography.letterSpacing.caption,
    color: colors.textSecondary,
  },
};
