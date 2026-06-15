# Architecture

This app uses **feature-first MVVM** with React Native conventions — no separate `viewModels/` folder. Responsibilities are enforced by import boundaries, not renames.

## Layer mapping

| MVVM layer | Folder(s) | Role |
|------------|-----------|------|
| **Model** | `store/`, `types/`, `data/`, `repositories/`, `services/` | Domain state, synchronous mutations, data acquisition |
| **ViewModel** | `hooks/` | Subscribes to stores, calls repositories/services, exposes UI state + commands |
| **View** | `components/` (organisms, molecules, atoms) + `features/*/screens/` | Reusable UI in `components/`; route surfaces in `features/*/screens/` — **never import stores or services** |

## UI layer (atomic design)

Reusable UI lives under `src/components/`. Route **screens** live under `features/{feature}/screens/` — one per Expo Router path. Overlays (chat sheet, FAB, dev perf HUD) are **organisms**, not screens.

| Tier | Location | Criteria |
|------|----------|----------|
| **Atom** | `components/atoms/` | Single-purpose UI (AppText, Badge, PillButton, …) |
| **Molecule** | `components/molecules/common/` or `components/molecules/{feature}/` | Composes atoms; props in, events out |
| **Organism** | `components/organisms/{feature}/` | Feature UI section (lists, sheets, overlays); may use hooks/context; never store/services |
| **Screen** | `features/{feature}/screens/` | Route surface; calls exactly one ViewModel hook; not reusable |

```
src/components/                   → reusable UI only (no screens/)
├── atoms/                        → AppText, Badge, PillButton, …
├── molecules/
│   ├── common/                   → ScreenHeader, AvatarIcon, MessageBubble, AnimatedFab
│   ├── feed/                     → TravelCardHero, ItineraryRow, …
│   ├── chat/                     → ChatInput, ChatMessageBubble, …
│   └── performance/              → NativeMetricText, StaticMetricText
└── organisms/
    ├── feed/                     → TravelFeedList, TravelCard, FeedFab, …
    ├── chat/                     → ChatBottomSheet, ChatMessageList, …
    └── performance/              → PerformanceOverlay, DevOverlayToggle

features/feed/    → screens/FeedScreen, hooks/, store/, repositories/, types/, data/
features/chat/    → hooks/, store/, context/, services/, types/, data/
features/shared/  → constants/, utils/, hooks/
```

**Promotion rule:** when a molecule or organism is used by 2+ features, move it to `molecules/common/` or `organisms/common/`.

**Import rules:** Atoms import only `features/shared/constants`. Molecules import atoms + shared. Organisms and screens may import `features/*/hooks` or `features/*/context` — never `store/` or `services/` directly. React Compiler is enabled (`experiments.reactCompiler` in app config) — do not use manual `memo()`, `useCallback`, or `useMemo` in UI components; use `'use no memo'` only to opt out.

## Data flow

```
View (features/*/screens/, organisms/, molecules/)  →  events only  →  ViewModel (hooks/)
ViewModel (hooks/)                       →  read/write   →  Model (store/, repositories/, services/)
View                                     - - - - - - - - →  Model  ✗ forbidden
```

## Per-feature flows

### Feed

1. `FeedScreen` calls `useFeedScreen()` (ViewModel).
2. `useFeedScreen` loads bundles via `feedRepository.loadFeedBundles()` on mount, and exposes a `refresh()` command + `isRefreshing` flag for pull-to-refresh.
3. Repository wraps `generateBundles()` today; swap for a real API later.
4. `feedStore` holds `bundles` + `status`; no data generation at import time.
5. `FeedScreen` (in `features/feed/screens/`) passes `bundles`, `isReady`, `isRefreshing`, `refresh`, and `contentBottomPadding` to `TravelFeedList`, which wires a themed `RefreshControl`.

### Chat

1. `ChatBottomSheet` wraps content with `ChatSheetProvider`.
2. `useChatSheet` is the **single** ViewModel instance — owns `useStreamingResponse()` (one stream controller).
3. `ChatMessageList`, `ChatSheetFooter`, and `TypingIndicator` read from `useChatSheetContext()`.
4. `chatStore` holds messages and thinking/streaming flags; streaming orchestration lives in `useStreamingResponse`, imported only by `useChatSheet`.

```
ChatBottomSheet (components/organisms/chat/)
└── ChatSheetProvider (useChatSheet)
    ├── BottomSheet
    │   └── ChatMessageList  → useChatSheetContext()
    └── footer: ChatSheetFooter → useChatSheetContext()
```

### Performance (dev)

1. `usePerformanceInstrumentation` runs from the app shell — feeds the metrics pipeline (Model side-effect).
2. `usePerformanceOverlay` / `useDevOverlayToggle` subscribe to store + metrics context.
3. `PerformanceOverlay` and `DevOverlayToggle` are dumb views fed by those hooks.

### App shell

1. `useAppShell` handles fonts, splash hide, chat sheet ref, and open/close state.
2. `_layout.tsx` is pure composition: providers + `<Slot />` + `<AppOverlays />`.
3. Overlays (FAB, chat sheet, perf toggle) stay **siblings** of the feed route so opening chat does not remount the list.

## Adding a new screen

1. **Model** — Add types, store slice, and/or repository for data.
2. **ViewModel** — Add a feature hook (e.g. `useMyScreen`) that loads data, selects store state, and returns props/commands.
3. **View** — Add organisms/molecules in `components/`; add a screen in `features/{feature}/screens/` that calls **one** feature hook.
4. **Route** — Wire the screen in `src/app/` via Expo Router.

## Anti-patterns

- Importing `store/` or `services/` from screens, organisms, or molecules — use a hook instead.
- Calling the same side-effect hook (`useStreamingResponse`) in multiple views — one ViewModel instance per feature surface (Provider pattern for chat).
- Generating or fetching data inside store module init — use repositories + explicit load actions.
- Putting business logic inline in `_layout.tsx` — use `useAppShell` or a feature hook.

## Import boundary rule

```
features/*/screens/   →  organisms/, molecules/, atoms/, features/*/hooks, features/shared/
components/organisms/   →  molecules/, atoms/, features/*/hooks, features/*/context, features/shared/
components/molecules/ →  atoms/, features/shared/
components/atoms/     →  features/shared/constants only
features/hooks/       →  store/, repositories/, services/, types/, shared/
features/store/       →  types/ only (no API calls, timers, or streaming)
features/repositories/→  data/, services/, types/
```
