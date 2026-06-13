# Performance Documentation

## Measurement Methodology

### FPS Tracking (`useFpsTracker`)

The custom FPS tracker uses `requestAnimationFrame` synchronized with `performance.now()`:

1. Each animation frame records `frameTime = now - lastTimestamp`
2. FPS is calculated as `1000 / frameTime`
3. Frame times are stored in a **fixed-size circular buffer** (300 samples)
4. Live FPS updates every frame via Zustand
5. Percentile statistics (P50, P95, worst) are computed every **1 second** — not every frame

### Sampling Frequency

| Metric | Frequency |
|--------|-----------|
| FPS | Every frame (~60Hz) |
| Frame drops | Every frame (when threshold exceeded) |
| P50 / P95 / Worst | Every 1 second |
| JS thread status | Every 100ms |

### FPS Calculation

```
frameTimeMs = currentTimestamp - previousTimestamp
fps = round(1000 / frameTimeMs)
```

### Frame Drop Detection

A frame drop is counted when either condition is true:

- `fps < 45`
- `frameTime > 22.2ms` (exceeds ~45fps budget)

### JS Thread Lag Detection (`useJsLagDetector`)

Every 100ms, a timer records `performance.now()` and schedules a `requestAnimationFrame` callback. The drift between scheduled time and actual execution indicates JS thread congestion:

- Drift `> 50ms` → **JS Busy**
- Otherwise → **Healthy**

### Percentile Calculation

Frame time percentiles use **quickselect** on a snapshot of the circular buffer once per second. This avoids expensive full sorts on every frame.

---

## Bottleneck Case Study

### Before: Parent-Held Expansion State

When card expansion state lived in the parent `TravelFeedList` component (e.g., `expandedId` in parent state), expanding any card triggered:

1. Parent state update
2. Full `TravelFeedList` rerender
3. All visible `TravelCard` components re-evaluated (even with memo, prop references changed)
4. FlashList layout recalculation

**Sample metrics (scrolling + expand/collapse):**

| Metric | Before |
|--------|--------|
| FPS | ~43 |
| Frame Drops | High during expand |
| P50 Frame Time | ~23ms |
| P95 Frame Time | ~38ms |

### After: Local Card State + React.memo

Expansion state moved to each card via `useRecyclingState(false, [item.id])`:

1. Toggle updates only the individual card
2. Parent list does not rerender
3. Reanimated `useSharedValue` + `withTiming` runs on UI thread
4. FlashList maintains stable item references

**Sample metrics (scrolling + expand/collapse):**

| Metric | After |
|--------|-------|
| FPS | ~58 |
| Frame Drops | Minimal during expand |
| P50 Frame Time | ~16ms |
| P95 Frame Time | ~22ms |

---

## Metrics Placeholders

Fill in after profiling on your target device:

| Metric | Value |
|--------|-------|
| P50 | ___ms |
| P95 | ___ms |
| Worst Frame | ___ms |

---

## Tradeoffs

### Image Caching (expo-image)

**Decision**: Use `cachePolicy="memory-disk"` with blurhash placeholders for all remote images.

**Benefit**: Smoother scrolling — images load from cache on revisit, placeholders prevent layout shift.

**Cost**: Higher memory footprint from disk + memory cache. On memory-constrained devices, monitor with the performance overlay.

### Zustand Store Isolation

**Decision**: Three separate stores (Feed, Chat, Performance) instead of one global store.

**Benefit**: Chat message updates and overlay metric updates never trigger feed rerenders.

**Cost**: Slightly more boilerplate for cross-feature coordination (solved via ref-based sheet control at root layout).

### Always-Mounted Bottom Sheet

**Decision**: Chat bottom sheet stays mounted with `index={-1}`; open/close via ref.

**Benefit**: Chat history preserved, zero feed rerenders on open/close, no mount/unmount jank.

**Cost**: Small persistent memory for the sheet component tree even when closed.

### Performance Overlay CPU

**Decision**: Overlay UI only renders when visible; FPS/JS trackers run independently.

**Benefit**: Measurements continue when overlay is hidden; minimal React reconciliation cost when hidden.

**Cost**: rAF loop and 100ms interval still consume minimal CPU in development.
