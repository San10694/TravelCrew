# Travel Crew

A React Native travel discovery app built with Expo: a high-performance feed, an AI chat bottom sheet, and a custom dev performance overlay.

## Demo


| iOS                           | Android                       |
| ----------------------------- | ----------------------------- |
| *Video recording to be added* | *Video recording to be added* |


## Setup

```bash
npm install

# Optional: live Anthropic streaming for the AI chat
cp .env.example .env          # then add EXPO_PUBLIC_ANTHROPIC_API_KEY

# Dev build (recommended — Reanimated v4 + FlashList v2 need New Architecture)
npx expo run:ios      # or: npx expo run:android
```

Or run the JS bundle in an existing dev client / Expo Go with `npx expo start` (native FPS overlay shows `—` in Expo Go).

Requirements: Node 20+, Xcode (iOS) or Android Studio (Android).

## Tech Stack


| Tech                      | Purpose                      |
| ------------------------- | ---------------------------- |
| Expo SDK 56 / Expo Router | Runtime + file-based routing |
| TypeScript (strict)       | Type safety                  |
| Zustand                   | State management             |
| FlashList v2              | Virtualized feed             |
| Reanimated v4             | UI-thread animations         |
| @gorhom/bottom-sheet      | AI chat sheet                |
| expo-image                | Cached remote images         |


## State Management

Plain **Zustand** with three small, isolated stores — no Redux boilerplate, no context churn:


| Store              | Holds                                |
| ------------------ | ------------------------------------ |
| `feedStore`        | Travel bundles + load status         |
| `chatStore`        | Messages + thinking/streaming flags  |
| `performanceStore` | Frame drops + percentiles (dev only) |


**Rationale:**

- **Isolated stores** so updating chat or perf metrics never rerenders the feed.
- **Selectors everywhere** — components subscribe to the smallest slice they need.
- **Stores never subscribed in views.** Only feature hooks (the ViewModel layer) read stores and call repositories/services; components receive props. See [ARCHITECTURE.md](ARCHITECTURE.md).
- **Sheet open/close is a ref method, not state**, so opening the chat never rerenders the feed.

## Features

- **Feed** — 120 virtualized travel cards (FlashList v2), expand/collapse itinerary per card, pull-to-refresh (iOS + Android).
- **AI chat** — bottom sheet over the feed (50% / 92% snaps). Streams token-by-token from Anthropic when `EXPO_PUBLIC_ANTHROPIC_API_KEY` is set; otherwise uses mock streaming.
- **Performance overlay** — tap **Perf** (bottom-left, dev only) for live FPS, frame-time percentiles, and drop counts. See [PERFORMANCE.md](PERFORMANCE.md).

## Known Limitations

- **Live AI needs a key.** Without `EXPO_PUBLIC_ANTHROPIC_API_KEY`, chat uses mock responses.
- **Dev build recommended.** Reanimated v4 / FlashList v2 rely on the New Architecture; the native FPS module does not run in Expo Go.
- **Mock data.** Bundles are generated locally and remote images need network access (picsum.photos); pull-to-refresh reloads the same mock set.
- **Overlay is for relative profiling**, not a replacement for native profilers — it adds its own small overhead.

## Scripts

```bash
npm start          # Expo dev server
npm run ios        # iOS
npm run android    # Android
npx tsc --noEmit   # Type-check
```

