# Architecture

This app uses **feature-first MVVM** with React Native conventions — no separate `viewModels/` folder. Responsibilities are enforced by import boundaries, not renames.

## Layer mapping

| MVVM layer | Folder(s) | Role |
|------------|-----------|------|
| **Model** | `store/`, `types/`, `data/`, `repositories/`, `services/` | Domain state, synchronous mutations, data acquisition |
| **ViewModel** | `hooks/` | Subscribes to stores, calls repositories/services, exposes UI state + commands |
| **View** | `components/` | Renders UI, forwards events via props or feature context — **never imports stores or services** |

## Data flow

```
View (components/)  →  events only  →  ViewModel (hooks/)
ViewModel (hooks/)  →  read/write   →  Model (store/, repositories/, services/)
View (components/)  - - - - - - - - →  Model  ✗ forbidden
```

## Per-feature flows

### Feed

1. `FeedScreen` calls `useFeedScreen()` (ViewModel).
2. `useFeedScreen` loads bundles via `feedRepository.loadFeedBundles()` on mount.
3. Repository wraps `generateBundles()` today; swap for a real API later.
4. `feedStore` holds `bundles` + `status`; no data generation at import time.
5. `FeedScreen` passes `bundles`, `isReady`, and `contentBottomPadding` to child views.

### Chat

1. `ChatBottomSheet` wraps content with `ChatSheetProvider`.
2. `useChatSheet` is the **single** ViewModel instance — owns `useStreamingResponse()` (one stream controller).
3. `ChatMessageList`, `ChatSheetFooter`, and `TypingIndicator` read from `useChatSheetContext()`.
4. `chatStore` holds messages and thinking/streaming flags; streaming orchestration lives in `useStreamingResponse`, imported only by `useChatSheet`.

```
ChatBottomSheet
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
3. **View** — Screen component calls **one** feature hook; leaf components receive props only.
4. **Route** — Wire the screen in `src/app/` via Expo Router.

## Anti-patterns

- Importing `store/` or `services/` from `components/` — use a hook instead.
- Calling the same side-effect hook (`useStreamingResponse`) in multiple views — one ViewModel instance per feature surface (Provider pattern for chat).
- Generating or fetching data inside store module init — use repositories + explicit load actions.
- Putting business logic inline in `_layout.tsx` — use `useAppShell` or a feature hook.

## Import boundary rule

```
components/  →  hooks/, types/, shared/
hooks/       →  store/, repositories/, services/, types/, shared/
store/       →  types/ only (no API calls, timers, or streaming)
repositories/→  data/, services/, types/
```
