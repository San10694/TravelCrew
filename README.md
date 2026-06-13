# Crew — Travel Discovery App

A production-quality React Native travel discovery application built with Expo, featuring a high-performance feed, AI chat bottom sheet, and custom performance overlay.

## Prerequisites

- Node.js 20+
- npm or yarn
- Expo CLI (`npx expo`)
- iOS Simulator (macOS) or Android Emulator

## Setup

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

Press `i` for iOS simulator or `a` for Android emulator.

For best results with Reanimated v4 and FlashList v2, use a development build rather than Expo Go:

```bash
npx expo prebuild
npx expo run:ios   # or run:android
```

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Expo SDK 56+ | Runtime and tooling |
| Expo Router | File-based navigation |
| TypeScript (strict) | Type safety |
| Zustand | State management |
| FlashList v2 | High-performance lists |
| Reanimated v4 | UI-thread animations |
| Gesture Handler | Gestures and root wrapper |
| @gorhom/bottom-sheet | AI chat sheet |
| expo-image | Cached remote images |

## Project Structure

```
src/
├── app/                    # Expo Router routes only
│   ├── _layout.tsx         # Root composition (providers + overlays)
│   └── index.tsx           # Feed screen route
└── features/
    ├── feed/               # Trip discovery feed
    ├── chat/               # AI chat bottom sheet
    ├── performance/        # Custom performance overlay
    └── shared/             # UI primitives, utils, constants
```

## Architecture Decisions

### Feature-First MVVM

- **Model**: Zustand stores, types, and mock data generators
- **ViewModel**: Feature hooks (`useStreamingResponse`, `usePerformanceInstrumentation`)
- **View**: Memoized presentational components

### Sibling Composition at Root

The feed, FAB, chat bottom sheet, and performance overlay are **siblings** in `src/app/_layout.tsx`. Opening the chat sheet or updating performance metrics does not remount or rerender the feed list.

```
RootLayout
├── Slot (FeedScreen)
├── FeedFab
├── ChatBottomSheet (always mounted, index=-1)
├── DevOverlayToggle (__DEV__)
└── PerformanceOverlay (__DEV__)
```

## State Management

Three isolated Zustand stores prevent cross-feature rerenders:

| Store | Responsibility |
|-------|----------------|
| `FeedStore` | 120 travel bundles (static mock data) |
| `ChatStore` | Messages, thinking/streaming state |
| `PerformanceStore` | FPS, frame drops, JS thread status, percentiles |

**Selectors** are used everywhere to subscribe to minimal state slices. Sheet open/close is controlled via **ref methods** only — not Zustand — so the feed never rerenders when the sheet opens.

## Performance Strategy

1. **FlashList v2** for vertical feed and horizontal itinerary lists
2. **React.memo** on cards, itinerary rows, and overlay metric components
3. **Local expansion state** via `useRecyclingState` — no parent list rerenders on expand/collapse
4. **Reanimated shared values** for UI-thread expand/collapse animations
5. **Stable callbacks** (`useCallback`) and key extractors
6. **expo-image** with memory-disk cache and blurhash placeholders
7. **Token streaming** via `requestAnimationFrame` — non-blocking UI thread
8. **Dev rerender logging** via `useRerenderLogger` (development only)

## Development Tooling

### Rerender Logging

In `__DEV__`, components log rerenders to the console:

```
[Rerender] FeedScreen #1
[Rerender] TravelCard:bundle-0 #1
[Rerender] ChatBottomSheet #1
```

### Performance Overlay

Tap the **Perf** button (bottom-left) in development to toggle the draggable overlay showing FPS, frame drops, JS thread status, and frame time percentiles.

## Known Limitations

- **Simulated AI**: Chat responses are mock data with token streaming simulation — no real API.
- **Expo Go**: Reanimated v4 and FlashList v2 work best with New Architecture enabled in a dev build.
- **FlashList v2 sizing**: `estimatedItemSize` is included for documentation but v2 auto-sizes items on New Architecture.
- **Remote images**: Requires network access for picsum.photos URLs.
- **Performance overlay**: Custom implementation for development profiling — not a replacement for native profilers.

## Scripts

```bash
npm start          # Start Expo dev server
npm run ios        # Open iOS simulator
npm run android    # Open Android emulator
npx tsc --noEmit   # Type-check
```
