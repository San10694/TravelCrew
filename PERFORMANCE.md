# Performance

A dev-only overlay measures FPS, frame-time percentiles, and dropped frames. Tap **Perf** (bottom-left, dev build) to toggle it. Instrumentation runs **only while the overlay is open** ([`usePerformanceInstrumentation.ts`](src/features/performance/hooks/usePerformanceInstrumentation.ts)).

## FPS measurement methodology

Two FPS numbers, measured independently, matching React Native's Perf Monitor:

| Metric | How it's measured | Thread |
|--------|-------------------|--------|
| **UI FPS** | Native `dev-menu-fps` module counts frames via `CADisplayLink` (iOS) / `Choreographer` (Android): `round(frames / elapsedSeconds)` over a ~1s window | Main/UI |
| **JS FPS** | `requestAnimationFrame` tick count over ~1s ([`jsFpsCounter.ts`](src/features/performance/services/jsFpsCounter.ts)) | JS |

Both are **clamped to the display refresh rate** via [`clampFps.ts`](src/features/performance/services/clampFps.ts) so rounding can't report 61 on a 60 Hz screen. They start at the device max (60, or 120 on ProMotion) until the first window completes.

Why split them: native JS `CADisplayLink` doesn't fire on the New Architecture, so JS FPS uses `rAF` instead. UI FPS should stay higher than JS FPS under load.

### Supplementary metrics (beyond the dev menu)

- **Frame-time percentiles (p50 / p95 / worst)** — rolling buffer of the last 60 UI frame times, percentiles via quickselect ([`frameStatsCalculator.ts`](src/features/performance/services/frameStatsCalculator.ts)).
- **Session drops** — frames slower than 22.2 ms, counted since the overlay opened.
- **JS scheduling** — `setInterval`→`rAF` drift > 50 ms flags "JS Busy" (heuristic, not a profiler).
- First 500 ms after opening is excluded as warmup.

## Identified bottleneck: chat token streaming

**Symptom:** while the AI reply streamed, the chat janked and JS FPS sagged.

**Cause:** every streamed token wrote to `chatStore`, so each token triggered a Zustand update + rerender of the message list — dozens of renders per second.

**Fix:** batch tokens before writing ([`useStreamingResponse.ts`](src/features/chat/hooks/useStreamingResponse.ts)) — flush at most every **32 ms** or every **4 chars**, whichever comes first. This caps store writes at ~30/s regardless of token rate.

```ts
const BATCH_INTERVAL_MS = 32;
const BATCH_CHAR_THRESHOLD = 4;
```

### Before / after

Captured from the in-app overlay during a streamed mock reply, Android dev build (Samsung Galaxy S23). Numbers are relative overlay readings, not lab-grade — re-measure on your device.

| Metric (during stream) | Before (per-token write) | After (batched) |
|------------------------|--------------------------|-----------------|
| JS FPS | ~46 | ~58 |
| Frame time **p50** | ~14 ms | ~9 ms |
| Frame time **p95** | ~38 ms | ~13 ms |
| Session drops (10 s stream) | ~40 | ~3 |

**Reproduce:** open Perf overlay → open chat → send a message → watch JS FPS and p95 during the reply. To see the "before", temporarily flush on every token (set `BATCH_CHAR_THRESHOLD = 1` and skip the interval).

## Caveats

- The overlay adds its own overhead — use it for **before/after comparisons in dev**, not absolute production baselines.
- Native FPS needs a dev build; Expo Go / web show `—`.

## Setup

```bash
npx expo run:ios     # or run:android (dev build required for native FPS)
```
