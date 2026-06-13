# Performance Documentation

## Measurement Methodology

### Metric Summary

| Metric | Source | Thread | Update Rate | Notes |
|--------|--------|--------|-------------|-------|
| UI FPS (compositor) | `timeSincePreviousFrame` via `useFrameCallback` | Native UI | Display ~2Hz (500ms EMA) | Compositor frame pacing |
| JS FPS (event loop) | JS rAF delta, auto-calibrated ×1 or ×2 | JS | Display ~2Hz (500ms EMA) | Event loop cadence, not compositor |
| Session Drops | `frameTime > 22.2ms` | Native UI | 1Hz store sync | Cumulative since overlay open |
| P50 / P95 / Worst | Last 60 frame times | Native UI → JS | 1Hz | ~1 second rolling window |
| JS Scheduling | setInterval→rAF drift > 50ms | JS | 10Hz probe | Scheduling heuristic, not a profiler |

### UI FPS (Native Compositor)

UI frame metrics use Reanimated `useFrameCallback` on the native UI thread:

1. Each frame provides `timeSincePreviousFrame` from Reanimated's UI worklet frame registry
2. Frame time is EMA-smoothed (α=0.08)
3. Display updates at most every **500ms** with ±1 FPS hysteresis
4. Formula: `uiFps = round(1000 / emaFrameTimeMs)`

Instantaneous per-frame FPS is never shown — normal 60Hz jitter would flicker 58–62.

### JS FPS (Event Loop Cadence)

JS FPS measures the delta between consecutive JS `requestAnimationFrame` callbacks:

1. Sampled every 32ms, EMA-smoothed (α=0.08)
2. Display refreshed at most every 500ms with ±1 FPS hysteresis
3. **Auto-calibration**: After 500ms warmup, compares average JS rAF delta to UI frame time over 20 samples. If `avg(jsDelta / uiFrameTime) >= 1.35`, applies Reanimated-style **×2 multiplier** (RN JS rAF often fires every other display frame)
4. Written to a `SharedValue` — zero React re-renders

### Warmup Exclusion

The first **500ms** after opening the overlay is excluded from:

- Frame drop counting
- Percentile buffer samples
- JS FPS calibration

This reduces skew from overlay mount/layout and instrumentation startup.

### Observer Effect

When the overlay is visible, the measurer itself consumes CPU (frame callback, JS rAF probe, animated metric text). The overlay displays: *"Metrics include dev overlay overhead"*. Use metrics for **relative comparisons** (before/after changes), not absolute production baselines.

### Instrumentation Lifecycle

Tracking runs **only when the dev overlay is visible**.

When overlay is off:

- No `useFrameCallback`
- No JS rAF probe
- No JS scheduling interval
- No Zustand metric writes

### Frame Drop Detection

A frame drop is counted when:

- `frameTime > 22.2ms` (exceeds ~45fps budget)

Drops accumulate as **Session Drops** (cumulative since overlay opened) and sync to Zustand at 1Hz.

### JS Scheduling Detection

Every 100ms (overlay visible only):

1. `setInterval` records `performance.now()`
2. Schedules `requestAnimationFrame`
3. Measures drift between scheduled time and rAF execution

- Drift `> 50ms` → **JS Busy**
- Otherwise → **Healthy**

This detects **event loop scheduling delay**, not synchronous JS blocking during a frame. Label: **JS Scheduling**.

### Percentile Calculation

Every 1 second, the last **60 frame times** (~1 second at 60Hz) are snapshotted from the rolling buffer. Percentiles use **quickselect** on the JS thread — O(n) per second, not per frame.

---

## Previous Issues (Fixed)

| Issue | Fix |
|-------|-----|
| rAF + Zustand 60/sec caused self-inflicted jank | Native UI frame callback + SharedValue display |
| P50/P95 used 5-second buffer | Last 60 frames only (~1s window) |
| JS FPS read ~30 while UI read ~60 | Auto-calibrated ×2 when rAF cadence is half display rate |
| Warmup frames skewed drops/percentiles | 500ms exclusion after overlay open |
| FPS display flickered on idle | EMA + 500ms throttle + hysteresis |
| PERFORMANCE.md out of sync | Rewritten to match implementation |

---

## Bottleneck Case Study

### Before: Parent-Held Expansion State

| Metric | Before |
|--------|--------|
| FPS | ~43 |
| Frame Drops | High during expand |
| P50 Frame Time | ~23ms |
| P95 Frame Time | ~38ms |

### After: Local Card State + UI-Thread Animation

| Metric | After |
|--------|--------|
| FPS | ~58 |
| Frame Drops | Minimal during expand |
| P50 Frame Time | ~16ms |
| P95 Frame Time | ~22ms |

---

## Validation Checklist

| Scenario | Expected |
|----------|----------|
| Overlay off | Zero metric store activity |
| Idle + overlay on (after warmup) | UI FPS stable ~60 (or ~120 ProMotion), JS FPS comparable |
| Fast scroll feed | UI FPS dips, P95 rises, session drops increment |
| Chat streaming | JS Scheduling may flip; UI FPS stays higher than JS FPS under load |

---

## Tradeoffs

### Native Performance Overlay

**Decision**: UI/JS FPS via SharedValues + animated props; Zustand only for 1Hz percentiles and session drops.

**Benefit**: Overlay measures without becoming the primary jank source.

**Cost**: More complex than React state; metrics include overlay overhead.

### Image Caching (expo-image)

**Benefit**: Smoother scrolling with disk+memory cache.

**Cost**: Higher memory footprint.

### Zustand Store Isolation

**Benefit**: Chat/performance updates never trigger feed rerenders.

**Cost**: Slightly more coordination boilerplate at root layout.
