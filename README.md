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

# Optional: enable live Anthropic streaming for Ask Crew
cp .env.example .env
# Add EXPO_PUBLIC_ANTHROPIC_API_KEY to .env

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
| `PerformanceStore` | Session drops, JS scheduling status, percentiles |

**Selectors** are used everywhere to subscribe to minimal state slices. Sheet open/close is controlled via **ref methods** only — not Zustand — so the feed never rerenders when the sheet opens.

## Performance Strategy

1. **FlashList v2** for vertical feed and horizontal itinerary lists
2. **React.memo** on cards, itinerary rows, and overlay metric components
3. **Local expansion state** via `useRecyclingState` — no parent list rerenders on expand/collapse
4. **Reanimated shared values** for UI-thread expand/collapse animations
5. **Stable callbacks** (`useCallback`) and key extractors
6. **expo-image** with memory-disk cache and blurhash placeholders
7. **Token streaming** batched via `setTimeout` (32ms / 4 chars) to limit Zustand updates during AI responses
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

Tap the **Perf** button (bottom-left) in development to toggle the draggable overlay.

#### How to Read Metrics

| Label | Meaning |
|-------|---------|
| **UI FPS (compositor)** | Native UI thread frame pacing via Reanimated `useFrameCallback`. Target: ~60 (or ~120 on ProMotion). |
| **JS FPS (event loop)** | JS `requestAnimationFrame` cadence, auto-calibrated to match display rate. Compare against UI FPS — UI should stay higher under load. |
| **Session Drops** | Cumulative frames exceeding 22.2ms since overlay opened. Resets each time overlay opens. |
| **JS Scheduling** | Heuristic: `Healthy` vs `JS Busy` based on event loop scheduling delay. Not a native profiler. |
| **P50 / P95 / Worst (1s window)** | Frame time percentiles from the last ~60 frames (~1 second). |

Metrics include dev overlay overhead — use for **relative** before/after comparisons, not absolute production baselines. See [PERFORMANCE.md](PERFORMANCE.md) for full methodology.

## Ask Crew (AI Chat Sheet)

- Bottom sheet overlays the feed at **50% peek** and **92% full** snap points
- Feed stays scrollable behind the sheet (non-blocking backdrop)
- Messages persist in memory for the app session
- With `EXPO_PUBLIC_ANTHROPIC_API_KEY` set, responses stream token-by-token from the Anthropic API
- Without an API key, mock responses simulate progressive streaming for local development

## Known Limitations

- **Anthropic API key required for live AI**: Without `EXPO_PUBLIC_ANTHROPIC_API_KEY`, chat uses mock streaming responses.
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
